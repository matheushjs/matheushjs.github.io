var henonX = [0.1]; // Initial X coordinate
var henonY = [0.1]; // Initial Y coordinate
var henonStop = false;
var pointsPerFrame = 1; // Add 20 new points each animation frame
var henonSleep = 150;

// Set up the initial plot
Plotly.newPlot('henonGraph', [{
    x: henonX,
    y: henonY,
    mode: 'markers',
    type: 'scatter',
    marker: {
        color: 'rgba(255, 87, 51, 0.7)',
        size: 8
    }
}], {
    title: 'Hénon Map',
    xaxis: {range: [-1.5, 1.5], title: 'x'},
    yaxis: {range: [-0.4, 0.4], title: 'y'}
});

// Function to compute the next set of points
function henonCompute() {
    // Hénon map canonical parameters
    var a = 1.4;
    var b = 0.3;

    // Get the last calculated point
    var lastX = henonX[henonX.length - 1];
    var lastY = henonY[henonY.length - 1];
    var nextX, nextY;

    // Generate new points to add to the array
    for (var i = 0; i < pointsPerFrame; i++) {
        // Hénon's equations
        nextX = 1 - a * lastX * lastX + lastY;
        nextY = b * lastX;

        // Add the new point to our data arrays
        henonX.push(nextX);
        henonY.push(nextY);
        
        // The new point becomes the basis for the next iteration
        lastX = nextX;
        lastY = nextY;
    }
}

// Animation loop function
function henonUpdate() {
    henonCompute();

    Plotly.animate('henonGraph', {
        data: [{x: henonX, y: henonY}]
    }, {
        transition: { duration: 0 },
        frame: { duration: 0, redraw: false }
    });

    if (!henonStop) {
        setTimeout(() => requestAnimationFrame(henonUpdate), henonSleep);        
    }
}

// Function to start the animation
function henonStart() {
    // Reset data if starting again
    henonX = [0.1];
    henonY = [0.1];
    henonStop = false;
    henonSleep = 150;
    requestAnimationFrame(henonUpdate);

    // Stop the animation after 10 seconds
    setTimeout(() => {
        henonStop = true;
    }, 30000);
}