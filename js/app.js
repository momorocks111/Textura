"use strict";

import { ModeSwitcher } from "./utils/mode_switcher.js";
import { ThemeManager } from "./utils/theme_manager.js";
import { BasicMode } from "./basic/basic_mode.js";

class App {
  constructor() {
    this.modeSwitcher = new ModeSwitcher();
    this.themeManager = new ThemeManager();
    this.BasicMode = new BasicMode();
  }

  init() {}
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
