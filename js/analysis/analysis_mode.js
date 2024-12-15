"use strict";

import { ModalManager } from "../utils/modal_manager.js";
import { TextTransformer } from "./text_transformer.js";
import { KeywordAnalyzer } from "./keyword_analyzer.js";
import { KeywordVisualizer } from "./keyword_visualizer.js";
import { TranslationModel } from "./translation_model.js";

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
    this.translationModel = null;

    // Utils
    this.modalManager = new ModalManager();

    // Variables
    this.vocabularySize = 1000;
    this.hiddenSize = 100;

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
    const text = this.textArea.value.trim();

    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter text for keyword suggestion"
      );
      return;
    }

    const [sourceSentences, targetSentences] = this.preprocessText(text);

    if (!this.translationModel) {
      this.translationModel = new TranslationModel(
        this.vocabularySize,
        this.hiddenSize,
        this.vocabularySize
      );
    }

    this.trainModel(sourceSentences, targetSentences);
    this.displayTrainingResults();
  }

  handleClusterSentences() {
    console.log("Cluster Sentences feature not yet implemented");
  }

  handleTranslation() {
    const input = document.getElementById("translationInput").value;
    if (!input) {
      this.modalManager.showModal("No Input", "Please enter text to translate");
      return;
    }

    const translatedText = this.translationModel.translate(input);
    document.getElementById("translationOutput").textContent = translatedText;
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

    // Display top keywords with scores and POS
    html += '<div class="keyword-suggestion__list">';

    analysis.keywords.forEach((keyword) => {
      html += `
            <div class="keyword-suggestion__item">
              <span class="keyword-suggestion__word">${keyword.word}</span>
              <span class="keyword-suggestion__score">${keyword.score}</span>
              <span class="keyword-suggestion__pos">${keyword.pos}</span>
              ${this.keywordVisualizer.generateScoreBar(keyword.score)}
              <button class="keyword-suggestion__copy" data-keyword="${
                keyword.word
              }">Copy</button>
            </div>
          `;
    });

    html += "</div>";

    // Display filters for parts of speech
    html += '<div class="keyword-suggestion__filters">';

    html += `
          <label><input type="checkbox" value="noun" checked> Nouns</label>
          <label><input type="checkbox" value="verb" checked> Verbs</label>
          <label><input type="checkbox" value="adjective" checked> Adjectives</label>
          <label><input type="checkbox" value="other" checked> Other</label>
        `;

    html += "</div>";

    // Display word cloud
    html += '<div class="keyword-suggestion__word-cloud">';

    html += this.keywordVisualizer.generateWordCloud(analysis.keywords);

    html += "</div>";

    // Display related keywords
    html += '<div class="keyword-suggestion__related">';

    html += relatedKeywords
      .map(
        (item) => `
             <div class="related-keywords__item">
               <span class="related-keyword__original">${item.original}</span>
               <span class="related-keyword__suggestions">${item.related.join(
                 ", "
               )}</span>
             </div>
           `
      )
      .join("");

    html += "</div>";

    // Copy all button and original text
    html += `<button class="keyword-suggestion__copy-all">Copy All Keywords</button>`;

    html += `<div class="keyword-suggestion__original-text">${analysis.originalText}</div>`;

    html += "</div>";

    this.analysisResults.innerHTML = html;

    this.addEventListenersToKeywords(analysis.keywords);
  }

  addEventListenersToKeywords(keywords) {
    const copyButtons = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__copy"
    );
    copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const keyword = button.getAttribute("data-keyword");
        navigator.clipboard.writeText(keyword);
        alert(`Copied "${keyword}" to clipboard!`);
      });
    });

    const copyAllButton = this.analysisResults.querySelector(
      ".keyword-suggestion__copy-all"
    );
    copyAllButton.addEventListener("click", () => {
      const allKeywords = keywords.map((k) => k.word).join(", ");
      navigator.clipboard.writeText(allKeywords);
      alert("All keywords copied to clipboard!");
    });

    const filterInputs = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__filters input"
    );
    filterInputs.forEach((input) => {
      input.addEventListener("change", () => this.filterKeywords());
    });
  }

  filterKeywords() {
    const checkedPOS = Array.from(
      this.analysisResults.querySelectorAll(
        ".keyword-suggestion__filters input:checked"
      )
    ).map((input) => input.value);

    const keywordItems = this.analysisResults.querySelectorAll(
      ".keyword-suggestion__item"
    );
    keywordItems.forEach((item) => {
      const pos = item.querySelector(".keyword-suggestion__pos").textContent;
      item.style.display = checkedPOS.includes(pos) ? "block" : "none";
    });
  }

  highlightKeywordInText(keyword) {
    const textElement = this.analysisResults.querySelector(
      ".keyword-suggestion__original-text"
    );
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");

    textElement.innerHTML = textElement.textContent.replace(
      regex,
      (match) => `<span class="highlighted-keyword">${match}</span>`
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

  addEventListenersToKeywords(keywords) {
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

    // Add more event listeners for filtering or highlighting as needed
  }

  /** ===============================
      =======Translation Model======= 
      =============================== */
  preprocessText(text) {
    const sentences = text.split("\n").filter((s) => s.trim() !== "");
    const midpoint = Math.floor(sentences.length / 2);
    return [sentences.slice(0, midpoint), sentences.slice(midpoint)];
  }

  trainModel(sourceSentences, targetSentences) {
    for (let i = 0; i < sourceSentences.length; i++) {
      const sourceVector = this.sentenceToVector(sourceSentences[i]);
      const targetVector = this.sentenceToVector(targetSentences[i]);
      this.translationModel.train(sourceVector, targetVector);
    }
  }

  sentenceToVector(sentence) {
    const vector = new Array(this.vocabularySize).fill(0);
    const words = sentence.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      const index = this.hashWord(word);
      vector[index]++;
    });
    return [vector];
  }

  hashWord(word) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % this.vocabularySize;
  }

  displayTrainingResults() {
    let html = '<div class="translation-model__results">';
    html += "<h3>Translation Model Trained</h3>";
    html +=
      "<p>The model has been trained on the provided text. You can now use it for simple translations.</p>";
    html += '<div class="translation-model__input">';
    html +=
      '<textarea id="translationInput" placeholder="Enter text to translate..."></textarea>';
    html += '<button id="translateButton">Translate</button>';
    html += "</div>";
    html += '<div id="translationOutput"></div>';
    html += "</div>";

    this.analysisResults.innerHTML = html;
    this.addTranslationEventListener();
  }

  addTranslationEventListener() {
    const translateButton = document.getElementById("translateButton");
    translateButton.addEventListener("click", () => {
      this.handleTranslation.bind(this);
      const input = document.getElementById("translationInput").value;
      const inputVector = this.sentenceToVector(input);
      const outputVector = this.translationModel.predict(inputVector);
      const translation = this.vectorToSentence(outputVector);
      document.getElementById("translationOutput").textContent = translation;
    });
  }

  vectorToSentence(vector) {
    return vector
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item) => `Word${item.index}`)
      .join(" ");
  }
}
