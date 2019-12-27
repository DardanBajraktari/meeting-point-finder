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
        let id = 'point' + (points.length + 1);
        const point = new Point('Unnamed point', id, 200, 200, 1);

        points.push(point);
        localStorage.setItem('points', JSON.stringify(points));
        console.log(points);      
    }

    static removePoint() {

    }

    static clearPoints() {

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
    constructor() {
        this.animationSpeed = 1;
    }

    drawPoint(point) {
        const newPoint = document.createElement('div');
        newPoint.classList.add('point');

        if (point) {
            newPoint.id = point.id;
        } else {
            const points = Points.getPoints();
            newPoint.id = points[points.length - 1].id;
        }

        document.querySelector('.container').append(newPoint);

        this.dragPoint(newPoint);
        this.getInfoOnClick(newPoint);
    }

    dragPoint(point) {
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
        }
    }

    getInfoOnClick(point) {
        let self = this;
        console.log(point);
        point.addEventListener('mousedown', function () {
            self.openPointSettings(point);
        });
    }

    displayPoints() {
        let self = this;
        const points = Points.getPoints();
        
        points.forEach(function (point) {
            self.drawPoint(point);
        });
    }

    openPointSettings(point) {
        document.getElementById('point-settings').classList.add('settings-box-view');
    }

    closePointSettings() {
        document.getElementById('point-settings').classList.remove('settings-box-view');
    }

    removePoint() {

    }

    clearPoints() {

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

document.body.addEventListener('click', function (event) {
    if (event.target.className !== 'point') {
        console.log(event.target);
        const uI = new UI();
        uI.closePointSettings();
    }
});
