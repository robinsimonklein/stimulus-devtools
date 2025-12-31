<template>
  <div>
    <div class="flex items-center border-b border-neutral-200/75 px-3 py-1.5 dark:border-neutral-700">
      <div class="ml-auto">
        <Button icon="lucide:rotate-ccw" square @click="refresh" />
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
import Button from '@/components/ui/Button.vue';
import { computed } from 'vue';

const { controllerDefinitions, refresh } = useState();

const sortedDefinitions = computed(() =>
  Array.from(controllerDefinitions.value).sort(
    (a, b) => Number(a.hasUnregisteredInstance) - Number(b.hasUnregisteredInstance),
  ),
);
</script>
