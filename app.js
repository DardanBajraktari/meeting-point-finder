class Point {
    constructor(name, id, xPosition, yPosition, speed) {
        this.name = name;
        this.id = id;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.speed = speed;
    }
}

class Points {
    static getPoints() {
        let points;

        if (localStorage.getItem('points') === null) {
            points = [];
        } else {
            points = JSON.parse(localStorage.getItem('points'));
        }

        return points;
    }

    static addPoint() {
        const points = Points.getPoints();
        const id = 'point' + (points.length + 1);
        const point = new Point('Unnamed point', id, 200, 200, 1);

        points.push(point);
        localStorage.setItem('points', JSON.stringify(points));      
    }

    static removePoint(pointId) {
        const points = Points.getPoints();

        points.forEach(function (point, index) {
            if (point.id === pointId) {
                points.splice(index, 1);
            }
        });

        localStorage.setItem('points', JSON.stringify(points));
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
        } else {
            const points = Points.getPoints();
            newPoint.id = points[points.length - 1].id;
        }

        newPoint.style.left = '200px';
        newPoint.style.top = '200px';

        document.querySelector('.container').append(newPoint);

        this.dragPoint(newPoint);
        this.addOpenSettingsOnClickListener(newPoint);
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
        }

        function closeDragPoint() {
            document.onmouseup = null;
            document.onmousemove = null;
            self.updatePointPosition();
        }
    }

    updatePointPosition() {
        const selectedPoint = document.getElementById(UI.selectedPointId);
        document.getElementById('x-position-input').value = this.extractNumberValue(selectedPoint.style.left);
        document.getElementById('y-position-input').value = this.extractNumberValue(selectedPoint.style.top);
    }

    extractNumberValue(positionString) {
        return positionString.slice(0, (positionString.length - 2));
    }

    addOpenSettingsOnClickListener(point) {
        let self = this;
        point.addEventListener('mousedown', function () {
            UI.selectedPointId = point.id;
            self.openPointSettings(point);
        });
    }

    openPointSettings(point) {
        document.getElementById('point-settings').classList.add('settings-box-view');
    }

    closePointSettings() {
        document.getElementById('point-settings').classList.remove('settings-box-view');
    }

    displayPoints() {
        let self = this;
        const points = Points.getPoints();

        points.forEach(function (point) {
            self.drawPoint(point);
        });
    }

    removePoint() {
        document.getElementById(UI.selectedPointId).remove();
    }

    clearPoints() {
        const points = Points.getPoints();

        points.forEach(function (point) {
            document.getElementById(point.id).remove();
        });

        this.closePointSettings();
    }

    findClosestMeet () {

    }

    findConstantMotionMeet() {

    }
}

document.addEventListener('DOMContentLoaded', Points.displayPoints);

document.getElementById('add-new-point').addEventListener('click', function () {
    Points.addPoint();
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
    Points.removePoint(UI.selectedPointId);
    uI.removePoint();
    uI.closePointSettings();
});

document.getElementById('clear-points').addEventListener('click', function () {
    const uI = new UI();
    uI.clearPoints();
    Points.clearPoints();
});
