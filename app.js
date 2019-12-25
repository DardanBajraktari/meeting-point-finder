let animationSpeed = 1;

class Point {
    constructor(xPosition, yPosition, speed) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.speed = speed;
    }
}

class Algorithm {
    static findClosestMeet(points) {

    }

    static findConstantMotionMeet(points) {

    }
}

class UI {
    addPoint() {

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

dragPoint(document.getElementById('point1'));

function dragPoint(element) {
    const uI = new UI;
    uI.dragPoint(element);
}