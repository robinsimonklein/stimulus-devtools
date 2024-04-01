import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerValue } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { Action, MessageEventName, MessageType } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

export const useControllerInstanceValues = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const { executeAction } = useBridge();

  const values = shallowRef<StimulusControllerValue[]>([]);

  const updateValuesFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === MessageType.Event && message.name === MessageEventName.InstanceValuesUpdated) {
      // TODO: check if instance has same id ?
      if (message.data?.values) values.value = message.data.values as StimulusControllerValue[];
    }
  };

  const reset = async () => {
    await executeAction(Action.UpdateInstanceValues, { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateValuesFromMessage);
  });

  onBeforeUnmount(async () => {
    chrome.runtime.onMessage.removeListener(updateValuesFromMessage);
  });

  return { values };
};
