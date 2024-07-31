<template>
  <div
    class="group inline-flex min-w-full cursor-pointer items-center gap-x-3 border-b border-dashed px-3 py-2 text-sm hover:bg-muted/60 dark:border-b-neutral-900"
    :class="{ 'is-selected !bg-muted': selectedDefinition?.identifier === definition.identifier }"
    @click="selectDefinition(definition.identifier)"
    @mouseenter="
      executeAction(Action.HighlightElements, {
        elements: definition.instances.map(instance => ({ selector: instance.uidSelector })),
      })
    "
    @mouseleave="executeAction(Action.StopHighlightElements)"
  >
    <div
      class="inline-flex shrink-0 items-center gap-x-1.5 opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100"
    >
      <template v-for="(item, index) in path">
        <template v-if="index < path.length - 1">
          <span :key="index" class="shrink-0 text-muted-foreground">{{ item }}</span>
          <span :key="index" class="text-muted-foreground">/</span>
        </template>
        <span
          v-else
          :key="index"
          class="shrink-0 underline-offset-2 group-hover:underline group-[.is-selected]:underline"
        >
          {{ item }}
        </span>
      </template>
    </div>
    <span
      v-if="definition.instances.length > 1"
      class="shrink-0 rounded-sm bg-neutral-200 px-1.5 py-0.5 text-xs opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100 dark:bg-neutral-700"
    >
      x{{ definition.instances.length }}
    </span>
    <span v-if="definition.isLazyController" title="Lazy Controller">
      <Zap class="h-3.5 w-3.5" style="color: #c8a213" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Zap } from 'lucide-vue-next';
import { useControllerDefinitions } from '@/composables/stimulus/useControllerDefinitions.ts';
import { ParsedStimulusControllerDefinition } from '@/types/stimulus.ts';
import { Action } from '@/enum';
import { useBridge } from '@/composables/useBridge.ts';

const { executeAction } = useBridge();

const { selectedDefinition, selectDefinition } = useControllerDefinitions();

const props = defineProps<{
  definition: ParsedStimulusControllerDefinition;
}>();

const path = computed(() => props.definition.identifier.split('--'));
</script>
