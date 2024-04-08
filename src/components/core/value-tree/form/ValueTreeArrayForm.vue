<template>
  <div class="flex items-center">
    <span
      class="mr-1 inline-block h-[16px] w-[16px] shrink-0"
      :style="{
        marginLeft: `${(level + 1) * 16}px`,
      }"
    />
    <div v-if="isFormVisible" class="flex shrink-0 items-center font-mono text-sm">
      <span class="select-none">
        <span class="text-code-navy opacity-50">{{ index }}</span>
        <span class="ml-0.5 text-muted-foreground">:</span>
      </span>
      <div class="ml-1 shrink-0">
        <span
          ref="input"
          class="relative inline-block px-1.5 py-0.5 outline-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:outline after:outline-2 after:outline-muted-foreground after:content-['']"
          :class="style"
          spellcheck="false"
          contenteditable
          @input="onInput"
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
        <Button ref="saveButton" data-ignore-blur size="icon-sm" variant="secondary" @click.stop="save">
          <Check class="h-3.5 w-3.5" />
        </Button>
        <Button ref="cancelButton" size="icon-sm" variant="secondary" @click.stop="cancel">
          <XIcon class="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
    <Button v-else size="icon-sm" variant="ghost" @click="showForm">
      <Plus class="h-3.5 w-3.5" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { Check, Plus, XIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

withDefaults(
  defineProps<{
    index?: number;
    level?: number;
  }>(),
  {
    index: 0,
    level: 0,
  },
);

const emits = defineEmits(['save']);

const input = ref<HTMLInputElement | null>(null);

const isFormVisible = ref(false);
const value = ref('');

const type = computed(() => {
  if (value.value === 'true' || value.value === 'false') return 'boolean';
  if (/^-?\d+(\.\d{1,2})?$/.test(value.value)) return 'number';
  return 'string';
});

const style = computed(() => {
  switch (type.value) {
    case 'boolean':
      return 'text-code-green';
    case 'number':
      return 'text-code-orange';
    default:
      return 'text-code-purple';
  }
});

const showForm = () => {
  isFormVisible.value = true;
  nextTick(() => {
    if (input.value) input.value.focus();
  });
};

const onInput = () => {
  if (!input.value) return;

  value.value = input.value.innerText;
};

const save = () => {
  let formattedValue: string | number | boolean = input.value?.innerHTML || '';
  if (type.value === 'boolean') formattedValue = JSON.parse(formattedValue);
  if (type.value === 'number') formattedValue = parseFloat(formattedValue as string);
  emits('save', formattedValue);
  isFormVisible.value = false;
};

const cancel = () => {
  value.value = '';
  isFormVisible.value = false;
};

const onBlur = (e: FocusEvent) => {
  if ((e.relatedTarget as HTMLElement)?.hasAttribute('data-ignore-blur')) return;
  cancel();
};
</script>
