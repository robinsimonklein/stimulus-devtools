import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

export const useCopyButton = () => {
  const copied = ref(false);
  const copiedTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const { copy } = useClipboard();

  const copyText = async (text: string) => {
    if (text) await copy(text);
    if (copiedTimeout.value) clearTimeout(copiedTimeout.value);

    copied.value = true;

    copiedTimeout.value = setTimeout(() => {
      copied.value = false;
    }, 1000);
  };

  return { copied, copy: copyText };
};
