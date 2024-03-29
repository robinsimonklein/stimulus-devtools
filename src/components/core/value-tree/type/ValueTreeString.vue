<template>
  <ValueTreeWrapper :name :level :keep-actions-visible="isEditing" @delete="$emit('delete')">
    <template #value>
      <template v-if="!isEditing">"</template>
      <span
        ref="valueElement"
        class="inline-block font-mono text-code-purple"
        :class="{ 'px-1.5 py-0.5': isEditing }"
        spellcheck="false"
        :contenteditable="isEditing"
        @keydown.enter.stop="save"
        @keydown.esc.stop="cancel"
        @keydown.up.stop
        @keydown.down.stop
        @blur="onBlur"
      />
      <template v-if="!isEditing">"</template>
    </template>
    <template #actions>
      <!-- Edit -->
      <template v-if="isEditing">
        <Button
          :id="`value-save-${name}-${level}`"
          ref="saveButton"
          size="icon-sm"
          variant="secondary"
          @click.stop="save"
        >
          <Check class="h-3.5 w-3.5" />
        </Button>
        <Button ref="cancelButton" size="icon-sm" variant="secondary" @click.stop="cancel">
          <XIcon class="h-3.5 w-3.5" />
        </Button>
      </template>
      <template v-else>
        <Button ref="editButton" size="icon-sm" variant="ghost" @click.stop="edit">
          <Pencil class="h-3.5 w-3.5" />
        </Button>
      </template>
    </template>
    <template v-if="$slots.more" #more>
      <slot name="more" />
    </template>
  </ValueTreeWrapper>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import { Button } from '@/components/ui/button';
import { Pencil, Check, XIcon } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<string>({ required: true });

defineEmits(['delete']);

const valueElement = ref<HTMLInputElement | null>(null);
const editButton = ref<HTMLButtonElement | null>(null);
const saveButton = ref<HTMLButtonElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);

const isEditing = ref(false);

const edit = () => {
  isEditing.value = true;
  nextTick(() => {
    if (!valueElement.value) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(valueElement.value.childNodes[0], modelValue.value.length);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
    valueElement.value.focus();
  });
};

const save = () => {
  if (!valueElement.value) return;
  isEditing.value = false;
  modelValue.value = valueElement.value.innerText;
};

const cancel = () => {
  if (!isEditing.value) return;
  if (!valueElement.value) return;
  valueElement.value.innerText = modelValue.value;
  isEditing.value = false;
};

const onBlur = (e: FocusEvent) => {
  if ((e.relatedTarget as HTMLElement)?.id === `value-save-${props.name}-${props.level}`) return;
  cancel();
};

watch(modelValue, newValue => {
  // Prevent overriding current editing value
  if (isEditing.value) return;
  if (!valueElement.value) return;
  valueElement.value.innerText = newValue;
});

onMounted(() => {
  if (!valueElement.value) return;
  valueElement.value.innerText = modelValue.value;
});
</script>
