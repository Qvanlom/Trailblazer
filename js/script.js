document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const radiusCutoff = 150;
    const x_shift = 0.07;

    const complete_graph = [];
    const path_list = [];

    const x_points = [];

    const big_points = [
        { x: 240, y: 135 },
        { x: 70, y: 245 },
        { x: 305, y: 430 }
    ];

    const points = [
        { x: 210, y: 50 },
        { x: 100, y: 180 },
        { x: 320, y: 245 },
        { x: 230, y: 290 },
        { x: 135, y: 365 },
        { x: 425, y: 395 },
        { x: 460, y: 255 },
        { x: 410, y: 100 }
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

    function getBlackAndWhitePixelValues() {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const pixelValues = [];
    
        // Initialize the 2D array
        for (let y = 0; y < canvas.height; y++) {
            pixelValues[y] = [];
        }

        let dataIndex = 0; // Index to iterate through the pixel data array

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // More initialization
                pixelValues[y][x] = [];

                // Calculate grayscale value (assuming image is already black and white)
                const grayscale = data[dataIndex];

                // Store the grayscale value in the 2D array
                for (let i = 0; i < 4; i++) {
                    pixelValues[y][x][i] = grayscale;
                }

                // Move to the next pixel in the data array
                dataIndex += 4;
            }
        }

        return pixelValues;
    }

    function findColorIndex(rgb) {
        for (let i = 0; i < point_rgb.length; i++) {
            const color = point_rgb[i];
    
            // Check if the RGB values match
            if (color[0] === rgb[0] && color[1] === rgb[1] && color[2] === rgb[2]) {
                return i; // Return the index where the match was found
            }
        }
    
        return -1; // Return -1 if no match was found
    }

    const queue = [];
    const blacklist = [];
    const point_rgb = [];
    const connections = [];

    function bfsFillStep(matrix, rgb, queueIndex) {
        const directions = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
    
        if (queue[queueIndex].length > 0) {
            // Remove first element from queue and set the coords to x and y
            const { x, y } = queue[queueIndex].shift();
    
            // Check if the pixel color is not black (0), white (255), or own color
            if (matrix[y][x][0] !== 0 && matrix[y][x][0] !== 255 && !(matrix[y][x][0] == rgb[0] && matrix[y][x][1] == rgb[1] && matrix[y][x][2] == rgb[2])) {
                // queue[queueIndex] = [];
                blacklist[queueIndex].push(matrix[y][x]);
                c = findColorIndex(matrix[y][x]);
                connections[queueIndex][c] = 1;
                connections[c][queueIndex] = 1;
                return; // Exit the loop
            }

            // Check if the pixel has a color that is blacklisted
            for (const color of blacklist[queueIndex]) {
                if ( matrix[y][x][0] == color[0] && matrix[y][x][1] == color[1] && matrix[y][x][2] == color[2]) {
                    return; // Skip this pixel
                }
            }

            // Check if the pixel is already filled with color or a non-black-and-white pixel
            if (matrix[y][x][0] !== 255) {
                return; // Skip this pixel
            }
    
            // Overwrite blank white matrix with the specified color
            for (let i = 0; i < 3; i++) {
                matrix[y][x][i] = rgb[i];
            }
    
            // Explore neighboring pixels
            for (const direction of directions) {
                const newX = x + direction.x;
                const newY = y + direction.y;
        
                // Check if the neighboring pixel is within bounds
                if (newX >= 0 && newX < matrix[0].length && newY >= 0 && newY < matrix.length) {
                    queue[queueIndex].push({ x: newX, y: newY });
                }
            }
        }
    }

    function callBfsFill(BWgrid) {
        r = 30;
        g = 30;
        b = 30;

        j = 0;
        for (p = 0; p < big_points.length; p++) {
            blacklist[j] = [];
            queue[j] = [{ x: big_points[p].x, y: big_points[p].y }];
            r = (r-60+194)%195 + 31;
            bfsFillStep(BWgrid, [r, g, b], j++);
            point_rgb[j-1] = [r, g, b];
        }
        r = 30;
        for (p = 0; p < points.length; p++) {
            blacklist[j] = [];
            queue[j] = [{ x: points[p].x, y: points[p].y }];
            b = (b-60+194)%195 + 31;
            bfsFillStep(BWgrid, [r, g, b], j++);
            point_rgb[j-1] = [r, g, b];
        }

        for (y = 0; y < j; y++) {
            connections[y] = [];
        }
        for (y = 0; y < j; y++) {
            for (x = 0; x < j; x++) {

                connections[y][x] = 0;
            }
        }

        for (i = 0; i < 520*520; i++) {
            k = 0;
            for (p = 0; p < big_points.length; p++) {
                bfsFillStep(BWgrid, point_rgb[k], k++)
            }
            for (p = 0; p < points.length; p++) {
                bfsFillStep(BWgrid, point_rgb[k], k++)
            }
        }
    }

    function drawImageFromMatrix(matrix) {
        // Assuming canvas and context are defined as in your previous code
        const imageData = context.createImageData(matrix[0].length, matrix.length);
        const data = imageData.data;
    
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                const index = (y * matrix[0].length + x) * 4; // Calculate the data index

                // Set the RGB channels based on the color value
                for (let i = 0; i < 3; i++) {
                    data[index + i] = matrix[y][x][i];
                }
                data[index + 3] = 255; // Alpha (fully opaque)
            }
        }
    
        // Put the modified pixel data back onto the canvas
        context.putImageData(imageData, 0, 0);
    }

    function getUniqueValues2D(array2D) {
        const uniqueValues = new Set();
    
        for (const row of array2D) {
            for (const value of row) {
                uniqueValues.add(value);
            }
        }
    
        return Array.from(uniqueValues);
    }
    

    // NEW: Draw background image
    const map = new Image();
    map.onload = function () {
        context.drawImage(map, 0, 0, canvas.width, canvas.height);
        applyCutoffFilter(145);
        findAllValidGroupings(big_points);
        const blackAndWhitePixels = getBlackAndWhitePixelValues();
        // drawPoints();
        callBfsFill(blackAndWhitePixels);
        // Call the function to redraw the canvas with the modified image
        drawImageFromMatrix(blackAndWhitePixels);
        const uniqueValues = new Set(blackAndWhitePixels);
        console.log(blackAndWhitePixels);
        console.log(getUniqueValues2D(blackAndWhitePixels));
        
        drawCastles();
        drawXPoints();
    };
    map.src = "/Trailblazer/images/map.png";

    // :)
});