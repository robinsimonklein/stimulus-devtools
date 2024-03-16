import { Highlighter, getHighlighter } from 'shiki';

export let highlighter: Highlighter;

export async function initHighlighter() {
  highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['css', 'javascript'],
  });
}
