"use strict";

export class BasicMode {
  constructor() {
    this.textArea = document.getElementById("basicModeText");
    this.clearBtn = document.getElementById("clearButton");
    this.plagiarismCheckBtn = document.getElementById("plagerismCheckButton");
    this.saveResultsBtn = document.getElementById("saveResultsButton");
    this.loadResultsBtn = document.getElementById("loadResultsButton");
    this.downloadPdfBtn = document.getElementById("downloadPdfButton");

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
    const results = await this.performAnalysis(text);
    this.updateResults(results);
  }

  async performAnalysis(text) {
    // Implement more complex analysis here
    return {
      wordCount: text.split(/\s+/).filter((word) => word.length > 0).length,
    };
  }

  updateResults(results) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = `
      <h2>Analysis Results</h2>
      <p>Word Count: ${results.wordCount}</p>
    `;
  }

  handleClearResults() {
    this.textArea.value = "";
    this.analyzeText("");
  }

  handlePlagiarismCheck() {
    console.log("Plagiarism clicked");
  }

  handleSaveResults() {
    console.log("Save clicked");
  }

  handleLoadResults() {
    console.log("Load clicked");
  }

  handleDownloadPdf() {
    console.log("Download clicked");
  }
}
