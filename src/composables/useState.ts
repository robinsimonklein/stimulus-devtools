import { computed, ref, shallowRef, watch } from 'vue';
import { ControllerDefinition, ControllerInstance } from '@/types/core';
import { Message } from '@/core/message';
import { useMessaging } from '@/composables/useMessaging';

const controllerInstances = shallowRef<ControllerInstance[]>([]);

const selectedControllerDefinitionIdentifier = ref<string | null>(null);

const controllerDefinitions = computed<ControllerDefinition[]>(() => {
  if (!controllerInstances.value?.length) return [];

  // Group instances by identifier and count them
  const identifiers = new Set<string>();

  controllerInstances.value.forEach(instance => {
    identifiers.add(instance.identifier);
  });

  // Convert map to array of ControllerDefinition
  return Array.from(identifiers.values()).map(identifier => {
    const instances = controllerInstances.value.filter(instance => instance.identifier === identifier);

    return {
      identifier,
      instances,
      isLazy: instances.some(i => i.isLazy),
    };
  });
});

// Initialize message listening at module level
const { onMessage, postMessage } = useMessaging();

onMessage((message: Message) => {
  if (message.type === 'UPDATE') {
    controllerInstances.value = message.data.controllers || [];
  }
});

// Auto-select controller definition
watch(
  controllerDefinitions,
  definitions => {
    if (definitions.length === 0) {
      // No definitions available, reset to null
      selectedControllerDefinitionIdentifier.value = null;
    } else if (selectedControllerDefinitionIdentifier.value) {
      // Check if currently selected definition still exists
      const stillExists = definitions.some(def => def.identifier === selectedControllerDefinitionIdentifier.value);
      if (!stillExists) {
        // Current selection no longer exists, select first available
        selectedControllerDefinitionIdentifier.value = definitions[0].identifier;
      }
    } else {
      // No selection, select first available definition
      selectedControllerDefinitionIdentifier.value = definitions[0].identifier;
    }
  },
  { immediate: true },
);

export const useState = () => {
  const selectedControllerDefinition = computed(() =>
    controllerDefinitions.value.find(
      definition => definition.identifier === selectedControllerDefinitionIdentifier.value,
    ),
  );

  const selectControllerDefinition = (identifier: string | null) => {
    selectedControllerDefinitionIdentifier.value = identifier;
  };

  const refresh = () => {
    postMessage(new Message('REFRESH'));
  };

  return { controllerDefinitions, selectedControllerDefinition, selectControllerDefinition, refresh };
};
