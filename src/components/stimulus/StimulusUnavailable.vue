<template>
  <div class="absolute inset-0 h-full overflow-y-auto">
    <div class="flex justify-center px-4 py-4 w-full">
      <div class="w-full max-w-[640px]">
        <Alert variant="warning">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>Stimulus not detected</AlertTitle>
          <AlertDescription> Follow the instructions to enable Stimulus DevTools. </AlertDescription>
        </Alert>

        <p class="text-sm my-8">
          The application must be accessible via
          <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium"
            >window.Stimulus</code
          >. Choose the implementation that corresponds to your project:
        </p>

        <div>
          <h3 class="text-xl font-semibold mt-6 mb-4">Webpack Encore (Symfony)</h3>
          <CodeBlock :code="webpackEncoreCode" />
          <h3 class="text-xl font-semibold mt-6 mb-4">Webpack Helpers</h3>
          <CodeBlock :code="webpackHelpersCode" />
          <h3 class="text-xl font-semibold mt-6 mb-4">Other</h3>
          <CodeBlock :code="otherCode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';
import CodeBlock from '@/components/core/CodeBlock.vue';

const webpackEncoreCode = `
// assets/bootstrap.js
import { startStimulusApp } from '@symfony/stimulus-bridge';

// Registers Stimulus controllers from controllers.json and in the controllers/ directory
export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\\.[jt]sx?$/
));

window.Stimulus = app`;

const webpackHelpersCode = `
import { Application } from "@hotwired/stimulus"
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers"

window.Stimulus = Application.start()
const context = require.context("./controllers", true, /\\.js$/)
Stimulus.load(definitionsFromContext(context))`;

const otherCode = `
// src/application.js
import { Application } from "@hotwired/stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

window.Stimulus = Application.start()
Stimulus.register("hello", HelloController)
Stimulus.register("clipboard", ClipboardController)`;
</script>
