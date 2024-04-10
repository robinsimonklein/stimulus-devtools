<template>
  <ValueTreeWrapper v-model:show-children="showChildren" :name :level has-children @delete="$emit('delete')">
    <template #value>
      <span type="button" class="select-none text-muted-foreground"> Array ({{ modelValue.length }}) </span>
    </template>
    <template #actions>
      <Button ref="addButton" size="icon-sm" variant="ghost" :disabled="showForm" @click="handleShowForm">
        <Plus class="h-3.5 w-3.5" />
      </Button>
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
        @delete="onDelete(parseInt(key))"
        @update:model-value="onUpdate(parseInt(key), $event)"
      />
      <ValueTreeArrayForm
        v-if="showForm"
        :index="modelValue.length"
        :level
        @save="onFormSave"
        @cancel="showForm = false"
      />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ValueTree from '@/components/core/value-tree/ValueTree.vue';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import ValueTreeArrayForm from '@/components/core/value-tree/form/ValueTreeArrayForm.vue';
import { Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

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

const showChildren = ref(false);
const showForm = ref(false);

const onUpdate = (key: number, value: any) => {
  const clone = Array.from(modelValue.value as any[]);
  // @ts-ignore
  clone[key] = value;
  modelValue.value = clone;
};

const onDelete = (key: number) => {
  const clone = Array.from(modelValue.value as any[]);
  // @ts-ignore
  clone.splice(key, 1);
  modelValue.value = clone;
};

const onFormSave = (value: string | number | boolean) => {
  onUpdate(modelValue.value.length, value);
  showForm.value = false;
};

const handleShowForm = () => {
  showChildren.value = true;
  showForm.value = true;
};
</script>
