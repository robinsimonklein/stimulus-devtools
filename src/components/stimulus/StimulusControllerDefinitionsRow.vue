<template>
  <div
    class="group inline-flex items-center gap-x-3 min-w-full px-3 py-2 text-sm cursor-pointer hover:bg-muted/60 border-b border-dashed dark:border-b-neutral-900"
    :class="{ 'is-selected !bg-muted': selectedDefinition?.identifier === definition.identifier }"
    @click="selectDefinition(definition.identifier)"
  >
    <div
      class="shrink-0 inline-flex items-center gap-x-1.5 opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100"
    >
      <template v-for="(item, index) in path">
        <span v-if="index < path.length - 1" class="shrink-0 text-muted-foreground">{{ item }}</span>
        <span v-else class="shrink-0 group-hover:underline group-[.is-selected]:underline underline-offset-2">
          {{ item }}
        </span>
        <span v-if="index < path.length - 1" class="text-muted-foreground">/</span>
      </template>
    </div>
    <span
      v-if="definition.instances.length > 1"
      class="shrink-0 text-xs px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 opacity-70 group-hover:opacity-100 group-[.is-selected]:opacity-100 rounded-sm"
    >
      x{{ definition.instances.length }}
    </span>
    <span v-if="definition.isLazyController" title="Lazy Controller">
      <Zap class="w-3.5 h-3.5" style="color: #c8a213" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Zap } from 'lucide-vue-next';
import { useControllerDefinitions } from '@/composables/stimulus/useControllerDefinitions.ts';
import { ParsedStimulusControllerDefinition } from '@/types/stimulus.ts';

const { selectedDefinition, selectDefinition } = useControllerDefinitions();

const props = defineProps<{
  definition: ParsedStimulusControllerDefinition;
}>();

const path = computed(() => props.definition.identifier.split('--'));
</script>
