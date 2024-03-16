<template>
  <SplitPane
    class="absolute inset-0"
    :size="instanceSplit.size"
    :min="0.2"
    :max="0.8"
    :orientation="splitPaneOrientation"
    @update:size="handleInstanceSplitResize"
  >
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
            <AccordionTrigger class="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-900/40">Values</AccordionTrigger>
            <AccordionContent>
              <StimulusControllerValues :instance="selectedInstance" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="targets">
            <AccordionTrigger class="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-900/40">Targets</AccordionTrigger>
            <AccordionContent>
              <StimulusControllerTargets :instance="selectedInstance" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="outlets">
            <AccordionTrigger class="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-900/40">Outlets</AccordionTrigger>
            <AccordionContent>
              <StimulusControllerOutlets :instance="selectedInstance" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="classes">
            <AccordionTrigger class="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-900/40">Classes</AccordionTrigger>
            <AccordionContent>
              <StimulusControllerClasses :instance="selectedInstance" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, toRef, watch } from 'vue';
import SplitPane from '@/components/core/SplitPane.vue';
import CopyButton from '@/components/core/CopyButton.vue';
import { ParsedStimulusControllerDefinition, ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import StimulusControllerInstancesRow from '@/components/stimulus/instance/StimulusControllerInstancesRow.vue';
import StimulusControllerValues from '@/components/stimulus/members/values/StimulusControllerValues.vue';
import StimulusControllerOutlets from '@/components/stimulus/members/outlets/StimulusControllerOutlets.vue';
import StimulusControllerClasses from '@/components/stimulus/members/classes/StimulusControllerClasses.vue';
import StimulusControllerTargets from '@/components/stimulus/members/targets/StimulusControllerTargets.vue';
import { useControllerDefinition } from '@/composables/stimulus/useControllerDefinition.ts';
import { useChromeStorage } from '@/composables/useChromeStorage.ts';
import { executeAction } from '@/utils/contentScript.ts';
import { useWindowSize } from '@vueuse/core';

const props = defineProps<{
  identifier: ParsedStimulusControllerDefinition['identifier'];
}>();

const selectedInstance = ref<ParsedStimulusControllerInstance | null>(null);
const detailsAccordion = ref<string[]>(['values', 'targets', 'outlets', 'classes']);

const { definition } = useControllerDefinition(toRef(props, 'identifier'));
const instanceSplit = useChromeStorage('instanceSplit', { size: 0.3 });

const { width: windowWidth } = useWindowSize();
const splitPaneOrientation = computed(() => (windowWidth.value > 960 ? 'horizontal' : 'vertical'));

const onControllersUpdate = () => {
  if (selectedInstance.value) {
    executeAction('updateInstanceValues', { uid: selectedInstance.value.uid });
    executeAction('updateInstanceTargets', { uid: selectedInstance.value.uid });
    executeAction('updateInstanceOutlets', { uid: selectedInstance.value.uid });
    executeAction('updateInstanceClasses', { uid: selectedInstance.value.uid });
  }
};

const handleInstanceSplitResize = (size: number) => {
  instanceSplit.value = { size };
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
  (newInstances, oldInstances) => {
    if (!definition.value) return;

    const previousIndex = oldInstances?.findIndex(instance => instance.uid === selectedInstance.value?.uid) || 0;
    const newIndex = Math.max(0, Math.min(previousIndex, (newInstances?.length || 0) - 1));

    if (!newInstances?.find(newInstance => newInstance.uid === selectedInstance.value?.uid)) {
      if (newInstances?.length) {
        selectedInstance.value = newInstances[newIndex];
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
