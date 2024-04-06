<template>
  <ValueTreeWrapper :name :level has-children @delete="$emit('delete')">
    <template #value>
      <span type="button" class="select-none text-muted-foreground"> Array ({{ modelValue.length }}) </span>
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
    <template #children>
      <ValueTree
        v-for="[key, value] in Object.entries(modelValue)"
        :key="key"
        :name="key.toString()"
        :model-value="value"
        :level="level + 1"
        @delete="onDelete(key)"
        @update:model-value="onUpdate(key, $event)"
      />
      <ValueTreeArrayForm :index="modelValue.length" :level @save="onFormSave" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import ValueTree from '@/components/core/value-tree/ValueTree.vue';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import ValueTreeArrayForm from '@/components/core/value-tree/form/ValueTreeArrayForm.vue';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<any[]>({ required: true });

defineEmits(['delete']);

const onUpdate = (key: string | number, value: any) => {
  const clone = Array.from(modelValue.value as any[]);
  // @ts-ignore
  clone[key] = value;
  modelValue.value = clone;
};

const onDelete = (key: string | number) => {
  const clone = Array.from(modelValue.value as any[]);
  // @ts-ignore
  clone.splice(key, 1);
  modelValue.value = clone;
};

const onFormSave = (value: string | number | boolean) => {
  onUpdate(modelValue.value.length, value);
};
</script>
