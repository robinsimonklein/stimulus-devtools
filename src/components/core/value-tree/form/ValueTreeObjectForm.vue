<template>
  <div class="flex items-center">
    <span
      class="mr-1 inline-block h-[16px] w-[16px] shrink-0"
      :style="{
        marginLeft: `${(level + 1) * 16}px`,
      }"
    />
    <div class="flex shrink-0 items-center font-mono text-sm">
      <div class="select-none">
        <span
          ref="keyInput"
          data-ignore-blur
          class="relative inline-block px-1.5 py-0.5 text-code-navy outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:outline after:outline-2 after:content-['']"
          :class="keyStyle"
          spellcheck="false"
          contenteditable
          @input="onKeyInput"
          @keydown.enter.stop="save"
          @keydown.esc.stop="cancel"
          @keydown.up.stop
          @keydown.down.stop
          @blur="onBlur"
        >
          {{ key }}
        </span>
        <span class="ml-0.5 text-muted-foreground">:</span>
      </div>
      <div class="ml-1 shrink-0">
        <span
          ref="valueInput"
          data-ignore-blur
          class="relative inline-block px-1.5 py-0.5 outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:outline after:outline-2 after:outline-muted-foreground after:content-['']"
          :class="valueStyle"
          spellcheck="false"
          contenteditable
          @input="onValueInput"
          @keydown.enter.stop="save"
          @keydown.esc.stop="cancel"
          @keydown.up.stop
          @keydown.down.stop
          @blur="onBlur"
        >
          {{ value }}
        </span>
      </div>
      <div class="ml-2 inline-flex shrink-0 items-center gap-x-1">
        <Button
          v-if="isKeyValid"
          ref="saveButton"
          data-ignore-blur
          size="icon-sm"
          variant="secondary"
          @click.stop="save"
        >
          <Check class="h-3.5 w-3.5" />
        </Button>
        <span
          v-else
          class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-destructive text-destructive-foreground"
        >
          <TriangleAlert class="h-3.5 w-3.5" />
        </span>
        <Button ref="cancelButton" size="icon-sm" variant="secondary" @click.stop="cancel">
          <XIcon class="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Check, TriangleAlert, XIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    object: Record<string, any>;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const emits = defineEmits(['save', 'cancel']);

const keyInput = ref<HTMLInputElement | null>(null);
const valueInput = ref<HTMLInputElement | null>(null);

const key = ref('');
const value = ref('');

const isKeyValid = computed(() => {
  if (key.value in props.object) return false;
  if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key.value)) return false;
  return true;
});

const keyStyle = computed(() => {
  return isKeyValid.value ? 'after:outline-muted-foreground' : 'after:outline-destructive';
});

const valueType = computed(() => {
  if (value.value === 'true' || value.value === 'false') return 'boolean';
  if (/^-?\d+(\.\d{1,2})?$/.test(value.value)) return 'number';
  return 'string';
});

const valueStyle = computed(() => {
  switch (valueType.value) {
    case 'boolean':
      return 'text-code-green';
    case 'number':
      return 'text-code-orange';
    default:
      return 'text-code-purple';
  }
});

const onKeyInput = () => {
  if (!keyInput.value) return;

  key.value = keyInput.value.innerText;
};

const onValueInput = () => {
  if (!valueInput.value) return;

  value.value = valueInput.value.innerText;
};

const save = () => {
  if (!isKeyValid.value) return;

  let formattedValue: string | number | boolean = valueInput.value?.innerHTML || '';
  if (valueType.value === 'boolean') formattedValue = JSON.parse(formattedValue);
  if (valueType.value === 'number') formattedValue = parseFloat(formattedValue as string);
  emits('save', key.value, formattedValue);
};

const cancel = () => {
  key.value = '';
  value.value = '';
  emits('cancel');
};

const onBlur = (e: FocusEvent) => {
  if ((e.relatedTarget as HTMLElement)?.hasAttribute('data-ignore-blur')) return;
  cancel();
};

onMounted(() => {
  if (keyInput.value) keyInput.value.focus();
});
</script>
