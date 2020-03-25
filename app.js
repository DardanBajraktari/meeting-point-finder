function onInit() {
    const uI = new UI();

    PointStore.displayPoints();
    uI.initialiseVacatedPositions();
    uI.toggleRunEnabled();
    uI.updateTutorial();
    uI.initialiseMeetingPoint();
}

class Point {
    constructor(name, id, xPosition, yPosition, speed) {
        this.id = id;
        this.name = name;
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
    static animationSpeed = 1;
    static selectedPointId = '';
    static vacatedPositions;
    static currentTutorialIndex = 0;

    updateTutorial() {
        const tutorialTitles = ['Meet Point Finder Tutorial', 'Finding the Meet Point', 'Mode Options', 'Adding Points', 'Point Settings', 'Deleting Points', 'Animation Speed', 'That\'s all!'];
        const tutorialParagraphs = [
            'This tutorial will take you through the main features of this application. Click next to begin learning about meet-point finder, or feel free instead to press skip if you\'d prefer to dive right in!',
            'The purpose of the program is to find the optimal location for the objects, represented by points, to meet at. This meet point is calculated based on criteria chosen in the \'mode options\' menu. When the run button is clicked, an animation will demonstrate how the loci of the points develop in time and intersect to find this meet-point.',
            'In the \'Mode Options\' section of the main menu, you will be able to choose from a number of different criteria by which the optimal meeting-point for the points will be determined. By default, the quickest possible meet (point for all points to meet in the shortest time), is selected.',
            'By clicking the \'Add New Point\' button in the menu, you can add new points, with a maximum of 10, to the simulation. All points and point data will be saved, even after you close or refresh the page.',
            'You can set the position of any point by either dragging the point to a position with the cursor, or manually input the values for its x and y coordinate in the settings box, which is opened by clicking on the point you wish to edit. Here you can give the points names as well as set the speed at which the object represented by the point travels at.',
            'Points can be individually deleted by clicking the \'Delete Point\' button in its settings. You can also click the \'Clear Points\' button in the menu if you would like to delete all points. You will be prompted to confirm the decision.',
            'The speed at which the animation runs can be set in the \'Animation Speed\' menu section. You can choose from 0.5x, 1x (normal), 2x, and 4x.',
            'I hope you enjoy using this application! You can send me feedback or report any bugs by sending an email to bajraktaridardan5@gmail.com.'
        ];
        const tutorialImages = ['Images/points.png', 'Images/Meet Point.png', 'Images/modes.png', 'Images/Adding Points.png', 'Images/Point Settings.png', 'Images/Clear Points.png', 'Images/Animation Speed.png', 'Images/smile.png'];
        const nextButton = document.getElementById('next-button');

        document.getElementById('page-number').innerHTML = `${UI.currentTutorialIndex + 1}/8`;

        if (UI.currentTutorialIndex === 7) {
            nextButton.innerHTML = 'Finish';
            document.getElementById('previous-button').style.right = '22.75%';
        } else if (nextButton.innerHTML == 'Finish') {
            nextButton.innerHTML = 'Next';
            document.getElementById('previous-button').style.right = '21%';
        }

        document.getElementById('updatedTutorialElements').innerHTML = `
            <h3 class="blue-grey-text text-darken-2">${tutorialTitles[UI.currentTutorialIndex]}</h3>
            <p>${tutorialParagraphs[UI.currentTutorialIndex]}</p>
            <img src="${tutorialImages[UI.currentTutorialIndex]}" width="50%" height="40%">
        `;
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
        newPoint.setAttribute('data-delay', '500');
        
        if (PointStore.points[newPoint.id].name === '') {
            newPoint.setAttribute('data-tooltip', 'Unnamed Point');
        } else {
            newPoint.setAttribute('data-tooltip', PointStore.points[newPoint.id].name);
        }

        document.getElementById('points-container').append(newPoint);

        $('#' + newPoint.id).tooltip();
        this.dragPoint(newPoint);
        this.addClickEventListener(newPoint);
        this.addPointLocusCircle(newPoint.id);
    }

    addPointLocusCircle(id) {
        let locusCircle = document.createElement('div');

        locusCircle.classList.add('locus-circle');
        locusCircle.id = 'locus-circle' + id;
        document.getElementById('points-container').appendChild(locusCircle);
    }

    removePointLocusCircle(id) {
        function reassignLociCircleIds() {
            for (let i = (parseInt(id) + 1); i < PointStore.points.length; i++) {
                document.getElementById('locus-circle' + i.toString()).id = 'locus-circle' + (i - 1).toString();
            }
        }

        document.getElementById('locus-circle' + id).remove();
        reassignLociCircleIds();
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

            point.style.top = (point.offsetTop - pos2) + 'px';
            point.style.left = (point.offsetLeft - pos1) + 'px';
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

    initialiseMeetingPoint() {
        const meetingPoint = document.createElement('div');
        meetingPoint.classList.add('tooltipped');
        meetingPoint.id = 'meeting-point';
        meetingPoint.style.visibility = 'hidden';

        meetingPoint.setAttribute('data-position', 'top');
        meetingPoint.setAttribute('data-delay', '500');
        $('#meeting-point').tooltip();
        
        document.getElementById('points-container').appendChild(meetingPoint);
    }

    resetMeetingPoint() {
        const meetingPoint = document.getElementById('meeting-point');

        meetingPoint.style.visibility = 'hidden';
        meetingPoint.style.width = '1px';
        meetingPoint.style.height = '1px';
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
                for (let i = (positions.length - 1); i >= 0; i--) {
                    if (position > positions[i]) {
                        positions[i+1] = position;
                        break;
                    } else {
                        positions[i+1] = positions[i];

                        if (i === 0) {
                            positions[i] = position;
                        }
                    }
                }
            }
        }
    }

    removePoint() {
        this.removePointLocusCircle(UI.selectedPointId);
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
            document.getElementById('locus-circle' + point.id).remove();
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
            default:
                this.showQuickestMeet();
        }
    }

    displayMeetingPoint(meetPoint, meetTime) {
        setTimeout(function () {
            const meetingPoint = document.getElementById('meeting-point');

            meetingPoint.style.left = (meetPoint.xPosition + 8).toString() + 'px';
            meetingPoint.style.top = (meetPoint.yPosition + 8).toString() + 'px';
            meetingPoint.style.visibility = 'visible';
            meetingPoint.setAttribute('data-tooltip', '(' + Math.round(meetPoint.xPosition) + ', ' + Math.round(meetPoint.yPosition) + ')');

            $('#meeting-point').tooltip();

            meetingPoint.style.width = '18px';
            meetingPoint.style.height = '18px';
        }, (meetTime * 1000) / (4 * UI.animationSpeed) - 300);
    }

    showQuickestMeet() {
        const meetData = Algorithms.findQuickestMeetPoint(PointStore.points);
        const meetPoint = meetData.meetPoint;
        const meetTime = meetData.meetTime;
        const pointLoci = Array.from(document.querySelectorAll('.locus-circle'));

        console.log(meetPoint);

        this.resetMeetingPoint();

        pointLoci.forEach(function (pointLocus, index) {
            pointLocus.style.transition = 'none';
            pointLocus.style.width = '10px';
            pointLocus.style.height = '10px';

            setTimeout(function () {
                pointLocus.style.left = (PointStore.points[index].xPosition + 8).toString() + 'px';
                pointLocus.style.top = (PointStore.points[index].yPosition + 8).toString() + 'px';
                pointLocus.style.transition = 'width ' + (meetTime / (4 * UI.animationSpeed)).toString() + 's, height ' + (meetTime / (4 * UI.animationSpeed)).toString() + 's';
                pointLocus.style.width = (2 * PointStore.points[index].speed * meetTime).toString() + 'px';
                pointLocus.style.height = (2 * PointStore.points[index].speed * meetTime).toString() + 'px';
            }, 13);
        });

        this.displayMeetingPoint(meetPoint, meetTime);
    }

    showAverageMeet() {
        console.log(Algorithms.findAveragePoint(PointStore.points));
    }
}

class Algorithms {
    static selectedAlgorithm = 'quickest meet';

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
            let slowestPointsData = calculateMeetTime(points[0], points[1]);
            let longestTime = slowestPointsData.meetTime;

            for (let i = 0; i < (points.length - 1); i++) {
                for (let j = (i + 1); j < points.length; j++) {
                    currentPointsData = calculateMeetTime(points[i], points[j]);
    
                    if (currentPointsData.meetTime > longestTime) {
                        slowestPointsData = currentPointsData;
                        longestTime = currentPointsData.meetTime;
                    }
                }
            }

            function calculateMeetTime(point1, point2) {
                const distanceBetweenPoints = Algorithms.distanceBetween(point1, point2);
                const point1DistanceTravelled = (point1.speed / (point1.speed + point2.speed)) * distanceBetweenPoints;
                const point2DistanceTravelled = distanceBetweenPoints - point1DistanceTravelled;
                const meetTime = point1DistanceTravelled / point1.speed;

                Algorithms.shortestMeetTime = meetTime;

                return {
                    point1,
                    point2,
                    meetTime,
                    point1DistanceTravelled
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
            point1: slowestPointsData.point1,
            point2: slowestPointsData.point2,
            meetPoint: twoSlowestMeetPoint,
            meetTime: slowestPointsData.meetTime
        };
    }

    static findQuickestMeetPoint(points) {
        const twoSlowest = Algorithms.findTwoSlowestMeetPoint(points);
        const meetTime = twoSlowest.meetTime;
        let slowestPoint = twoSlowest.point1;
        let slowestTime = twoSlowest.meetTime;
            
        points.forEach(function (point) {
            if ((point.id !== twoSlowest.point1.id) && (point.id !== twoSlowest.point2.id)) {
                const distanceAway = Algorithms.distanceBetween(point, twoSlowest.meetPoint);
                const time = distanceAway / point.speed;

                if (time > slowestTime) {
                    slowestTime = time;
                    slowestPoint = point;
                }
            }
        });

        if (slowestPoint == twoSlowest.point1) {
            return {
                meetPoint: twoSlowest.meetPoint,
                meetTime: slowestTime
            };
        } else {
            return Algorithms.calculateLociIntersection(points, twoSlowest.point1, twoSlowest.point2, twoSlowest.meetPoint, slowestPoint, meetTime);
        }
    }

    static calculateLociIntersection(points, point1, point2, midPoint, slowestPoint, twoSlowestMeetTime) {
        function calculateSearchLimits() {
            const quarterPoint1XPosition = Math.round(point1.xPosition + (point2.xPosition - point1.xPosition) / 6);
            const quarterPoint1YPosition = Math.round(point1.yPosition + (point2.yPosition - point1.yPosition) / 6);

            const quarterPoint2XPosition = Math.round(point2.xPosition + (point1.xPosition - point2.xPosition) / 6);
            const quarterPoint2YPosition = Math.round(point2.yPosition + (point1.yPosition - point2.yPosition) / 6);

            const quarterPoint1 = {
                xPosition: quarterPoint1XPosition,
                yPosition: quarterPoint1YPosition
            };

            const quarterPoint2 = {
                xPosition: quarterPoint2XPosition,
                yPosition: quarterPoint2YPosition
            }

            return [quarterPoint1, quarterPoint2];
        }

        function findCoordinateSearchBounds() {
            const quarterPoints = calculateSearchLimits();
            const quarterPoint1 = quarterPoints[0];
            const quarterPoint2 = quarterPoints[1];

            let lowerBound;
            let upperBound;
            let coordinateValue;

            if (Math.abs(quarterPoint1.xPosition - quarterPoint2.xPosition) > Math.abs(quarterPoint1.yPosition - quarterPoint2.yPosition)) {
                if (quarterPoint1.xPosition < quarterPoint2.xPosition) {
                    lowerBound = quarterPoint1.xPosition;
                    upperBound = quarterPoint2.xPosition;
                } else {
                    lowerBound = quarterPoint2.xPosition;
                    upperBound = quarterPoint1.xPosition
                }

                coordinateValue = 'x';
            } else {
                if (quarterPoint1.yPosition < quarterPoint2.yPosition) {
                    lowerBound = quarterPoint1.yPosition;
                    upperBound = quarterPoint2.yPosition;
                } else {
                    lowerBound = quarterPoint2.yPosition;
                    upperBound = quarterPoint1.yPosition;
                }

                coordinateValue = 'y';
            }

            return {
                lowerBound,
                upperBound,
                coordinateValue
            }
        }

        function findMeetPoint(points, midPoint) {
            const searchBoundsData = findCoordinateSearchBounds();
            const lowerBound = searchBoundsData.lowerBound;
            const upperBound = searchBoundsData.upperBound;
            const coordinateValue = searchBoundsData.coordinateValue;
            let maxRadius = Algorithms.distanceBetween(slowestPoint, midPoint);
            let radius = slowestPoint.speed * twoSlowestMeetTime;
            let x;
            let y;

            console.log(maxRadius);

            for (let i = radius; i <= maxRadius + 50; i++) {
                for (let j = lowerBound; j <= upperBound; j++) {
                    if (coordinateValue === 'x') {
                        x = j;
                        
                        if (slowestPoint.yPosition > midPoint.yPosition) {
                            y = slowestPoint.yPosition - Math.sqrt(Math.pow(i, 2) - Math.pow((x - slowestPoint.xPosition), 2));
                        } else {
                            y = slowestPoint.yPosition + Math.sqrt(Math.pow(i, 2) - Math.pow((x - slowestPoint.xPosition), 2));
                        }
                    } else {
                        y = j;
                        
                        if (slowestPoint.xPosition > midPoint.xPosition) {
                            x = slowestPoint.xPosition - Math.sqrt(Math.pow(i, 2) - Math.pow((y - slowestPoint.yPosition), 2));
                        } else {
                            x = slowestPoint.xPosition + Math.sqrt(Math.pow(i, 2) - Math.pow((y - slowestPoint.yPosition), 2));
                        }
                    }

                    const currentPoint = {
                        xPosition: Math.floor(x),
                        yPosition: Math.floor(y)
                    };

                    // const newCircle = document.createElement('div');
                    // newCircle.classList.add('tracker-circle');
                    // newCircle.style.left = currentPoint.xPosition.toString() + 'px';
                    // newCircle.style.top = currentPoint.yPosition.toString() + 'px';
                    // document.body.appendChild(newCircle);

                    let distanceCurrentToPoint1 = Algorithms.distanceBetween(currentPoint, point1);
                    let distanceCurrentToPoint2 = Algorithms.distanceBetween(currentPoint, point2);
                    let distanceCurrentToSlowestPoint = Algorithms.distanceBetween(currentPoint, slowestPoint);
                    let averageTime = ((distanceCurrentToPoint1 / point1.speed) + (distanceCurrentToPoint2 / point2.speed) + (distanceCurrentToSlowestPoint / slowestPoint.speed)) / 3;

                    for (let acceptableDifference = 0.25; acceptableDifference >= 0.05; acceptableDifference -= 0.05) {
                        if ((Math.abs((distanceCurrentToPoint1 / point1.speed) - (distanceCurrentToPoint2 / point2.speed)) < acceptableDifference) && 
                            (Math.abs((distanceCurrentToPoint1 / point1.speed) - (distanceCurrentToSlowestPoint / slowestPoint.speed)) < acceptableDifference)) {

                            let maxMeetTime = 0;

                            for (let k = 0; k < points.length; k++) {
                                const meetTime = Algorithms.distanceBetween(points[k], currentPoint) / points[k].speed;

                                console.log(points[k].id + ' meet time: ' + meetTime);

                                if (meetTime > maxMeetTime) {
                                    maxMeetTime = meetTime;
                                }
                            }

                            return {
                                meetPoint: currentPoint,
                                meetTime: maxMeetTime
                            }
                        }
                    }
                }
            }
        }

        return findMeetPoint(points, midPoint);
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

document.getElementById('0.5x').addEventListener('click', function () {
    UI.animationSpeed = 0.5;
});

document.getElementById('1x').addEventListener('click', function () {
    UI.animationSpeed = 1;
});

document.getElementById('2x').addEventListener('click', function () {
    UI.animationSpeed = 2;
});

document.getElementById('4x').addEventListener('click', function () {
    UI.animationSpeed = 4;
});

document.getElementById('quickest-meet-option').addEventListener('click', function () {
    Algorithms.selectedAlgorithm = 'quickest meet';
});

document.getElementById('average-meet-option').addEventListener('click', function () {
    Algorithms.selectedAlgorithm = 'average meet';
});

document.getElementById('add-new-point').addEventListener('click', function () {
    const uI = new UI();

    if (PointStore.points.length !== 10) {
        PointStore.addPoint();
        uI.drawPoint();
        uI.toggleRunEnabled();
    }
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

document.getElementById('delete-point').addEventListener('click', function () {
    const uI = new UI();
    uI.removePoint();
    uI.toggleRunEnabled();
});

document.getElementById('x-position-input').addEventListener('keyup', function (event) {
    document.getElementById(UI.selectedPointId).style.left = event.target.value + 'px';
});

document.getElementById('y-position-input').addEventListener('keyup', function (event) {
    document.getElementById(UI.selectedPointId).style.top = event.target.value + 'px';
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
        uI.runAnimation(Algorithms.selectedAlgorithm);
    } else {
        alert('There need to be at least 2 points.');
    }
});

document.getElementById('instructions').addEventListener('click', function () {
    const uI = new UI();
    UI.currentTutorialIndex = 0;
    uI.updateTutorial();
    document.getElementById('tutorial').style.visibility = 'visible';
});

document.getElementById('skip-button').addEventListener('click', function () {
    document.getElementById('tutorial').style.visibility = 'hidden';
});

document.getElementById('next-button').addEventListener('click', function () {
    const uI = new UI();
    
    if (UI.currentTutorialIndex !== 7) {
        UI.currentTutorialIndex++;
        uI.updateTutorial();
    } else {
        document.getElementById('tutorial').style.visibility = 'hidden';
    }
});

document.getElementById('previous-button').addEventListener('click', function () {
    const uI = new UI();
    
    if (UI.currentTutorialIndex !== 0) {
        UI.currentTutorialIndex--;
    }

    uI.updateTutorial();
});
