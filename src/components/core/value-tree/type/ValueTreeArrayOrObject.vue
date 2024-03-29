<template>
  <ValueTreeWrapper :name :level has-children @delete="$emit('delete')">
    <template #value>
      <span type="button" class="select-none text-muted-foreground">
        <template v-if="Array.isArray(modelValue)"> Array ({{ modelValue.length }}) </template>
        <template v-else> Object </template>
      </span>
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
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import ValueTree from '@/components/core/value-tree/ValueTree.vue';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';

const props = withDefaults(
  defineProps<{
    name: string;
    type: 'array' | 'object';
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<Record<string, any> | any[]>({ required: true });

defineEmits(['delete']);

const onUpdate = (key: string | number, value: any) => {
  const clone = props.type === 'array' ? Array.from(modelValue.value as any[]) : { ...modelValue.value };
  // @ts-ignore
  clone[key] = value;
  modelValue.value = clone;
};

const onDelete = (key: string | number) => {
  if (props.type === 'array') {
    const clone = Array.from(modelValue.value as any[]);
    // @ts-ignore
    clone.splice(key, 1);
    modelValue.value = clone;
  } else {
    const clone = { ...modelValue.value };
    // @ts-ignore
    delete clone[key];
    modelValue.value = clone;
  }
};
</script>
