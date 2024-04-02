(function () {
  function detect() {
    const detector = {
      delay: 1000,
      retry: 10,
    };

    function runDetect() {
      const stimulusDetected = !!window['Stimulus'];

      if (stimulusDetected) {
        window.postMessage(
          {
            type: 'stimulus-devtools:event',
            name: 'stimulus-devtools:detected',
          },
          '*',
        );
        window['__STIMULUS_DEVTOOLS_DETECTED__'] = true;
        return;
      }

      if (detector.retry < 8) {
        window.postMessage(
          {
            type: 'stimulus-devtools:event',
            name: 'stimulus-devtools:undetected',
          },
          '*',
        );
        if (window['__STIMULUS_DEVTOOLS_DETECTED__']) delete window['__STIMULUS_DEVTOOLS_DETECTED__'];
      }

      if (detector.retry > 0) {
        detector.retry--;
        setTimeout(() => {
          runDetect();
        }, detector.delay);
        detector.delay *= 1.5;
      }
    }

    setTimeout(() => {
      runDetect();
    }, 100);
  }

  if (document instanceof HTMLDocument) document.addEventListener('DOMContentLoaded', detect);
})();
