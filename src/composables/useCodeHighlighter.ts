import { computed, MaybeRef, unref } from 'vue';
import { highlighter } from '@/devtools/highlighter.ts';
import { usePreferredColorScheme } from '@vueuse/core';

export const useCodeHighlighter = () => {
  const preferredColor = usePreferredColorScheme();

  const theme = computed(() => (preferredColor.value === 'dark' ? 'github-dark' : 'github-light'));

  const codeToHtml = (code: MaybeRef<string>, lang: MaybeRef<string>) => {
    return computed(() => highlighter.codeToHtml(unref(code), { lang: unref(lang), theme: theme.value }));
  };

  return { codeToHtml };
};
