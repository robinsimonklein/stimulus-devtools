import { ref } from 'vue';
import { watchDebounced } from '@vueuse/core';

export const useChromeStorage = (key: string, defaultValue?: Record<string, any>) => {
  const value = ref<Record<string, any>>({ ...defaultValue });

  chrome.storage.local.get(key).then(storageValue => {
    value.value = { ...value.value, ...storageValue[key] };
  });

  watchDebounced(value, async newValue => {
    await chrome.storage.local.set({ [key]: newValue });
  });

  return value;
};
