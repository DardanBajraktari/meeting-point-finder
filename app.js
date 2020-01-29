function onInit() {
    const uI = new UI();

    PointStore.displayPoints();
    uI.initialiseVacatedPositions();
    uI.toggleRunEnabled();
    uI.showInstructions();
}

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
        
        if (name === '') {
            document.getElementById(id).setAttribute('data-tooltip', 'Unnamed point');
        } else {
            document.getElementById(id).setAttribute('data-tooltip', name);
        }

        $('#' + id).tooltip();
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
        const idAsInt = parseInt(id);
        PointStore.points.splice(idAsInt, 1);
        PointStore.reassignPointIds(idAsInt);
        localStorage.setItem('points', JSON.stringify(PointStore.points));
    }

    static reassignPointIds(id) {
        for (let i = id; i < PointStore.points.length; i++) {
            PointStore.points[i].id = i;
            document.getElementById((i + 1).toString()).id = i.toString();
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

class UI {
    constructor() {}

    static animationSpeed = 1;
    static selectedPointId = '';
    static vacatedPositions;

    showInstructions() {
        // Explain purpose of the application and how to use
    }

    initialiseVacatedPositions() {
        if (localStorage.getItem('vacatedPositions') === null) {
            UI.vacatedPositions = [];
        } else {
            console.log(JSON.parse(localStorage.getItem('vacatedPositions')));
            UI.vacatedPositions = JSON.parse(localStorage.getItem('vacatedPositions'));
        }
    }

    drawPoint(point) {
        const newPoint = document.createElement('div');

        newPoint.classList.add('point');
        newPoint.classList.add('tooltipped');

        if (point) {
            newPoint.id = point.id;
            newPoint.style.left = point.xPosition.toString() + 'px';
            newPoint.style.top = point.yPosition.toString() + 'px';
        } else {
            newPoint.id = PointStore.points[PointStore.points.length - 1].id;

            if (UI.vacatedPositions.length > 0) {
                PointStore.points[newPoint.id].xPosition = UI.vacatedPositions[0];
                newPoint.style.left = UI.vacatedPositions[0].toString() + 'px';

                console.log(UI.vacatedPositions);
                UI.vacatedPositions.shift();
                console.log(UI.vacatedPositions);

                localStorage.setItem('vacatedPositions', JSON.stringify(UI.vacatedPositions));
            } else {
                const xPositionMultiplier = 20 * (PointStore.points.length - 1);
                newPoint.style.left = (200 + xPositionMultiplier).toString() + 'px';
            }

            newPoint.style.top = '200px';
        }

        newPoint.setAttribute('data-position', 'top');
        newPoint.setAttribute('data-delay', '600');
        
        if (PointStore.points[newPoint.id].name === '') {
            newPoint.setAttribute('data-tooltip', 'Unnamed Point');
        } else {
            newPoint.setAttribute('data-tooltip', PointStore.points[newPoint.id].name);
        }

        document.querySelector('.container').append(newPoint);

        $('#' + newPoint.id).tooltip();
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

    closePointSettings(pointDeleted) {
        document.getElementById('point-settings').classList.remove('settings-box-view');

        if (!pointDeleted) {
            this.toggleHighlightPoint();
        }

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

    storeVacatedPosition(id) {
        if (PointStore.points[id].yPosition === 200) {
            const position = PointStore.points[id].xPosition;
            const positions = UI.vacatedPositions;
            let temp;
            let insertIndex;
    
            if (positions.length === 0) {
                positions.push(position);
            } else {
                if (position > positions[positions.length - 1]) {
                    positions.push(position);
                } else {
                    for (let i = 0; i < positions.length; i++) {
                        if (position < positions[i]) {
                            temp = positions[i];
                            positions[i] = position;
                            insertIndex = i;
                            break;
                        }
                    }
            
                    for (let i = (positions.length - 1); i > (insertIndex - 1); i--) {
                        if (i === insertIndex) {
                            positions[i + 1] = temp;
                        } else {
                            positions[i + 1] = positions[i];
                        }
                    }
                }
            }
        }
    }

    removePoint() {
        document.getElementById(UI.selectedPointId).remove();

        this.storeVacatedPosition(UI.selectedPointId);
        localStorage.setItem('vacatedPositions', JSON.stringify(UI.vacatedPositions));

        console.log(UI.vacatedPositions);

        PointStore.removePoint(UI.selectedPointId);
        this.closePointSettings('deleted point');
    }

    clearPoints() {
        PointStore.points.forEach(function (point) {
            document.getElementById(point.id).remove();
        });

        PointStore.points = [];
        this.closePointSettings();
        this.toggleRunEnabled();
    }

    toggleRunEnabled() {
        const runButton = document.getElementById('run-button');

        if (PointStore.points.length > 1) {
            runButton.classList = 'btn red lighten-2';
        } else {
            runButton.classList = 'btn red lighten-3';
        }
    }

    runAnimation(algorithm) {
        switch (algorithm) {
            case 'quickest meet':
                this.showQuickestMeet();
                break;
            case 'average meet':
                this.showAverageMeet();
                break;
            case 'in motion meet':
                this.showMeetInMotion();
                break;
            default:
                this.showQuickestMeet();
        }
    }

    showQuickestMeet() {
       Algorithms.findQuickestMeetPoint(PointStore.points);
    }

    showAverageMeet() {
        console.log(Algorithms.findAveragePoint(PointStore.points));
    }

    showMeetInMotion() {
    }
}

class Algorithms {
    static selectedAlgorithm = 'quickest meet';
    static shortestMeetTime;

    static distanceBetween(point1, point2) {
        const xDifference = Math.abs(point1.xPosition - point2.xPosition);
        const yDifference = Math.abs(point1.yPosition - point2.yPosition);
        const distanceBetweenPoints = Math.sqrt(Math.pow(xDifference, 2) + Math.pow(yDifference, 2));

        return distanceBetweenPoints;
    }

    static findTwoSlowestMeetPoint(points) {
        function findTwoSlowestPoints(points) {
            let currentPointsData;
            let slowerPoint;
            let slowerPointDistanceTravelled;
            let slowestPointsData = calculatePointsData(points[0], points[1]);
            let longestTime = slowestPointsData.meetTime;

            for (let i = 0; i < (points.length - 1); i++) {
                for (let j = (i + 1); j < points.length; j++) {
                    currentPointsData = calculatePointsData(points[i], points[j]);
    
                    if (currentPointsData.meetTime > longestTime) {
                        slowestPointsData = currentPointsData;
                        longestTime = currentPointsData.meetTime;
                    }
                }
            }

            function calculatePointsData(point1, point2) {
                const distanceBetweenPoints = Algorithms.distanceBetween(point1, point2);
                const point1DistanceTravelled = (point1.speed / (point1.speed + point2.speed)) * distanceBetweenPoints;
                const point2DistanceTravelled = distanceBetweenPoints - point1DistanceTravelled;
                const meetTime = point1DistanceTravelled / point1.speed;

                Algorithms.shortestMeetTime = meetTime;

                if (point1DistanceTravelled >= point2DistanceTravelled) {
                    slowerPoint = point1;
                    slowerPointDistanceTravelled = point1DistanceTravelled;
                } else {
                    slowerPoint = point2;
                    slowerPointDistanceTravelled = point2DistanceTravelled;
                }

                return {
                    point1: point1,
                    point2: point2,
                    meetTime: meetTime,
                    slowerPoint: slowerPoint,
                    point1DistanceTravelled,
                    slowerPointDistanceTravelled
                }
            }

            return slowestPointsData;
        }

        function findMeetPoint(points) {
            let meetingPoint = {
                xPosition: null,
                yPosition: null
            };

            const xDifference = points.point1.xPosition - points.point2.xPosition;
            const yDifference = points.point1.yPosition - points.point2.yPosition;
            const angle = Math.atan(yDifference / xDifference);

            const xDistanceToMeetPoint = points.point1DistanceTravelled * Math.cos(angle);
            const yDistanceToMeetPoint = points.point1DistanceTravelled * Math.sin(angle);

            if (xDifference < 0) {
                meetingPoint.xPosition = points.point1.xPosition + xDistanceToMeetPoint;
                meetingPoint.yPosition = points.point1.yPosition + yDistanceToMeetPoint;
            } else {
                meetingPoint.xPosition = points.point1.xPosition - xDistanceToMeetPoint;
                meetingPoint.yPosition = points.point1.yPosition - yDistanceToMeetPoint;
            }

            return meetingPoint;
        }

        const slowestPointsData = findTwoSlowestPoints(points);
        const twoSlowestMeetPoint = findMeetPoint(slowestPointsData);

        return {
            point1Id: slowestPointsData.point1.id,
            point2Id: slowestPointsData.point2.id,
            meetPoint: twoSlowestMeetPoint,
            slowerPoint: slowestPointsData.slowerPoint,
            slowerPointDistance: slowestPointsData.slowerPointDistanceTravelled
        };
    }

    static findQuickestMeetPoint(points) {
        const twoSlowest = Algorithms.findTwoSlowestMeetPoint(points);
        let slowestPoint = twoSlowest.slowerPoint;
        let slowestDistance = twoSlowest.slowerPointDistance;
        
        points.forEach(function (point) {
            if ((point.id !== twoSlowest.point1Id) && (point.id !== twoSlowest.point2Id)) {
                const distanceAway = Algorithms.distanceBetween(point, twoSlowest.meetPoint);

                if (distanceAway > slowestDistance) {
                    slowestDistance = distanceAway;
                    slowestPoint = point;
                }
            }
        });

        if (slowestPoint === twoSlowest.slowerPoint) {
            return twoSlowest.meetPoint;
        } else {
            return Algorithms.calculateLociIntersection(points);
        }
    }

    static calculateLociIntersection(points) {
        console.log('yo');

        return 10;
    }

    static findAveragePoint(points) {
        let sumX = 0;
        let sumY = 0;

        points.forEach(function (point) {
            sumX += parseInt(point.xPosition);
            sumY += parseInt(point.yPosition);
        });

        return {
            xPosition: (sumX / points.length),
            yPosition: (sumY / points.length)
        };
    }

    static findConstantMotionMeet(points) {

    }
}

document.addEventListener('DOMContentLoaded', onInit);

document.getElementById('quickest-meet-option').addEventListener('click', function () {
    Algorithms.selectedAlgorithm = 'quickest meet';
});

document.getElementById('average-meet-option').addEventListener('click', function () {
    Algorithms.selectedAlgorithm = 'average meet';
});

document.getElementById('in-motion-meet-option').addEventListener('click', function () {
    Algorithms.selectedAlgorithm = 'in motion meet';
});

document.getElementById('add-new-point').addEventListener('click', function () {
    PointStore.addPoint();
    const uI = new UI();
    uI.drawPoint();
    uI.toggleRunEnabled();
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
    uI.toggleRunEnabled();
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

document.getElementById('run-button').addEventListener('click', function () {
    if (PointStore.points.length > 1) {
        const uI = new UI();
        
        if (PointStore.points.length > 1) {
            uI.runAnimation(Algorithms.selectedAlgorithm);
        } else {
            alert('You have to have at least 2 points.');
        }
    }
});
