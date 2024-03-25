<template>
  <div class="px-3 py-2 overflow-y-auto">
    <template v-if="values?.length">
      <StimulusControllerValuesRow v-for="value in values" :key="value.key" :value="value" :instance="instance" />
    </template>

    <template v-else>
      <p class="text-sm text-muted-foreground">No value.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useControllerInstanceValues } from '@/composables/stimulus/useControllerInstanceValues.ts';
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { toRef } from 'vue';
import StimulusControllerValuesRow from '@/components/stimulus/members/values/StimulusControllerValuesRow.vue';

const props = defineProps<{
  instance: ParsedStimulusControllerInstance;
}>();

const { values } = useControllerInstanceValues(toRef(props, 'instance'));
</script>
