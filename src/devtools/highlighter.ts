import type { HighlighterCore } from 'shiki';
import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

// Themes
import themeGithubLight from 'shiki/themes/github-light.mjs';
import themeGithubDark from 'shiki/themes/github-dark.mjs';

// Langs
import langCss from 'shiki/langs/css.mjs';
import langJavascript from 'shiki/langs/javascript.mjs';

export let highlighter: HighlighterCore;

export async function initHighlighter() {
  highlighter = await getHighlighterCore({
    themes: [themeGithubLight, themeGithubDark],
    langs: [langCss, langJavascript],
    loadWasm: getWasm,
  });
}
