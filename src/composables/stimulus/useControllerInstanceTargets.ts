import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerTarget } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { Action, MessageEventName, MessageType } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

export const useControllerInstanceTargets = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const { executeAction } = useBridge();

  const targets = shallowRef<StimulusControllerTarget[]>([]);

  const updateTargetsFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === MessageType.Event && message.name === MessageEventName.InstanceTargetsUpdated) {
      // TODO: check if instance has same id ?
      if (message.data?.targets) targets.value = message.data.targets as StimulusControllerTarget[];
    }
  };

  const reset = async () => {
    await executeAction(Action.UpdateInstanceTargets, { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateTargetsFromMessage);
  });

  onBeforeUnmount(async () => {
    chrome.runtime.onMessage.removeListener(updateTargetsFromMessage);
  });

  return { targets };
};
