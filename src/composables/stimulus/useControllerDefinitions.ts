import { computed, ref, shallowRef, watch } from 'vue';
import type { Controller } from '@hotwired/stimulus';
import { ParsedStimulusControllerDefinition } from '@/types/stimulus.ts';
import { Action, MessageEventName, MessageType } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

const definitions = shallowRef<ParsedStimulusControllerDefinition[]>([]);
const selectedDefinitionIdentifier = ref<Controller['identifier'] | null>(null);

const { executeAction } = useBridge();

chrome.runtime.onMessage.addListener(async message => {
  if (message.type === MessageType.Event && message.name === MessageEventName.Detected) {
    await executeAction(Action.UpdateControllers);
  }

  if (message.type === MessageType.Event && message.name === MessageEventName.ControllersUpdated) {
    definitions.value = (message.data.controllerDefinitions || []).sort(
      (a: ParsedStimulusControllerDefinition, b: ParsedStimulusControllerDefinition) =>
        a.identifier < b.identifier ? -1 : 1,
    );
  }
});

watch(definitions, updatedDefinitions => {
  window.dispatchEvent(
    new CustomEvent('stimulus-devtools:controllers:updated', {
      detail: { controllerDefinitions: updatedDefinitions },
    }),
  );
});

export const useControllerDefinitions = () => {
  const selectedDefinition = computed(() =>
    definitions.value?.find(definition => definition.identifier === selectedDefinitionIdentifier.value),
  );

  const selectDefinition = (controllerIdentifier: Controller['identifier']) => {
    selectedDefinitionIdentifier.value = controllerIdentifier;
  };

  const refresh = async () => {
    await executeAction(Action.UpdateControllers);
  };

  return { definitions, selectedDefinition, refresh, selectDefinition };
};
