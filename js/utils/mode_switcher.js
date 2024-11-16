"use strict";

export class ModeSwitcher {
  constructor() {
    this.modes = ["basic", "compare", "summarization", "keywordExtraction"];
    this.currentMode = "basic";
    this.modeContents = {};
    this.modeButtons = {};

    this.initializeModeElements();
    this.addEventListeners();
  }

  initializeModeElements() {
    this.modes.forEach((mode) => {
      // Adjust the ID to match HTML
      this.modeContents[mode] = document.getElementById(`${mode}ModeContent`);
      this.modeButtons[mode] = document.getElementById(`${mode}ModeButton`);
    });
  }

  addEventListeners() {
    this.modes.forEach((mode) => {
      if (this.modeButtons[mode]) {
        this.modeButtons[mode].addEventListener("click", () => {
          this.switchMode(mode);
        });
      }
    });
  }

  // Switch Modes
  switchMode(newMode) {
    // Return if user presses on same button
    if (newMode === this.currentMode) return;

    // Hide all mode contents
    this.modes.forEach((mode) => {
      const content = document.getElementById(`${mode}ModeContent`);
      if (content) {
        content.hidden = true;
      }
    });

    // Display selected mode content
    const newModeContent = document.getElementById(`${newMode}ModeContent`);
    if (newModeContent) {
      newModeContent.hidden = false;
    }

    // Update button classes and aria-pressed
    this.modes.forEach((mode) => {
      const button = document.getElementById(`${mode}ModeButton`);
      if (button) {
        if (mode === newMode) {
          button.classList.add("active");
          button.setAttribute("aria-pressed", "true");
        } else {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        }
      }
    });

    this.currentMode = newMode;

    // Dispatch a custom event for mode change
    window.dispatchEvent(new CustomEvent("modeChanged", { detail: newMode }));
  }
}
