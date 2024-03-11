import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerValue } from '@/types/stimulus.ts';
import { executeAction } from '@/utils/contentScript.ts';
import { StimulusDevToolsMessage } from '@/types';

export const useControllerInstanceValues = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const values = shallowRef<StimulusControllerValue[]>([]);

  const updateValuesFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === 'event' && message.name === 'stimulus-devtools:instance-values:updated') {
      // TODO: check if instance has same id ?
      if (message.data?.values) values.value = message.data.values as StimulusControllerValue[];
    }
  };

  const reset = async () => {
    await executeAction('updateInstanceValues', { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateValuesFromMessage);
  });

  onBeforeUnmount(async () => {
    await executeAction('unobserveInstanceValues', { uid: instance.value.uid });

    chrome.runtime.onMessage.removeListener(updateValuesFromMessage);
  });

  return { values };
};
