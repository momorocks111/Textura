"use strict";

import { TextAnalyzer } from "./text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";

export class BasicMode {
  constructor() {
    this.textArea = document.getElementById("basicModeText");
    this.resultsContainer = document.getElementById("results");
    this.clearBtn = document.getElementById("clearButton");
    this.plagiarismCheckBtn = document.getElementById("plagerismCheckButton");
    this.saveResultsBtn = document.getElementById("saveResultsButton");
    this.loadResultsBtn = document.getElementById("loadResultsButton");
    this.downloadPdfBtn = document.getElementById("downloadPdfButton");

    this.resultsRenderer = new ResultsRenderer(this.resultsContainer);
    this.debouncedHandleTextInput = this.debounce(
      this.handleTextInput.bind(this),
      300
    );

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.textArea.addEventListener("input", this.debouncedHandleTextInput);
    this.clearBtn.addEventListener("click", this.handleClearResults.bind(this));
    this.plagiarismCheckBtn.addEventListener(
      "click",
      this.handlePlagiarismCheck.bind(this)
    );
    this.saveResultsBtn.addEventListener(
      "click",
      this.handleSaveResults.bind(this)
    );
    this.loadResultsBtn.addEventListener(
      "click",
      this.handleLoadResults.bind(this)
    );
    this.downloadPdfBtn.addEventListener(
      "click",
      this.handleDownloadPdf.bind(this)
    );
  }

  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  handleTextInput() {
    const text = this.textArea.value;
    this.analyzeText(text);
  }

  async analyzeText(text) {
    const analyzer = new TextAnalyzer(text);
    const results = analyzer.analyze();
    this.resultsRenderer.render(results);
  }

  handleClearResults() {
    this.textArea.value = "";
    this.resultsContainer.innerHTML = "";
  }

  handlePlagiarismCheck() {
    console.log("Plagiarism check functionality to be implemented");
  }

  handleSaveResults() {
    console.log("Save results functionality to be implemented");
  }

  handleLoadResults() {
    console.log("Load results functionality to be implemented");
  }

  handleDownloadPdf() {
    console.log("Download PDF functionality to be implemented");
  }
}
