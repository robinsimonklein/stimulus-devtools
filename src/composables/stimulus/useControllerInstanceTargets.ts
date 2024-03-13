import { onBeforeMount, onBeforeUnmount, Ref, shallowRef, watch } from 'vue';
import { ParsedStimulusControllerInstance, StimulusControllerTarget } from '@/types/stimulus.ts';
import { StimulusDevToolsMessage } from '@/types';
import { executeAction } from '@/utils/contentScript.ts';

export const useControllerInstanceTargets = (instance: Ref<ParsedStimulusControllerInstance>) => {
  const targets = shallowRef<StimulusControllerTarget[]>([]);

  const updateTargetsFromMessage = async (message: StimulusDevToolsMessage) => {
    if (message.type === 'event' && message.name === 'stimulus-devtools:instance-targets:updated') {
      // TODO: check if instance has same id ?
      if (message.data?.targets) targets.value = message.data.targets as StimulusControllerTarget[];
    }
  };

  const reset = async () => {
    console.log('targets:reset', instance.value.uid);
    await executeAction('updateInstanceTargets', { uid: instance.value.uid });
  };

  watch(instance, reset);

  onBeforeMount(async () => {
    await reset();

    chrome.runtime.onMessage.addListener(updateTargetsFromMessage);
  });

  onBeforeUnmount(async () => {
    await executeAction('unobserveInstanceTargets', { uid: instance.value.uid });

    chrome.runtime.onMessage.removeListener(updateTargetsFromMessage);
  });

  return { targets };
};
