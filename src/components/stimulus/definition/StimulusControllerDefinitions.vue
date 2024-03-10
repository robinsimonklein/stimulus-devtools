<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="relative flex items-center w-full border-b border-b-neutral-200 dark:border-b-neutral-800">
      <div class="flex-1">
        <input
          ref="searchInput"
          v-model="query"
          class="peer border-none w-full pl-8 pr-2 py-1.5 text-sm placeholder-neutral-400 dark:placeholder-neutral-600 bg-transparent rounded-none focus-visible:outline-none appearance-none"
          type="text"
          placeholder="Find a controller..."
        />
        <span
          class="absolute top-1/2 left-2 -mt-2 text-neutral-400 dark:text-neutral-600 peer-focus:text-muted-foreground pointer-events-none"
        >
          <Search class="w-4 h-4" />
        </span>
      </div>
      <Button class="mr-2" size="icon-sm" variant="ghost" @click="refresh"> <RotateCcw class="w-3.5 h-3.5" /> </Button>
    </div>
    <div class="overflow-auto flex-1 h-full">
      <div class="inline-block min-w-full">
        <StimulusControllerDefinitionsRow
          v-for="definition in filteredDefinitions"
          :key="definition.identifier"
          :definition="definition"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import StimulusControllerDefinitionsRow from '@/components/stimulus/definition/StimulusControllerDefinitionsRow.vue';
import { useControllerDefinitions } from '@/composables/stimulus/useControllerDefinitions.ts';
import { Search, RotateCcw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { definitions, selectedDefinition, selectDefinition, refresh } = useControllerDefinitions();

const searchInput = ref<HTMLInputElement | null>(null);
const query = ref<string>('');

const filteredDefinitions = computed(() => {
  if (query.value?.length) {
    return Array.from(definitions.value).filter(definition => definition.identifier.includes(query.value));
  }
  return definitions.value;
});

watch(definitions, newDefinitions => {
  if (!newDefinitions.find(newDefinition => newDefinition.identifier === selectedDefinition.value?.identifier)) {
    if (newDefinitions.length) {
      selectDefinition(newDefinitions[0].identifier);
    }
  }
});
</script>
