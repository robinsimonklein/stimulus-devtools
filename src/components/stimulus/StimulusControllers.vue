<template>
  <div class="absolute inset-0">
    <StimulusControllerDefinitions />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useControllerDefinitions } from '@/composables/stimulus/useControllerDefinitions.ts';
import StimulusControllerDefinitions from '@/components/stimulus/StimulusControllerDefinitions.vue';

const { refresh } = useControllerDefinitions();

onBeforeMount(async () => {
  await refresh();
});
</script>
