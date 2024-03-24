<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="relative flex w-full items-center border-b border-b-neutral-200 dark:border-b-neutral-800">
      <div class="flex-1">
        <input
          ref="searchInput"
          v-model="query"
          class="peer w-full appearance-none rounded-none border-none bg-transparent py-1.5 pl-8 pr-2 text-sm placeholder-neutral-400 focus-visible:outline-none dark:placeholder-neutral-600"
          type="text"
          placeholder="Find a controller..."
        />
        <span
          class="pointer-events-none absolute left-2 top-1/2 -mt-2 text-neutral-400 peer-focus:text-muted-foreground dark:text-neutral-600"
        >
          <Search class="h-4 w-4" />
        </span>
      </div>
      <Button class="mr-2" size="icon-sm" variant="ghost" @click="refresh"> <RotateCcw class="h-3.5 w-3.5" /> </Button>
    </div>
    <div class="h-full flex-1 overflow-auto">
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
