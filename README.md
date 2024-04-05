<div align="center">
    <br><br>
        <a href="https://chromewebstore.google.com/detail/stimulus-devtools/ljofhbgbmcnggnnomninmadlnicbojbh" target="_blank">
            <img style="max-width: 100%; width: 360px; height: auto;" src=".github/stimulus_devtools_logo.svg" alt="Stimulus DevTools" />
        </a>
    <br><br>
</div>

<h4 align="center">A developer tool for inspecting and debugging Stimulus applications.</h4>

<p align="center">
    <img alt="Chrome Web Store Version" src="https://img.shields.io/chrome-web-store/v/ljofhbgbmcnggnnomninmadlnicbojbh">
    <img alt="CI" src="https://github.com/robinsimonklein/stimulus-devtools/actions/workflows/ci.yml">
</p>



## Overview

The [Stimulus DevTools Chrome Extension](https://chromewebstore.google.com/detail/stimulus-devtools/ljofhbgbmcnggnnomninmadlnicbojbh) is designed to simplify the process of debugging [Stimulus](https://stimulus.hotwired.dev/) on a web page. It provides a user-friendly interface for inspecting values, targets, outlets, and classes of Stimulus controllers, all directly from Chrome's DevTools.

*Inspired by the amazing [Vue DevTools](https://github.com/vuejs/devtools) and [Nuxt DevTools](https://github.com/nuxt/devtools).*

![Screenshot](.github/screenshot.jpg)

## Features

- ✨ **Controllers List:** Get a quick view of all Stimulus controllers present on the current page.
- 🔍 **Property Inspection:** Inspect values, targets, outlets, and classes associated with each controller.
- ✏️ **Real-time Modification:** Change controller's values on-the-fly and observe immediate updates.

## Usage

### Install the Extension

Download and install the Stimulus Debugger Chrome Extension [from the Chrome Web Store](https://chromewebstore.google.com/detail/stimulus-devtools/ljofhbgbmcnggnnomninmadlnicbojbh).

### Open Stimulus DevTools

1. Navigate to your web page where Stimulus controllers are used.
2. Open Chrome DevTools by right-clicking on the page, selecting "Inspect", or using the keyboard shortcut (Ctrl+Shift+I on Windows/Linux or Cmd+Opt+I on macOS).
3. In Chrome DevTools, go to the "Stimulus" tab.

### Enable Stimulus DevTools on your project

Ensure that the Stimulus application is added to `window.Stimulus` in your project. This is necessary for the extension to detect and display the Stimulus controllers properly.

For example :
```javascript
// src/application.js
import { Application } from "@hotwired/stimulus"

import HelloController from "./controllers/hello_controller"
import ClipboardController from "./controllers/clipboard_controller"

window.Stimulus = Application.start() // <- Here
Stimulus.register("hello", HelloController)
Stimulus.register("clipboard", ClipboardController)
```

#### TypeScipt

If you are using TypeScript in your project, it may throw an error when accessing `window.Stimulus`. To fix that, add this `stimulus.d.ts` file :

```typescript
import type { Application } from '@hotwired/stimulus';

declare global {
  interface Window {
    Stimulus?: Application;
  }
}
```

## License

This project is licensed under the [MIT License](LICENSE).

---

> [robinsimonklein.com](https://robinsimonklein.com) &nbsp;&middot;&nbsp;
> GitHub [@robinsimonklein](https://github.com/robinsimonklein) &nbsp;&middot;&nbsp;
> 𝕏 [@rsimonklein](https://twitter.com/rsimonklein)
