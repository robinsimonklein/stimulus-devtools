<template>
  <div>
    <!-- String -->
    <ValueTreeString
      v-if="type === 'string'"
      :model-value="modelValue"
      :name
      :level
      @update:model-value="updateValue"
      @delete="$emit('delete')"
    >
      <template v-if="$slots.more" #more>
        <slot name="more" />
      </template>
    </ValueTreeString>

    <!-- Number -->
    <ValueTreeNumber
      v-else-if="type === 'number'"
      :model-value="modelValue"
      :name
      :level
      @update:model-value="updateValue"
      @delete="$emit('delete')"
    >
      <template v-if="$slots.more" #more>
        <slot name="more" />
      </template>
    </ValueTreeNumber>

    <!-- Boolean -->
    <ValueTreeBoolean
      v-else-if="type === 'boolean'"
      :model-value="modelValue"
      :name
      :level
      @update:model-value="updateValue"
      @delete="$emit('delete')"
    >
      <template v-if="$slots.more" #more>
        <slot name="more" />
      </template>
    </ValueTreeBoolean>

    <!-- Array or Object -->
    <ValueTreeArrayOrObject
      v-else-if="type === 'array' || type === 'object'"
      :model-value="modelValue"
      :name
      :level
      :type
      @update:model-value="updateValue"
      @delete="$emit('delete')"
    >
      <template v-if="$slots.more" #more>
        <slot name="more" />
      </template>
    </ValueTreeArrayOrObject>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ValueTreeBoolean from '@/components/core/value-tree/type/ValueTreeBoolean.vue';
import ValueTreeString from '@/components/core/value-tree/type/ValueTreeString.vue';
import ValueTreeNumber from '@/components/core/value-tree/type/ValueTreeNumber.vue';
import ValueTreeArrayOrObject from '@/components/core/value-tree/type/ValueTreeArrayOrObject.vue';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
    definedType?: string; // TODO(idea): Show warning if model value type is not the same as defined type
  }>(),
  {
    level: 0,
    definedType: undefined,
  },
);

const modelValue = defineModel<any>({ required: true });

defineEmits(['delete']);

const type = computed(() => {
  if (typeof modelValue.value === 'number') return 'number';
  if (typeof modelValue.value === 'boolean') return 'boolean';
  if (typeof modelValue.value === 'object') return Array.isArray(modelValue.value) ? 'array' : 'object';
  if (modelValue.value === null) return 'null';
  if (modelValue.value === undefined) return 'undefined';
  return 'string';
});

const updateValue = (newValue: any) => {
  modelValue.value = newValue;
};
</script>
