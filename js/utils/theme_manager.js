"use strict";

export class ThemeManager {
  constructor() {
    this.themeModal = document.getElementById("themeModal");
    this.themeToggle = document.getElementById("themeToggle");
    this.themeOptions = document.querySelectorAll(".theme-modal__option");
    this.currentTheme = localStorage.getItem("selectedTheme") || "default";

    this.themes = {
      default: this.setDefaultTheme,
      light: this.setLightTheme,
      nature: this.setNatureTheme,
      ocean: this.setOceanTheme,
      sunset: this.setSunsetTheme,
      forest: this.setForestTheme,
      cyberpunk: this.setCyberpunkTheme,
      pastel: this.setPastelTheme,
      monochrome: this.setMonochromeTheme,
    };

    this.init();
  }

  init() {
    if (!this.themeToggle) {
      console.error("Theme toggle button not found");
      return;
    }

    this.themeToggle.addEventListener(
      "click",
      this.toggleThemeModal.bind(this)
    );

    this.themeOptions.forEach((option) => {
      option.addEventListener("click", this.handleThemeSelection.bind(this));
    });

    document.addEventListener("click", this.closeModalOutside.bind(this));

    this.setTheme(this.currentTheme);

    // Ensure modal is hidden initially
    this.hideModal();
  }

  toggleThemeModal(event) {
    event.stopPropagation();
    if (this.themeModal.style.display === "none") {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  showModal() {
    this.themeModal.style.display = "flex";
    this.themeModal.classList.add("theme-modal--active");
  }

  hideModal() {
    this.themeModal.style.display = "none";
    this.themeModal.classList.remove("theme-modal--active");
  }

  closeModalOutside(event) {
    if (
      this.themeModal.style.display !== "none" &&
      !this.themeModal.contains(event.target) &&
      event.target !== this.themeToggle
    ) {
      this.hideModal();
    }
  }

  handleThemeSelection(event) {
    const selectedTheme = event.target.getAttribute("data-theme");
    this.setTheme(selectedTheme);
    this.hideModal();
  }

  setTheme(theme) {
    if (this.themes[theme]) {
      this.themes[theme].call(this);
      this.currentTheme = theme;
      localStorage.setItem("selectedTheme", theme);
      this.updateActiveThemeButton();
    } else {
      console.error(`Theme '${theme}' not found`);
    }
  }

  updateActiveThemeButton() {
    this.themeOptions.forEach((option) => {
      option.classList.toggle(
        "active",
        option.getAttribute("data-theme") === this.currentTheme
      );
    });
  }

  setDefaultTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#1a1a2e");
    root.style.setProperty("--bg-secondary", "#16213e");
    root.style.setProperty("--text-primary", "#e94560");
    root.style.setProperty("--text-secondary", "#2eb0c4");
    root.style.setProperty("--accent", "#e94560");
    root.style.setProperty("--accent-light", "#ff6b6b");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#000000");
    root.style.setProperty("--textarea-placeholder-clr", "#cccccc");
    root.style.setProperty("--result-bg", "#1e2235");
    root.style.setProperty("--result-border", "#2a2f4c");
    root.style.setProperty("--changed-bg", "#2e1e35");
    root.style.setProperty("--changed-text", "#ff9f9f");
    root.style.setProperty("--original-changed-text", "#427abf");
    root.style.setProperty("--summary-kept", "#71ff71");
    root.style.setProperty("--summary-removed", "#fe9191");
    root.style.setProperty("--sentiment-positive", "#4caf50");
    root.style.setProperty("--sentiment-negative", "#f44336");
    root.style.setProperty("--sentiment-neutral", "#ffc107");
  }

  setLightTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#ffffff");
    root.style.setProperty("--bg-secondary", "#f0f0f0");
    root.style.setProperty("--text-primary", "#333333");
    root.style.setProperty("--text-secondary", "#666666");
    root.style.setProperty("--accent", "#0066cc");
    root.style.setProperty("--accent-light", "#3399ff");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#000000");
    root.style.setProperty("--textarea-placeholder-clr", "#aaaaaa");
    root.style.setProperty("--result-bg", "#f9f9f9");
    root.style.setProperty("--result-border", "#e0e0e0");
    root.style.setProperty("--changed-bg", "#e6f3ff");
    root.style.setProperty("--changed-text", "#0066cc");
    root.style.setProperty("--original-changed-text", "#cc6600");
    root.style.setProperty("--summary-kept", "#4caf50");
    root.style.setProperty("--summary-removed", "#f44336");
    root.style.setProperty("--sentiment-positive", "#4caf50");
    root.style.setProperty("--sentiment-negative", "#f44336");
    root.style.setProperty("--sentiment-neutral", "#ffc107");
  }

  setNatureTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#2c3e50");
    root.style.setProperty("--bg-secondary", "#34495e");
    root.style.setProperty("--text-primary", "#2ecc71");
    root.style.setProperty("--text-secondary", "#27ae60");
    root.style.setProperty("--accent", "#e67e22");
    root.style.setProperty("--accent-light", "#f39c12");
    root.style.setProperty("--white-clr", "#ecf0f1");
    root.style.setProperty("--black-clr", "#2c3e50");
    root.style.setProperty("--textarea-placeholder-clr", "#bdc3c7");
    root.style.setProperty("--result-bg", "#3c5a6e");
    root.style.setProperty("--result-border", "#4a6b82");
    root.style.setProperty("--changed-bg", "#2e5e3e");
    root.style.setProperty("--changed-text", "#7bed9f");
    root.style.setProperty("--original-changed-text", "#3498db");
    root.style.setProperty("--summary-kept", "#2ecc71");
    root.style.setProperty("--summary-removed", "#e74c3c");
    root.style.setProperty("--sentiment-positive", "#2ecc71");
    root.style.setProperty("--sentiment-negative", "#e74c3c");
    root.style.setProperty("--sentiment-neutral", "#f1c40f");
  }

  setOceanTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#1e3799");
    root.style.setProperty("--bg-secondary", "#4a69bd");
    root.style.setProperty("--text-primary", "#f6b93b");
    root.style.setProperty("--text-secondary", "#fad390");
    root.style.setProperty("--accent", "#fa983a");
    root.style.setProperty("--accent-light", "#fbc531");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#0c2461");
    root.style.setProperty("--textarea-placeholder-clr", "#b2bec3");
    root.style.setProperty("--result-bg", "#2c4b8f");
    root.style.setProperty("--result-border", "#3c5da3");
    root.style.setProperty("--changed-bg", "#1e4b8f");
    root.style.setProperty("--changed-text", "#fbc531");
    root.style.setProperty("--original-changed-text", "#78e08f");
    root.style.setProperty("--summary-kept", "#78e08f");
    root.style.setProperty("--summary-removed", "#eb2f06");
    root.style.setProperty("--sentiment-positive", "#78e08f");
    root.style.setProperty("--sentiment-negative", "#eb2f06");
    root.style.setProperty("--sentiment-neutral", "#f6b93b");
  }

  setSunsetTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#2c2c54");
    root.style.setProperty("--bg-secondary", "#474787");
    root.style.setProperty("--text-primary", "#ff5252");
    root.style.setProperty("--text-secondary", "#ff793f");
    root.style.setProperty("--accent", "#ffb142");
    root.style.setProperty("--accent-light", "#ffda79");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#2c2c54");
    root.style.setProperty("--textarea-placeholder-clr", "#b2bec3");
    root.style.setProperty("--result-bg", "#3c3c6e");
    root.style.setProperty("--result-border", "#4c4c8a");
    root.style.setProperty("--changed-bg", "#4c3c6e");
    root.style.setProperty("--changed-text", "#ffda79");
    root.style.setProperty("--original-changed-text", "#ff793f");
    root.style.setProperty("--summary-kept", "#33d9b2");
    root.style.setProperty("--summary-removed", "#ff5252");
    root.style.setProperty("--sentiment-positive", "#33d9b2");
    root.style.setProperty("--sentiment-negative", "#ff5252");
    root.style.setProperty("--sentiment-neutral", "#ffb142");
  }

  setForestTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#1b4332");
    root.style.setProperty("--bg-secondary", "#2d6a4f");
    root.style.setProperty("--text-primary", "#d8f3dc");
    root.style.setProperty("--text-secondary", "#b7e4c7");
    root.style.setProperty("--accent", "#95d5b2");
    root.style.setProperty("--accent-light", "#74c69d");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#081c15");
    root.style.setProperty("--textarea-placeholder-clr", "#95d5b2");
    root.style.setProperty("--result-bg", "#2d6a4f");
    root.style.setProperty("--result-border", "#40916c");
    root.style.setProperty("--changed-bg", "#1b4332");
    root.style.setProperty("--changed-text", "#95d5b2");
    root.style.setProperty("--original-changed-text", "#74c69d");
    root.style.setProperty("--summary-kept", "#52b788");
    root.style.setProperty("--summary-removed", "#d8f3dc");
    root.style.setProperty("--sentiment-positive", "#52b788");
    root.style.setProperty("--sentiment-negative", "#b7e4c7");
    root.style.setProperty("--sentiment-neutral", "#95d5b2");
  }

  setCyberpunkTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#0f0f1b");
    root.style.setProperty("--bg-secondary", "#1a1a2e");
    root.style.setProperty("--text-primary", "#00ffff");
    root.style.setProperty("--text-secondary", "#ff00ff");
    root.style.setProperty("--accent", "#ff00ff");
    root.style.setProperty("--accent-light", "#ff66ff");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#000000");
    root.style.setProperty("--textarea-placeholder-clr", "#4d4d4d");
    root.style.setProperty("--result-bg", "#1a1a2e");
    root.style.setProperty("--result-border", "#2a2a4e");
    root.style.setProperty("--changed-bg", "#2e1a2e");
    root.style.setProperty("--changed-text", "#ff66ff");
    root.style.setProperty("--original-changed-text", "#00ffff");
    root.style.setProperty("--summary-kept", "#00ff00");
    root.style.setProperty("--summary-removed", "#ff0000");
    root.style.setProperty("--sentiment-positive", "#00ff00");
    root.style.setProperty("--sentiment-negative", "#ff0000");
    root.style.setProperty("--sentiment-neutral", "#ffff00");
  }

  setPastelTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#ffefd5");
    root.style.setProperty("--bg-secondary", "#ffe4e1");
    root.style.setProperty("--text-primary", "#696969");
    root.style.setProperty("--text-secondary", "#808080");
    root.style.setProperty("--accent", "#dda0dd");
    root.style.setProperty("--accent-light", "#06e6fa");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#000000");
    root.style.setProperty("--textarea-placeholder-clr", "#d3d3d3");
    root.style.setProperty("--result-bg", "#fff0f5");
    root.style.setProperty("--result-border", "#ffdab9");
    root.style.setProperty("--changed-bg", "#e6e6fa");
    root.style.setProperty("--changed-text", "#dda0dd");
    root.style.setProperty("--original-changed-text", "#b0e0e6");
    root.style.setProperty("--summary-kept", "#98fb98");
    root.style.setProperty("--summary-removed", "#ffb6c1");
    root.style.setProperty("--sentiment-positive", "#98fb98");
    root.style.setProperty("--sentiment-negative", "#ffb6c1");
    root.style.setProperty("--sentiment-neutral", "#f0e68c");
  }

  setMonochromeTheme() {
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", "#ffffff");
    root.style.setProperty("--bg-secondary", "#f0f0f0");
    root.style.setProperty("--text-primary", "#000000");
    root.style.setProperty("--text-secondary", "#333333");
    root.style.setProperty("--accent", "#666666");
    root.style.setProperty("--accent-light", "#999999");
    root.style.setProperty("--white-clr", "#ffffff");
    root.style.setProperty("--black-clr", "#000000");
    root.style.setProperty("--textarea-placeholder-clr", "#cccccc");
    root.style.setProperty("--result-bg", "#f9f9f9");
    root.style.setProperty("--result-border", "#e0e0e0");
    root.style.setProperty("--changed-bg", "#e6e6e6");
    root.style.setProperty("--changed-text", "#333333");
    root.style.setProperty("--original-changed-text", "#666666");
    root.style.setProperty("--summary-kept", "#999999");
    root.style.setProperty("--summary-removed", "#cccccc");
    root.style.setProperty("--sentiment-positive", "#666666");
    root.style.setProperty("--sentiment-negative", "#333333");
    root.style.setProperty("--sentiment-neutral", "#999999");
  }
}
