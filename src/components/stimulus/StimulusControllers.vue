<template>
  <SplitPane class="absolute inset-0" :orientation="splitPaneOrientation" :min="0.2" :max="0.6">
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
import StimulusControllerDefinitions from '@/components/stimulus/StimulusControllerDefinitions.vue';
import SplitPane from '@/components/core/SplitPane.vue';
import StimulusControllerDefinitionDetails from '@/components/stimulus/StimulusControllerDefinitionDetails.vue';

const { width: windowWidth } = useWindowSize();
const { selectedDefinition, refresh } = useControllerDefinitions();

const splitPaneOrientation = computed(() => (windowWidth.value > 540 ? 'horizontal' : 'vertical'));

onBeforeMount(async () => {
  await refresh();
});
</script>
