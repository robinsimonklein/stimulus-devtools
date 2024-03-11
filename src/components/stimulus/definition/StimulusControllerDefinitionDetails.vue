<template>
  <SplitPane class="absolute inset-0" :size="0.3" :min="0.2" :max="0.8" orientation="vertical">
    <template #a>
      <div class="absolute inset-0 flex flex-col overflow-hidden">
        <div class="h-[44px] flex items-center px-3">
          <span class="text-base truncate font-medium">{{ identifier }}</span>
          <CopyButton class="flex-shrink-0 ml-2" :text="identifier" />
        </div>
        <div v-if="definition" class="flex-1 overflow-y-auto">
          <div class="inline-block min-w-full">
            <StimulusControllerInstancesRow
              v-for="instance in definition.instances"
              :key="instance.uid"
              :instance="instance"
              :selected="instance.uid === selectedInstance?.uid"
              @select="selectedInstance = instance"
            />
          </div>
        </div>
      </div>
    </template>
    <template #b>
      <div class="absolute inset-0 overflow-y-auto">
        <Accordion v-model="detailsAccordion" type="multiple" collapsible>
          <AccordionItem value="values">
            <AccordionTrigger class="px-3 py-2 text-sm dark:bg-neutral-900/40">Values</AccordionTrigger>
            <AccordionContent>
              <StimulusControllerValues :instance="selectedInstance" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, toRef, watch } from 'vue';
import SplitPane from '@/components/core/SplitPane.vue';
import CopyButton from '@/components/core/CopyButton.vue';
import { ParsedStimulusControllerDefinition, ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { useControllerDefinition } from '@/composables/stimulus/useControllerDefinition.ts';
import StimulusControllerInstancesRow from '@/components/stimulus/instance/StimulusControllerInstancesRow.vue';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import StimulusControllerValues from '@/components/stimulus/members/values/StimulusControllerValues.vue';
import { executeAction } from '@/utils/contentScript.ts';

const props = defineProps<{
  identifier: ParsedStimulusControllerDefinition['identifier'];
}>();

const selectedInstance = ref<ParsedStimulusControllerInstance | null>(null);
const detailsAccordion = ref<string[]>(['values']);

const { definition } = useControllerDefinition(toRef(props, 'identifier'));

const onControllersUpdate = () => {
  if (selectedInstance.value) executeAction('updateInstanceValues', { uid: selectedInstance.value.uid });
};

watch(
  () => definition.value?.identifier,
  () => {
    selectedInstance.value = definition.value?.instances[0] || null;
  },
  {
    immediate: true,
  },
);

watch(
  () => definition.value?.instances,
  newInstances => {
    if (!definition.value) return;

    if (!newInstances?.find(newInstance => newInstance.uid === selectedInstance.value?.uid)) {
      if (newInstances?.length) {
        selectedInstance.value = newInstances[0];
      } else {
        selectedInstance.value = null;
      }
    }
  },
);

onBeforeMount(() => {
  window.addEventListener('stimulus-devtools:controllers:updated', onControllersUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener('stimulus-devtools:controllers:updated', onControllersUpdate);
});
</script>
