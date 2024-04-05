<template>
  <ValueTreeWrapper :name :level :keep-actions-visible="isEditing" @delete="$emit('delete')">
    <template #value>
      <div class="inline-flex shrink-0 font-mono text-code-orange">
        <span
          ref="valueElement"
          class="relative inline-block outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:opacity-0 after:outline after:outline-2 after:content-['']"
          :class="[
            {
              '-ml-1 px-1.5 py-0.5 after:opacity-100': isEditing,
            },
            isEditing && !isValid ? 'after:outline-destructive' : 'after:outline-muted-foreground',
          ]"
          spellcheck="false"
          :contenteditable="isEditing"
          @input="validate"
          @keydown.enter.prevent.stop="save"
          @keydown.esc.prevent.stop="cancel"
          @keydown.up.exact.prevent.stop="increment(1)"
          @keydown.up.shift.prevent.stop="increment(10)"
          @keydown.up.alt.prevent.stop="increment(0.1)"
          @keydown.down.exact.prevent.stop="decrement(1)"
          @keydown.down.shift.prevent.stop="decrement(10)"
          @keydown.down.alt.prevent.stop="decrement(0.1)"
          @blur="onBlur"
        />
      </div>
    </template>
    <template #actions>
      <!-- Edit -->
      <template v-if="isEditing">
        <Button
          v-if="isValid"
          :id="`value-save-${name}-${level}`"
          ref="saveButton"
          size="icon-sm"
          variant="secondary"
          @click="save"
        >
          <Check class="h-3.5 w-3.5" />
        </Button>
        <span
          v-else
          class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-destructive text-destructive-foreground"
        >
          <TriangleAlert class="h-3.5 w-3.5" />
        </span>
        <Button ref="cancelButton" size="icon-sm" variant="secondary" @click="cancel">
          <XIcon class="h-3.5 w-3.5" />
        </Button>
      </template>
      <template v-else>
        <Button ref="editButton" size="icon-sm" variant="ghost" @click="edit"><Pencil class="h-3.5 w-3.5" /></Button>
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
import { Pencil, Check, XIcon, TriangleAlert } from 'lucide-vue-next';
import { placeCursorAtEnd } from '@/utils/dom.ts';

const precision = 1000;

const props = withDefaults(
  defineProps<{
    name: string;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const modelValue = defineModel<number>({ required: true });

defineEmits(['delete']);

const valueElement = ref<HTMLInputElement | null>(null);
const editButton = ref<HTMLButtonElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const saveButton = ref<HTMLButtonElement | null>(null);

const isEditing = ref(false);
const isValid = ref(false);

const validate = () => {
  if (!valueElement.value) return;
  const value = valueElement.value.innerText;
  isValid.value = /^-?\d+(\.\d{1,2})?$/.test(value);
};

const decrement = (factor: number) => {
  if (!isEditing.value) return;
  if (!valueElement.value) return;
  const value = parseFloat(valueElement.value.innerText);
  if (!isNaN(value)) valueElement.value.innerText = ((value * precision - factor * precision) / precision).toString();
  placeCursorAtEnd(valueElement.value);
};

const increment = (factor: number) => {
  if (!isEditing.value) return;
  if (!valueElement.value) return;
  const value = parseFloat(valueElement.value.innerText);
  if (!isNaN(value)) valueElement.value.innerText = ((value * precision + factor * precision) / precision).toString();
  placeCursorAtEnd(valueElement.value);
};

const edit = () => {
  isEditing.value = true;

  nextTick(() => {
    if (!valueElement.value) return;
    placeCursorAtEnd(valueElement.value);
    valueElement.value.focus();
    validate();
  });
};

const save = () => {
  validate();
  if (!isValid.value) return;
  if (!valueElement.value) return;
  isEditing.value = false;
  modelValue.value = parseFloat(valueElement.value.innerText);
};

const cancel = () => {
  if (!isEditing.value) return;
  if (!valueElement.value) return;
  valueElement.value.innerText = modelValue.value.toString();
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
  valueElement.value.innerText = newValue.toString();
  validate();
});

onMounted(() => {
  if (!valueElement.value) return;
  valueElement.value.innerText = modelValue.value.toString();
  validate();
});
</script>
