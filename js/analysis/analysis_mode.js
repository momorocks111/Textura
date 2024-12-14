"use strict";

import { ModalManager } from "../utils/modal_manager.js";
import { TextTransformer } from "./text_transformer.js";
import { KeywordAnalyzer } from "./keyword_analyzer.js";
import { KeywordVisualizer } from "./keyword_visualizer.js";

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
    this.keywordAnalyzer = new KeywordAnalyzer();
    this.keywordVisualizer = new KeywordVisualizer();

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
    const text = this.textArea.value.trim();

    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter text for keyword suggestion"
      );
      return;
    }

    const analysis = this.keywordAnalyzer.analyzeKeywords(text);
    const relatedKeywords = this.keywordAnalyzer.suggestRelatedKeywords(
      analysis.keywords
    );
    this.displayKeywordResults(analysis, relatedKeywords);
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

  /** =============================
      ======Suggest Keywords======= 
      ============================= */
  displayKeywordResults(analysis, relatedKeywords) {
    let html = '<div class="keyword-suggestion__results">';
    html += '<div class="keyword-suggestion__list">';

    analysis.keywords.forEach((keyword) => {
      html += `
        <div class="keyword-suggestion__item">
          <span class="keyword-suggestion__word">${keyword.word}</span>
          <span class="keyword-suggestion__score">${keyword.score}</span>
          <span class="keyword-suggestion__pos">${keyword.pos}</span>
          ${this.keywordVisualizer.generateScoreBar(keyword.score)}
          <button class="keyword-suggestion__copy" data-keyword=${
            keyword.word
          }>Copy</button>
        </div>
      `;
    });
    html += "</div>";

    html += '<div class="keyword-suggestion__filters">';
    html += `
      <label><input type="checkbox" value="noun" checked> Nouns</label>
      <label><input type="checkbox" value="verb" checked> Verbs</label>
      <label><input type="checkbox" value="adjective" checked> Adjectives</label>
      <label><input type="checkbox" value="other" checked> Other</label>
    `;
    html += "</div>";

    html += '<div class="keyword-suggestion__word-cloud">';
    html += this.keywordVisualizer.generateWordCloud(analysis.keywords);
    html += "</div>";

    html += '<div class="keyword-suggestion__related">';
    html += this.generateRelatedKeywordsHTML(relatedKeywords);
    html += "</div>";

    html += `<button class="keyword-suggestion__copy-all">Copy All Keywords</button>`;
    html += `<div class="keyword-suggestion__original-text">${analysis.originalText}</div>`;
    html += "</div>";

    this.analysisResults.innerHTML = html;
    this.addEventListeners(analysis.keywords);
  }

  generateRelatedKeywordsHTML(relatedKeywords) {
    return relatedKeywords
      .map(
        (item) => `
        <div class="related-keywords__item">
          <span class="related-keyword__original">${item.original}</span>
          <span class="related-keyword__suggestions">${item.related.join(
            ","
          )}</span>
        </div>
    `
      )
      .join("");
  }

  addKeywordEventListeners(keywords) {
    const wordElements = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__word"
    );

    wordElements.forEach((element) => {
      element.addEventListener("click", () => {
        const keyword = element.textContent;
        this.highlightKeywordInText(keyword);
      });
    });

    const filterInputs = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__filters input"
    );
    filterInputs.forEach((input) => {
      input.addEventListener("change", () => this.filterKeywords());
    });

    const copyButtons = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__copy"
    );
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const keyword = button.getAttribute("data-keyword");
        navigator.clipboard.writeText(keyword);
        this.createToast("Keyword copied to clipboard");
      });
    });

    const copyAllButton = this.analysisResults.querySelector(
      ".keyword-suggestion__copy-all"
    );
    copyAllButton.addEventListener("click", () => {
      const allKeywords = keywords.map((k) => k.word).join(", ");
      navigator.clipboard.writeText(allKeywords);
      this.createToast("All keywords copied to clipboard");
    });
  }

  highlightKeywordInText(keyword) {
    const textElement = this.analysisResults.querySelector(
      ".keyword-suggestion__original-text"
    );
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");

    textElement.innerHTML = textElement.textContent.replace(
      regex,
      (match) => `<span class="keyword-highlight">${match}</span>`
    );
  }

  filterKeywords() {
    const checkedPOS = Array.from(
      this.analysisResults.querySelectorAll(
        ".keywords-suggestion__filters input::checked"
      )
    ).map((input) => input.value);

    const keyWordItems = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__item"
    );

    keyWordItems.forEach((item) => {
      const pos = item.querySelector(".keyword-suggestion__pos").textContent;
      item.style.display = checkedPOS.includes(pos) ? "block" : "none";
    });
  }
}
