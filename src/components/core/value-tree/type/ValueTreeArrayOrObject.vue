<template>
  <ValueTreeWrapper :name has-children>
    <template #value>
      <span type="button" class="text-muted-foreground select-none">
        <template v-if="Array.isArray(modelValue)"> Array ({{ modelValue.length }}) </template>
        <template v-else> Object </template>
      </span>
    </template>
    <template #children>
      <ValueTree
        v-for="[key, value] in Object.entries(modelValue)"
        :key="key"
        :name="key.toString()"
        :model-value="value"
        :level="level + 1"
        @update:model-value="onUpdate(key, $event)"
      >
        <template v-if="$slots.more" #more>
          <slot name="more" />
        </template>
      </ValueTree>
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

const onUpdate = (key: string | number, value: any) => {
  const clone = props.type === 'array' ? Array.from(modelValue.value as any[]) : { ...modelValue.value };
  // @ts-ignore
  clone[key] = value;
  modelValue.value = clone;
};
</script>
