import { onBeforeMount, ref } from 'vue';

const stimulusDetected = ref(false);

function checkIfHasStimulus() {
  chrome.devtools.inspectedWindow.eval('!!(window.__STIMULUS_DEVTOOLS_DETECTED__)', hasStimulus => {
    stimulusDetected.value = !!hasStimulus;
  });
}

export const useStimulusDetector = () => {
  onBeforeMount(() => {
    if (!stimulusDetected.value) checkIfHasStimulus();
  });

  return { stimulusDetected, checkIfHasStimulus };
};
