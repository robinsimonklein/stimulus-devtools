import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerOutlet } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { Action, MessageEventName, MessageType } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

export const useControllerInstanceOutlets = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const { executeAction } = useBridge();

  const outlets = shallowRef<StimulusControllerOutlet[]>([]);

  const updateOutletsFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === MessageType.Event && message.name === MessageEventName.InstanceOutletsUpdated) {
      // TODO: check if instance has same id ?
      if (message.data?.outlets) outlets.value = message.data.outlets as StimulusControllerOutlet[];
    }
  };

  const reset = async () => {
    await executeAction(Action.UpdateInstanceOutlets, { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateOutletsFromMessage);
  });

  onBeforeUnmount(async () => {
    chrome.runtime.onMessage.removeListener(updateOutletsFromMessage);
  });

  return { outlets };
};
