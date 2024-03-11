<template>
  <div class="fixed inset-0 bg-background text-foreground" :class="{ dark: preferredColor === 'dark' }">
    <StimulusControllers v-if="stimulusDetected" />
    <div v-else-if="initialLoading" class="absolute inset-0 flex items-center justify-center">
      <span>Loading...</span>
    </div>
    <StimulusUnavailable v-else />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { usePreferredColorScheme } from '@vueuse/core';
import { useStimulusDetector } from '@/composables/useStimulusDetector.ts';
import StimulusUnavailable from '@/components/stimulus/StimulusUnavailable.vue';
import StimulusControllers from '@/components/stimulus/StimulusControllers.vue';

const { stimulusDetected } = useStimulusDetector();

const preferredColor = usePreferredColorScheme();

const initialLoading = ref(true);
const initialLoadingTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const stopInitialLoading = () => {
  initialLoading.value = false;
};

watch(
  preferredColor,
  value => {
    document.body.classList.toggle('dark', value === 'dark');
  },
  {
    immediate: true,
  },
);

onBeforeMount(() => {
  if (!stimulusDetected.value) initialLoadingTimeout.value = setTimeout(stopInitialLoading, 10 * 1000);
});

onBeforeUnmount(() => {
  if (initialLoadingTimeout.value) clearTimeout(initialLoadingTimeout.value);
});
</script>
