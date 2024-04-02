import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { StimulusDevToolsMessage } from '@/types';
import { MessageEventName, MessageType } from '@/enum';

const stimulusDetected = ref(false);

function checkIfHasStimulus() {
  chrome.devtools.inspectedWindow.eval('!!(window.__STIMULUS_DEVTOOLS_DETECTED__)', hasStimulus => {
    stimulusDetected.value = !!hasStimulus;
  });
}

function onRuntimeMessage(message: StimulusDevToolsMessage) {
  if (message.type === MessageType.Event && message.name === MessageEventName.Undetected) {
    checkIfHasStimulus();
  }
}

export const useStimulusDetector = () => {
  onBeforeMount(() => {
    if (!stimulusDetected.value) checkIfHasStimulus();
    chrome.runtime.onMessage.addListener(onRuntimeMessage);
  });

  onBeforeUnmount(() => {
    chrome.runtime.onMessage.removeListener(onRuntimeMessage);
  });

  return { stimulusDetected, checkIfHasStimulus };
};
