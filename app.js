class Point {
    constructor(name, id, xPosition, yPosition, speed) {
        this.name = name;
        this.id = id;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.speed = speed;
    }
}

class PointStore {
    static points = [];

    static getPoints() {
        if (PointStore.points.length === 0) {
            if (localStorage.getItem('points') === null) {
                PointStore.points = [];
            } else {
                PointStore.points = JSON.parse(localStorage.getItem('points'));
            }
        } else {
            return PointStore.points;
        }

        return PointStore.points;
    }

    static addPoint() {
        const id = PointStore.points.length;
        const xPosition = (200 + (20 * PointStore.points.length));
        const point = new Point('', id, xPosition, 200, 10);

        PointStore.points.push(point);
        localStorage.setItem('points', JSON.stringify(PointStore.points));      
    }

    static updatePointName(id, name) {
        PointStore.points[id].name = name;
        localStorage.setItem('points', JSON.stringify(PointStore.points));
    }

    static updatePointPosition(id, xPosition, yPosition) {
        PointStore.points[id].xPosition = xPosition;
        PointStore.points[id].yPosition = yPosition;
        localStorage.setItem('points', JSON.stringify(PointStore.points));
    }
    
    static updatePointSpeed(id, speed) {
        PointStore.points[id].speed = parseInt(speed);
        localStorage.setItem('points', JSON.stringify(PointStore.points));
    }

    static removePoint(id) {
        PointStore.points.splice(id, 1);
        PointStore.reassignPointIds(id);
        localStorage.setItem('points', JSON.stringify(PointStore.points));
    }

    static reassignPointIds(id) {
        for (let i = id; i < PointStore.points.length; i++) {
            PointStore.points[i].id = i;
        }
    }

    static clearPoints() {
        localStorage.clear();
    }

    static displayPoints() {
        const uI = new UI();
        uI.displayPoints();
    }
}

class Algorithm {
    static findClosestMeet(points) {

    }

    static findConstantMotionMeet(points) {

    }
}

class UI {
    constructor() {}

    static animationSpeed = 1;
    static selectedPointId = '';

    drawPoint(point) {
        const newPoint = document.createElement('div');
        newPoint.classList.add('point');

        if (point) {
            newPoint.id = point.id;
            newPoint.style.left = point.xPosition.toString() + 'px';
            newPoint.style.top = point.yPosition.toString() + 'px';
        } else {
            newPoint.id = PointStore.points[PointStore.points.length - 1].id;
            const xPositionMultiplier = 20 * (PointStore.points.length - 1);
            newPoint.style.left = (200 + xPositionMultiplier).toString() + 'px';
            newPoint.style.top = '200px';
        }

        document.querySelector('.container').append(newPoint);

        this.dragPoint(newPoint);
        this.addClickEventListener(newPoint);
    }

    dragPoint(point) {
        const self = this;
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        point.onmousedown = dragMouseDown;

        function dragMouseDown(event) {
            event = event || window.event;
            event.preventDefault();

            pos3 = event.clientX;
            pos4 = event.clientY;

            document.onmousemove = pointDrag;
            document.onmouseup = closeDragPoint;
        }
        
        function pointDrag(event) {
            event = event || window.event;
            event.preventDefault();

            pos1 = pos3 - event.clientX;
            pos2 = pos4 - event.clientY;
            pos3 = event.clientX;
            pos4 = event.clientY;

            point.style.top = (point.offsetTop - pos2) + "px";
            point.style.left = (point.offsetLeft - pos1) + "px";
            self.updatePointPositionFields();
        }

        function closeDragPoint() {
            const uI = new UI();
            const xPosition = parseInt(uI.extractNumberValue(document.getElementById(UI.selectedPointId).style.left));
            const yPosition = parseInt(uI.extractNumberValue(document.getElementById(UI.selectedPointId).style.top));


            PointStore.updatePointPosition(UI.selectedPointId, xPosition, yPosition);
            localStorage.setItem('points', JSON.stringify(PointStore.points));

            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    updatePointPositionFields() {
        const selectedPoint = document.getElementById(UI.selectedPointId);

        document.getElementById('x-position-input').value = this.extractNumberValue(selectedPoint.style.left);
        document.getElementById('y-position-input').value = this.extractNumberValue(selectedPoint.style.top);
    }

    updatePointSpeedField() {
        document.getElementById('speed-input').value = PointStore.points[UI.selectedPointId].speed;
    }

    updatePointNameField() {
        document.getElementById('name-input').value = PointStore.points[UI.selectedPointId].name;
    }

    extractNumberValue(positionString) {
        return positionString.slice(0, (positionString.length - 2));
    }

    addClickEventListener(point) {
        let self = this;
        point.addEventListener('mousedown', function () {
            if (UI.selectedPointId) {
                self.toggleHighlightPoint();
            }

            UI.selectedPointId = point.id;
            self.toggleHighlightPoint();
            self.updatePointPositionFields();
            self.updatePointSpeedField();
            self.updatePointNameField();
            self.openPointSettings(point);
        });
    }

    openPointSettings(point) {
        document.getElementById('point-settings').classList.add('settings-box-view');
    }

    closePointSettings() {
        document.getElementById('point-settings').classList.remove('settings-box-view');
        this.toggleHighlightPoint();
        UI.selectedPointId = '';
        console.log(PointStore.points);
    }

    toggleHighlightPoint() {
        const selectedPoint = document.getElementById(UI.selectedPointId);

        if (selectedPoint) {
            if (selectedPoint.classList.contains('highlight')) {
                selectedPoint.classList.remove('highlight');
            } else {
                selectedPoint.classList.add('highlight');
            }
        }
    }

    displayPoints() {
        let self = this;
        const points = PointStore.getPoints();

        points.forEach(function (point) {
            self.drawPoint(point);
        });
    }

    removePoint() {
        document.getElementById(UI.selectedPointId).remove();
        PointStore.removePoint(parseInt(UI.selectedPointId));
        this.closePointSettings();
    }

    clearPoints() {
        PointStore.points.forEach(function (point) {
            document.getElementById(point.id).remove();
        });

        PointStore.points = [];
        this.closePointSettings();
    }

    findClosestMeet () {

    }

    findConstantMotionMeet() {

    }
}

document.addEventListener('DOMContentLoaded', PointStore.displayPoints);

document.getElementById('add-new-point').addEventListener('click', function () {
    PointStore.addPoint();
    const uI = new UI();
    uI.drawPoint();
});

document.body.addEventListener('mousedown', function (event) {
    if (!event.target.classList.contains('point')) {
        if (!document.getElementById('point-settings').contains(event.target)) {
            const uI = new UI();
            uI.closePointSettings();
        } else if (event.target.classList.contains('material-icons')) {
            const uI = new UI();
            uI.closePointSettings();
        }
    }
});

document.getElementById('delete-point').addEventListener('click', function (event) {
    const uI = new UI();
    uI.removePoint();
});

document.getElementById('clear-points').addEventListener('click', function () {
    if (confirm('Are you sure you would like to clear all points?')) {
        const uI = new UI();
        uI.clearPoints();
        PointStore.clearPoints();
    }
});

document.getElementById('speed-input').addEventListener('keyup', function (event) {
    PointStore.updatePointSpeed(UI.selectedPointId, event.target.value)
});

document.getElementById('name-input').addEventListener('keyup', function (event) {
    PointStore.updatePointName(UI.selectedPointId, event.target.value);
});
