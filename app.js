class Point {
    constructor(name, xPosition, yPosition, speed) {
        this.name = name;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.speed = speed;
    }
}

class Points {
    static getPoints() {
        let points = [];

        return points;
    }

    static addPoint() {
        const points = Points.getPoints();
        const point = new Point('Unnamed point', 200, 200, 1);

        points.push(point);        
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

    addPoint() {
        const newPoint = document.createElement('div');
        newPoint.classList.add('point');

        const points = Points.getPoints();
        newPoint.id = 'point' + points.length;
        this.dragPoint(newPoint);
        document.body.append(newPoint);
    }

    dragPoint(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(event) {
            event = event || window.event;
            event.preventDefault();
            pos3 = event.clientX;
            pos4 = event.clientY;
            document.onmouseup = closeDragPoint;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(event) {
            event = event || window.event;
            event.preventDefault();
            pos1 = pos3 - event.clientX;
            pos2 = pos4 - event.clientY;
            pos3 = event.clientX;
            pos4 = event.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragPoint() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    removePoint() {

    }

    clearPoints() {

    }

    runFindClosestMeet () {

    }

    runFindConstantMotionMeet() {

    }
}

document.getElementById('add-new-point').addEventListener('click', function () {
    Points.addPoint();
    const uI = new UI();
    uI.addPoint();
});
