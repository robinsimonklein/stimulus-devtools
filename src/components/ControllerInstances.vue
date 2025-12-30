<template>
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
</template>

<script setup lang="ts">
import ControllerInstance from '@/components/ControllerInstance.vue';
import { useState } from '@/composables/useState';

const { selectedControllerDefinition } = useState();
</script>
