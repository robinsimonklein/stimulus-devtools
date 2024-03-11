import { computed, ref, shallowRef, watch } from 'vue';
import type { Controller } from '@hotwired/stimulus';
import { ParsedStimulusControllerDefinition } from '@/types/stimulus.ts';
import { executeAction } from '@/utils/contentScript.ts';

const definitions = shallowRef<ParsedStimulusControllerDefinition[]>([]);
const selectedDefinitionIdentifier = ref<Controller['identifier'] | null>(null);

chrome.runtime.onMessage.addListener(async message => {
  if (message.type === 'event' && message.name === 'stimulus-devtools:detected') {
    await executeAction('updateControllers');
  }

  if (message.type === 'event' && message.name === 'stimulus-devtools:controllers:updated') {
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
    await executeAction('updateControllers');
  };

  return { definitions, selectedDefinition, refresh, selectDefinition };
};
