<template>
  <div class="px-3 py-1">
    <StimulusControllerClassesRow v-for="cssClass in classes" :key="cssClass.name" :css-class="cssClass" />
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { ParsedStimulusControllerInstance } from '@/types/stimulus.ts';
import { useControllerInstanceClasses } from '@/composables/stimulus/useControllerInstanceClasses.ts';
import StimulusControllerClassesRow from '@/components/stimulus/members/classes/StimulusControllerClassesRow.vue';

const props = defineProps<{
  instance: ParsedStimulusControllerInstance;
}>();

const { classes } = useControllerInstanceClasses(toRef(props, 'instance'));
</script>
