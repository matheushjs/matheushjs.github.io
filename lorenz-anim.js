var lorenzN = 200;
var lorenzX = [], lorenzY = [], lorenzZ = [];
var lorenzdt = 0.007;
var lorenzStop = false;

for (i = 0; i < lorenzN; i++) {
  lorenzX[i] = Math.random() * 2 - 1;
  lorenzY[i] = Math.random() * 2 - 1;
  lorenzZ[i] = 30 + Math.random() * 10;
}

Plotly.newPlot('lorenzGraph', [{
  x: lorenzX,
  y: lorenzZ,
  mode: 'markers'
}], {
  xaxis: {range: [-40, 40]},
  yaxis: {range: [0, 50]}
})

function compute () {
  var s = 10, b = 8/3, r = 28;
  var dx, dy, dz;
  var xh, yh, zh;
  for (var i = 0; i < lorenzN; i++) {
    dx = s * (lorenzY[i] - lorenzX[i]);
    dy = lorenzX[i] * (r - lorenzZ[i]) - lorenzY[i];
    dz = lorenzX[i] * lorenzY[i] - b * lorenzZ[i];

    xh = lorenzX[i] + dx * lorenzdt * 0.5;
    yh = lorenzY[i] + dy * lorenzdt * 0.5;
    zh = lorenzZ[i] + dz * lorenzdt * 0.5;

    dx = s * (yh - xh);
    dy = xh * (r - zh) - yh;
    dz = xh * yh - b * zh;

    lorenzX[i] += dx * lorenzdt;
    lorenzY[i] += dy * lorenzdt;
    lorenzZ[i] += dz * lorenzdt;
  }
}

function update () {
  compute();

  Plotly.animate('lorenzGraph', {
    data: [{x: lorenzX, y: lorenzZ}]
  }, {
    transition: {
      duration: 0
    },
    frame: {
      duration: 0,
      redraw: false
    }
  });

  if(!lorenzStop){
    requestAnimationFrame(update);
  } else {
    lorenzStop = false;
  }
}

function lorenzStart(){
    requestAnimationFrame(update);

    /* Run for 10 seconds max */
    setTimeout(() => {
        lorenzStop = true;
    }, 30000);
}

// requestAnimationFrame(update);
