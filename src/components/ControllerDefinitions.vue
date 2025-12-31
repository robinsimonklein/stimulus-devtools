<template>
  <div>
    <div class="flex items-center border-b border-neutral-200/75 px-3 py-1.5 dark:border-neutral-700">
      <div class="ml-auto">
        <Button square @click="refresh">
          <template #icon>
            <LucideRotateCcw class="size-4" />
          </template>
        </Button>
      </div>
    </div>
    <ControllerDefinition
      v-for="definition in sortedDefinitions"
      :key="definition.identifier"
      :definition="definition"
    />
  </div>
</template>

<script setup lang="ts">
import ControllerDefinition from '@/components/ControllerDefinition.vue';
import { useState } from '@/composables/useState';
import { LucideRotateCcw } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import { computed } from 'vue';

const { controllerDefinitions, refresh } = useState();

const sortedDefinitions = computed(() =>
  Array.from(controllerDefinitions.value).sort(
    (a, b) => Number(a.hasUnregisteredInstance) - Number(b.hasUnregisteredInstance),
  ),
);
</script>
