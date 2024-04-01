import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerOutlet } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { executeAction } from '@/utils/bridge.ts';

export const useControllerInstanceOutlets = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const outlets = shallowRef<StimulusControllerOutlet[]>([]);

  const updateOutletsFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === 'event' && message.name === 'stimulus-devtools:instance-outlets:updated') {
      // TODO: check if instance has same id ?
      if (message.data?.outlets) outlets.value = message.data.outlets as StimulusControllerOutlet[];
    }
  };

  const reset = async () => {
    await executeAction('updateInstanceOutlets', { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateOutletsFromMessage);
  });

  onBeforeUnmount(async () => {
    await executeAction('unobserveInstanceOutlets', { uid: instance.value.uid });

    chrome.runtime.onMessage.removeListener(updateOutletsFromMessage);
  });

  return { outlets };
};
