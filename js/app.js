"use strict";

import { ModeSwitcher } from "./utils/mode_switcher.js";

class App {
  constructor() {
    this.modeSwitcher = new ModeSwitcher();
  }

  init() {}
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
