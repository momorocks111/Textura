"use strict";

export class BasicMode {
  constructor() {
    this.textArea = document.getElementById("basicModeText");
    this.clearBtn = document.getElementById("clearButton");
    this.plagiarismCheckBtn = document.getElementById("plagerismCheckButton");
    this.saveResultsBtn = document.getElementById("saveResultsButton");
    this.loadResultsBtn = document.getElementById("loadResultsButton");
    this.downloadPdfBtn = document.getElementById("downloadPdfButton");

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.textArea.addEventListener("input", this.debounce.bind(this));

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

  debounce() {
    const text = this.textArea.value;
    console.log(text);
  }

  handleClearResults() {
    console.log("Clear Pressed");
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
