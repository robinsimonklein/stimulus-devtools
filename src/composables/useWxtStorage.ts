import { storage } from '#imports';

export const useWxtStorage = <T extends string | number | boolean | object | null>(
  key: StorageItemKey,
  initialValue: T,
): Ref<T> => {
  const data = ref<T>(initialValue) as Ref<T>;

  let isSyncingFromStorage = false;

  const item = storage.defineItem<T>(key, {
    defaultValue: initialValue,
  });

  item.getValue().then(val => {
    isSyncingFromStorage = true;
    data.value = val;
    nextTick(() => {
      isSyncingFromStorage = false;
    });
  });

  const unwatchStorage = item.watch(newValue => {
    isSyncingFromStorage = true;
    data.value = newValue;
    nextTick(() => (isSyncingFromStorage = false));
  });

  watch(
    data,
    async newValue => {
      if (isSyncingFromStorage) return; // Skip save is change comes from storage
      await item.setValue(newValue);
    },
    { deep: true }, // Important for objects/arrays
  );

  onUnmounted(() => {
    unwatchStorage();
  });

  return data;
};
