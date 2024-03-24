<template>
  <ValueTreeWrapper :name :level :keep-actions-visible="isEditing">
    <template #value>
      <div v-if="isEditing" class="inline-flex">
        <form @submit.prevent="save">
          <input
            ref="editInput"
            v-model="tempValue"
            type="text"
            class="text-purple-600 dark:text-purple-400 font-mono dark:bg-neutral-800 px-1.5 py-0.5 rounded-sm"
            @keydown.esc.stop="cancel"
          />
        </form>
      </div>
      <span v-else class="inline-block text-purple-600 dark:text-purple-400 font-mono">
        "{{ modelValue.toString() }}"
      </span>
    </template>
    <template #actions>
      <!-- Edit -->
      <template v-if="isEditing">
        <Button ref="saveButton" size="icon-sm" variant="secondary" @click="save">
          <Check class="w-3.5 h-3.5" />
        </Button>
        <Button ref="cancelButton" size="icon-sm" variant="secondary" @click="cancel">
          <XIcon class="w-3.5 h-3.5" />
        </Button>
      </template>
      <template v-else>
        <Button size="icon-sm" variant="ghost" @click="edit"><Pencil class="w-3.5 h-3.5" /></Button>
      </template>
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import { Button } from '@/components/ui/button';
import { Pencil, Check, XIcon } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<string>({ required: true });

const editInput = ref<HTMLInputElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const saveButton = ref<HTMLButtonElement | null>(null);

const isEditing = ref(false);
const tempValue = ref('');

const edit = () => {
  tempValue.value = modelValue.value;
  isEditing.value = true;
  nextTick(() => {
    if (editInput.value) editInput.value.focus();
  });
};

const save = () => {
  modelValue.value = tempValue.value;
  isEditing.value = false;
  tempValue.value = '';
};

const cancel = () => {
  isEditing.value = false;
  tempValue.value = '';
};

onClickOutside(editInput, cancel, { ignore: [saveButton, cancelButton] });
</script>
