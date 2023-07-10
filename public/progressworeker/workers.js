var totalIterations = 1000;
var currentIteration = 0;

function doSomeWork() {
  // Realizar alguna tarea
  currentIteration++;

  // Calcular el progreso actual
  var progress = Math.floor((currentIteration / totalIterations) * 100);

  // Enviar el progreso al hilo principal
  self.postMessage({ type: 'progress', progress: progress });

  if (currentIteration < totalIterations) {
    // Realizar la siguiente iteración después de un tiempo
    setTimeout(doSomeWork, 10);
  } else {
    // Tarea completada, enviar el resultado al hilo principal
    var result = 'Tarea completada';
    self.postMessage({ type: 'result', result: result });
  }
}

self.onmessage = function(event) {
  if (event.data === 'start') {
    // Iniciar la tarea
    doSomeWork();
  }
};
