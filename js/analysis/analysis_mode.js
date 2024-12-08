"use strict";

import { ModalManager } from "../utils/modal_manager.js";
import { TextTransformer } from "./text_transformer.js";

export class AnalysisMode {
  constructor() {
    this.textArea = document.getElementById("analysisInput");
    this.analysisResults = document.querySelector(".analysisResults");
    this.transfromTextButton = document.getElementById("transfromTextButton");
    this.keywordSuggestionsButton = document.getElementById(
      "keywordSuggestionsButton"
    );
    this.translationButton = document.getElementById("translationButton");
    this.clusteringButton = document.getElementById("clusteringButton");

    // Classes
    this.textTransformer = new TextTransformer();

    // Utils
    this.modalManager = new ModalManager();

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.transfromTextButton.addEventListener(
      "click",
      this.handleTransfromText.bind(this)
    );
    this.keywordSuggestionsButton.addEventListener(
      "click",
      this.handleKeywordSuggestion.bind(this)
    );
    this.translationButton.addEventListener(
      "click",
      this.handleTranslationModel.bind(this)
    );
    this.clusteringButton.addEventListener(
      "click",
      this.handleClusterSentences.bind(this)
    );
  }

  handleTransfromText() {
    const text = this.textArea.value.trim();

    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter text to generate new content"
      );
      return;
    }

    if (text.split(/\s+/).length < 30) {
      this.modalManager.showModal(
        "Insufficient Text",
        "Please enter at least 30 words for a proper text transformation"
      );
      return;
    }

    const transformedResults = this.textTransformer.transformText(text);
    this.displayTransformedResults(transformedResults);
  }

  handleKeywordSuggestion() {
    console.log("Keyword Suggestions feature not yet implemented");
  }

  handleTranslationModel() {
    console.log("Train Translation Model feature not yet implemented");
  }

  handleClusterSentences() {
    console.log("Cluster Sentences feature not yet implemented");
  }

  isTextCoherent(text) {
    const words = text.split(/\s+/);
    if (words.length < 30) return false;

    // Simple coherence check (can be improved with more sophisticated NLP techniques)
    const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
    return uniqueWords.size / words.length > 0.4; // Arbitrary threshold
  }

  // Results Renderer
  displayTransformedResults(results) {
    let html = '<div class="text-transformer__results">';

    results.forEach(({ name, result }) => {
      html += `
        <div class="text-transformer__result-section">
          <h3 class="text-transformer__result-title">${name}</h3>
          <button class="text-transformer__copy-button" data-content="${result}">
            <i class="fas fa-copy text-transformer__copy-icon"></i>
          </button>
          <p class="text-transformer__result-content">${result}</p>
        </div>
      `;
    });

    html += "</div>";

    this.analysisResults.innerHTML = html;

    this.addCopyButtonListeners();
  }

  createToast() {
    const toast = document.createElement("div");
    toast.className = "text-transformer__toast";
    toast.textContent = "Copied to clipboard";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("text-transformer__toast--visible");
      setTimeout(() => {
        toast.classList.remove("text-transformer__toast--visible");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 1000);
    }, 100);
  }

  addCopyButtonListeners() {
    const copyButtons = this.analysisResults.querySelectorAll(
      ".text-transformer__copy-button"
    );
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.getAttribute("data-content");
        navigator.clipboard.writeText(content).then(() => {
          const icon = button.querySelector(".text-transformer__copy-icon");
          icon.classList.remove("fa-copy");
          icon.classList.add("fa-check");
          this.createToast();
          setTimeout(() => {
            icon.classList.remove("fa-check");
            icon.classList.add("fa-copy");
          }, 3000);
        });
      });
    });
  }
}
