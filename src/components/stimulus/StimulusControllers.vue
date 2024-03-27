<template>
  <SplitPane
    :size="mainSplit.size"
    class="absolute inset-0"
    :orientation="splitPaneOrientation"
    :min="0.2"
    :max="0.6"
    @update:size="handleMainSplitResize"
  >
    <template #a>
      <StimulusControllerDefinitions />
    </template>
    <template #b>
      <StimulusControllerDefinitionDetails v-if="selectedDefinition" :identifier="selectedDefinition.identifier"
    /></template>
  </SplitPane>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useControllerDefinitions } from '@/composables/stimulus/useControllerDefinitions.ts';
import StimulusControllerDefinitions from '@/components/stimulus/definition/StimulusControllerDefinitions.vue';
import SplitPane from '@/components/core/SplitPane.vue';
import StimulusControllerDefinitionDetails from '@/components/stimulus/definition/StimulusControllerDefinitionDetails.vue';
import { useChromeStorage } from '@/composables/useChromeStorage.ts';

const { width: windowWidth } = useWindowSize();
const { selectedDefinition, refresh } = useControllerDefinitions();

const mainSplit = useChromeStorage('stimulus-devtools:mainSplit', { size: 0.3 });

const splitPaneOrientation = computed(() => (windowWidth.value > 540 ? 'horizontal' : 'vertical'));

const handleMainSplitResize = (size: number) => {
  mainSplit.value = { size };
};

onBeforeMount(async () => {
  await refresh();
});
</script>
