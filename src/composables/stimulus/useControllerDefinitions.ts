import { computed, ref, shallowRef } from 'vue';
import { useContentScript } from '@/composables/useContentScript.ts';
import type { Controller } from '@hotwired/stimulus';
import { ParsedStimulusControllerDefinition } from '@/types/stimulus.ts';

const definitions = shallowRef<ParsedStimulusControllerDefinition[]>([]);
const selectedDefinitionIdentifier = ref<Controller['identifier'] | null>(null);

chrome.runtime.onMessage.addListener(message => {
  if (message.scope !== 'controllers') return;

  if (message.name === 'update:controllers') {
    definitions.value = message.data.controllerDefinitions;
  }
});

export const useControllerDefinitions = () => {
  const { executeAction } = useContentScript();

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
