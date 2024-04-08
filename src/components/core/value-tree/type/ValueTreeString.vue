<template>
  <ValueTreeWrapper :name :level :keep-actions-visible="isEditing" @delete="$emit('delete')">
    <template #value>
      <div class="inline-flex shrink-0 items-center">
        <label
          v-if="isColor"
          class="relative mr-1 inline-block h-3.5 w-3.5 shrink-0 cursor-pointer rounded border"
          :style="`background-color: ${modelValue}`"
        >
          <input type="color" :value="modelValue" class="absolute h-0 w-0 opacity-0" @input="onColorInput" />
        </label>
        <div class="shrink-0 font-mono text-code-purple">
          <span v-if="!isEditing" class="select-none">"</span>
          <span
            ref="valueElement"
            class="relative inline-block outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:opacity-0 after:outline after:outline-2 after:outline-muted-foreground after:content-['']"
            :class="{ 'px-1.5 py-0.5 after:opacity-100': isEditing }"
            spellcheck="false"
            :contenteditable="isEditing"
            @keydown.enter.stop="save"
            @keydown.esc.stop="cancel"
            @keydown.up.stop
            @keydown.down.stop
            @blur="onBlur"
          />
          <span v-if="!isEditing" class="select-none">"</span>
        </div>
      </div>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import ValueTreeWrapper from '@/components/core/value-tree/ValueTreeWrapper.vue';
import { Button } from '@/components/ui/button';
import { Pencil, Check, XIcon } from 'lucide-vue-next';
import { placeCursorAtEnd } from '@/utils/dom.ts';

const colorRegex = new RegExp(/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/, 'i');

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

const isColor = computed(() => colorRegex.exec(modelValue.value));

const edit = () => {
  isEditing.value = true;
  nextTick(() => {
    if (!valueElement.value) return;
    placeCursorAtEnd(valueElement.value);
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

const onColorInput = (e: InputEvent) => {
  modelValue.value = (e.target as HTMLInputElement).value;
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
