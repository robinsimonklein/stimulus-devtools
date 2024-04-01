import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerClass } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { Action, MessageEventName, MessageType } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

export const useControllerInstanceClasses = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const { executeAction } = useBridge();

  const classes = shallowRef<StimulusControllerClass[]>([]);

  const updateClassesFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === MessageType.Event && message.name === MessageEventName.InstanceClassesUpdated) {
      // TODO: check if instance has same id ?
      if (message.data?.classes) classes.value = message.data.classes as StimulusControllerClass[];
    }
  };

  const reset = async () => {
    await executeAction(Action.UpdateInstanceClasses, { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateClassesFromMessage);
  });

  onBeforeUnmount(async () => {
    chrome.runtime.onMessage.removeListener(updateClassesFromMessage);
  });

  return { classes };
};
