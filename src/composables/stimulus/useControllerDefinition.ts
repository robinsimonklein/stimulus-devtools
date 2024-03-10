import { computed, Ref } from 'vue';
import { useControllerDefinitions } from './useControllerDefinitions.ts';
import { StimulusControllerDefinition } from '@/types/stimulus.ts';

export const useControllerDefinition = (identifier: Ref<StimulusControllerDefinition['identifier']>) => {
  const { definitions } = useControllerDefinitions();

  const definition = computed(() => definitions.value.find(d => d.identifier === identifier.value));

  return { definition };
};
