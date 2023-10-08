document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const radiusCutoff = 150;
    const x_shift = 0.07;

    const x_points = [];

    const big_points = [
        { x: 100, y: 200 },
        { x: 250, y: 80 },
        { x: 370, y: 70 },
        { x: 500, y: 90 },
        { x: 150, y: 0 },
        { x: 270, y: 380 }
    ];

    const points = [
        { x: 0, y: 300 },
        { x: 370, y: 340 },
        { x: 370, y: 0 }
    ];

    // Draws all the points on the canvas
    function drawPoints() {
        context.fillStyle = "limegreen";

        for (const point of big_points) {
            context.beginPath();
            context.arc(point.x+10, point.y+10, 10, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }

        for (const point of points) {
            context.beginPath();
            context.arc(point.x+10, point.y+10, 5, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    }

    // Function to draw a circle
    function drawCircle(center, radius) {
        // Draw the circle
        context.strokeStyle = "green";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(center.x+10, center.y+10, radius, 0, Math.PI * 2);
        context.stroke();
    }

    // Calculate the circumcenter and circumradius
    function calculateCircumcircle(points) {
        const [p1, p2, p3] = points;

        // Calculate midpoints of line segments
        const mid1 = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        const mid2 = {
            x: (p2.x + p3.x) / 2,
            y: (p2.y + p3.y) / 2
        };

        // Calculate slopes of perpendicular bisectors
        const slope1 = -(p2.x - p1.x) / (p2.y - p1.y);
        const slope2 = -(p3.x - p2.x) / (p3.y - p2.y);

        // Calculate circumcenter (intersection of perpendicular bisectors)
        const centerX = (mid2.y - mid1.y + slope1 * mid1.x - slope2 * mid2.x) / (slope1 - slope2);
        const centerY = mid1.y + slope1 * (centerX - mid1.x);

        // Calculate circumradius
        const radius = Math.sqrt(Math.pow(centerX - p1.x, 2) + Math.pow(centerY - p1.y, 2));

        if (radius > radiusCutoff) {
            return;
        }
        return { center: { x: centerX, y: centerY }, radius };
    }

    // Calculate the radius
    function getRadius(p1, p2, p3) {
        // Calculate midpoints of line segments
        const mid1 = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        const mid2 = {
            x: (p2.x + p3.x) / 2,
            y: (p2.y + p3.y) / 2
        };

        // Calculate slopes of perpendicular bisectors
        const slope1 = -(p2.x - p1.x) / (p2.y - p1.y);
        const slope2 = -(p3.x - p2.x) / (p3.y - p2.y);

        // Calculate circumcenter (intersection of perpendicular bisectors)
        const centerX = (mid2.y - mid1.y + slope1 * mid1.x - slope2 * mid2.x) / (slope1 - slope2);
        const centerY = mid1.y + slope1 * (centerX - mid1.x);

        // Calculate circumradius
        const radius = Math.sqrt(Math.pow(centerX - p1.x, 2) + Math.pow(centerY - p1.y, 2));
        return radius;
    }

    // Calculate the length
    function getLength(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Function to find a valid 3-point grouping
    function findValidGrouping3(points) {
        const smallestCircumcircle = {
            radius: Infinity,
            points: [],
        };

        const n = points.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                for (let k = j + 1; k < n; k++) {
                    const point1 = points[i];
                    const point2 = points[j];
                    const point3 = points[k];
                    const radius = getRadius(point1, point2, point3);

                    // Check if the radius is valid (replace with your condition)
                    if (radius < radiusCutoff) {
                        // Check to see if the current circumcircle is the smallest, if so then set it as the smallest
                        if (radius < smallestCircumcircle.radius) {
                            smallestCircumcircle.radius = radius;
                            smallestCircumcircle.points = [point1, point2, point3];
                        }
                    }
                }
            }
        }
        if (smallestCircumcircle.radius !== Infinity) {
            return smallestCircumcircle.points;
        }
        return null; // No valid grouping found
    }

    // Function to find a valid 3-point grouping
    function findValidGrouping2(points) {
        const smallestCircumcircle = {
            radius: Infinity,
            points: [],
        };

        const n = points.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const point1 = points[i];
                const point2 = points[j];
                const length = getLength(point1, point2);

                // Check if the radius is valid (replace with your condition)
                if (length < radiusCutoff) {
                    // Check to see if the current circumcircle is the smallest, if so then set it as the smallest
                    if (length < smallestCircumcircle.radius) {
                        smallestCircumcircle.radius = length;
                        smallestCircumcircle.points = [point1, point2];
                    }
                }
            }
        }
        if (smallestCircumcircle.radius !== Infinity) {
            return smallestCircumcircle.points;
        }
        return null; // No valid grouping found
    }

    // Function for shifting x_point
    function shift_x_point(circumcircle) {
        sum_x = circumcircle.center.x;
        sum_y = circumcircle.center.y;
        for (const point of points) {
            // get length between x and selected point
            length_inverse = Math.min(x_shift, circumcircle.radius/(getLength(point, circumcircle.center)));
            // add (x-direction * length_inverse modifier) to sum_x
            sum_x += (point.x - circumcircle.center.x) * length_inverse;
            // add (y-direction * length_inverse modifier) to sum_y
            sum_x += (point.y - circumcircle.center.y) * length_inverse;
        }
        x_points.push( { x: Math.round(sum_x), y: Math.round(sum_y) } );
        return;
    }

    // Function for generating 3-point and 2-point groupings
    function findAllValidGroupings(points) {
        // finds 3-point groupings
        while (true) {
            const grouping = findValidGrouping3(points);
            if (grouping === null) {
                break; // No more valid groupings found
            }

            console.log(grouping);
            const circumcircle = calculateCircumcircle(grouping);
            console.log(circumcircle.radius);
            if (circumcircle) {
                drawCircle(circumcircle.center, circumcircle.radius);
            }
            shift_x_point(circumcircle);

            // Remove the grouped points from the original list
            for (const point of grouping) {
                const index = points.indexOf(point);
                points.splice(index, 1);
            }
        }

        // finds 2-point groupings
        while (true) {
            const grouping = findValidGrouping2(points);
            if (grouping === null) {
                break; // No more valid groupings found
            }

            const [p1, p2] = grouping;
            console.log(grouping);
            const centerX = (p1.x + p2.x) / 2;
            const centerY = (p1.y + p2.y) / 2;
            const circumcircle = { center: { x: centerX, y: centerY }, radius: getLength(p1, p2)/2 };
            console.log(circumcircle.radius);
            if (circumcircle) {
                drawCircle(circumcircle.center, circumcircle.radius);
            }
            shift_x_point(circumcircle);

            // Remove the grouped points from the original list
            for (const point of grouping) {
                const index = points.indexOf(point);
                points.splice(index, 1);
            }
        }

        return;
    }

    function drawXPoints() {
        context.fillStyle = "green";

        for (const point of x_points) {
            context.beginPath();
            context.arc(point.x+10, point.y+10, 5, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    }

    // draw castle image at each point
    const castle1 = new Image();
    size = 30;
    castle1.src = "/Trailblazer/images/castle1.PNG";

    function drawCastles() {
        console.log(big_points);
        for (const point of big_points) {
            context.drawImage(castle1, (point.x-size/2)+10, (point.y-size/2)+10, size, size);
        }
        console.log(points);
        size = 20;
        for (const point of points) {
            context.drawImage(castle1, (point.x-size/2)+10, (point.y-size/2)+10, size, size);
        }
    }

    function applyCutoffFilter(threshold) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
    
        for (let i = 0; i < data.length; i += 4) {
            // Calculate the grayscale value based on RGB values
            const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
            // Set R, G, and B channels to black or white based on the threshold
            if (grayscale >= threshold) {
                data[i] = 255; // White
                data[i + 1] = 255; // White
                data[i + 2] = 255; // White
            } else {
                data[i] = 0; // Black
                data[i + 1] = 0; // Black
                data[i + 2] = 0; // Black
            }
        }
    
        // Put the modified pixel data back onto the canvas
        context.putImageData(imageData, 0, 0);
    }

    // NEW: Draw background image
    const map = new Image();
    map.onload = function () {
        context.drawImage(map, 0, 0, canvas.width, canvas.height);
        // applyCutoffFilter(185);
        drawPoints();
        drawCastles();
        findAllValidGroupings(big_points);
        drawXPoints();
    };
    map.src = "/Trailblazer/images/donut.png";

    // :)
});