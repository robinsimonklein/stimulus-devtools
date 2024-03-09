import { onBeforeUnmount, ref } from 'vue';

const isLoading = ref(true);
const stimulusDetected = ref(false);
const checkCount = ref(0);
const checkStimulusInterval = ref<ReturnType<typeof setInterval> | null>(null);

chrome.devtools.network.onNavigated.addListener(() => {
  checkCount.value = 0;
  stimulusDetected.value = false;
  checkIfHasStimulus(true);
});

chrome.runtime.onMessage.addListener(message => {
  if (message.name === '_stimulus_devtools:detected') {
    checkIfHasStimulus(true);
  }
});

function checkIfHasStimulus(runInterval = false) {
  if (runInterval && !checkStimulusInterval.value && !stimulusDetected.value) {
    checkCount.value = 0;
    checkStimulusInterval.value = setInterval(checkIfHasStimulus, 1000);
  }

  if (stimulusDetected.value || checkCount.value++ > 10) {
    if (checkStimulusInterval.value) {
      clearInterval(checkStimulusInterval.value);
      checkStimulusInterval.value = null;
      isLoading.value = false;
    }
    return;
  }
  chrome.devtools.inspectedWindow.eval('!!(window.__STIMULUS_DEVTOOLS_DETECTED__)', hasStimulus => {
    if (!hasStimulus || stimulusDetected.value) {
      return;
    }
    if (checkStimulusInterval.value) {
      clearInterval(checkStimulusInterval.value);
      checkStimulusInterval.value = null;
    }
    stimulusDetected.value = true;
  });
}

export const useStimulusDetector = () => {
  onBeforeUnmount(() => {
    if (checkStimulusInterval.value) clearInterval(checkStimulusInterval.value);
  });

  return { isLoading, stimulusDetected, checkIfHasStimulus };
};
