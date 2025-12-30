<template>
  <TooltipProvider>
    <SplitterGroup class="fixed inset-0" :direction="splitterDirection" auto-save-id="stimulus-devtools:main-splitter">
      <SplitterPanel :default-size="30" :min-size="20" :max-size="60">
        <div class="h-full overflow-y-auto">
          <ControllerDefinitions />
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        class="bg-neutral-200 dark:bg-neutral-600"
        :class="[splitterDirection === 'horizontal' ? 'w-px' : 'h-px']"
      />
      <SplitterPanel>
        <SplitterGroup direction="vertical" auto-save-id="stimulus-devtools:controller-definition-splitter">
          <SplitterPanel :default-size="40" :min-size="10" :max-size="90">
            <div class="h-full overflow-y-auto">
              <ControllerInstances />
            </div>
          </SplitterPanel>
          <SplitterResizeHandle class="h-px bg-neutral-200 dark:bg-neutral-600" />
          <SplitterPanel>
            <div class="h-full overflow-y-auto">
              <p>...</p>
            </div>
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle, TooltipProvider } from 'reka-ui';
import { useState } from '@/composables/useState';
import ControllerDefinitions from '@/components/ControllerDefinitions.vue';
import ControllerInstances from '@/components/ControllerInstances.vue';

const { width: windowWidth } = useWindowSize();
const { refresh } = useState();

const splitterDirection = computed(() => (windowWidth.value > 540 ? 'horizontal' : 'vertical'));

onMounted(() => {
  refresh();
});
</script>
