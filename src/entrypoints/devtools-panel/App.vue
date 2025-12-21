<template>
  <SplitPane
    v-model:size="mainSplitSize"
    class="absolute inset-0"
    :orientation="splitPaneOrientation"
    :min="0.2"
    :max="0.6"
  >
    <template #a>
      <div class="h-full overflow-y-auto">
        <ControllerDefinition
          v-for="definition in controllerDefinitions"
          :key="definition.identifier"
          :definition="definition"
        />
      </div>
    </template>
    <template #b>
      <div class="flex flex-col">
        <div class="h-1/3 overflow-y-auto">
          <div v-if="selectedControllerDefinition">
            <div class="px-3 py-3">
              <h1 class="text-lg font-bold">{{ selectedControllerDefinition.identifier }}</h1>
            </div>
            <ControllerInstance
              v-for="instance in selectedControllerDefinition.instances"
              :key="instance.uid"
              :instance="instance"
            />
          </div>
        </div>
        <div class="flex-1 border-t border-neutral-200 dark:border-neutral-600">
          <div class="h-full overflow-y-auto">...</div>
        </div>
      </div>
    </template>
  </SplitPane>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useState } from '@/composables/useState';
import ControllerDefinition from '@/components/ControllerDefinition.vue';
import ControllerInstance from '@/components/ControllerInstance.vue';
import SplitPane from '@/components/ui/SplitPane.vue';
import { useWxtStorage } from '@/composables/useWxtStorage';

const { width: windowWidth } = useWindowSize();
const { controllerDefinitions, selectedControllerDefinition, refresh } = useState();

const splitPaneOrientation = computed(() => (windowWidth.value > 540 ? 'horizontal' : 'vertical'));

const mainSplitSize = useWxtStorage('local:ui:mainSplitSize', 0.4);

onMounted(() => {
  refresh();
});
</script>
