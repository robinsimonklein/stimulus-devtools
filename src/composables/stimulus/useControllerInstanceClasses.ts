import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerClass } from '@/types/stimulus.ts';
import { executeAction } from '@/utils/bridge.ts';
import { StimulusDevToolsMessage } from '@/types';

export const useControllerInstanceClasses = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const classes = shallowRef<StimulusControllerClass[]>([]);

  const updateClassesFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === 'event' && message.name === 'stimulus-devtools:instance-classes:updated') {
      // TODO: check if instance has same id ?
      if (message.data?.classes) classes.value = message.data.classes as StimulusControllerClass[];
    }
  };

  const reset = async () => {
    await executeAction('updateInstanceClasses', { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateClassesFromMessage);
  });

  onBeforeUnmount(async () => {
    await executeAction('unobserveInstanceClasses', { uid: instance.value.uid });

    chrome.runtime.onMessage.removeListener(updateClassesFromMessage);
  });

  return { classes };
};
