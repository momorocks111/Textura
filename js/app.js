"use strict";

import { ModeSwitcher } from "./utils/mode_switcher.js";
import { ThemeManager } from "./utils/theme_manager.js";

class App {
  constructor() {
    this.modeSwitcher = new ModeSwitcher();
    this.themeManager = new ThemeManager();
  }

  init() {}
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
