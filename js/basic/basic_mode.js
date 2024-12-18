"use strict";

import { TextAnalyzer } from "./text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";
import { ModalManager } from "../utils/modal_manager.js";
import { PlagiarismChecker } from "./plagiarism_checker.js";
import { SavedResultsManager } from "./saved_results_manager.js";
import { AnimationManager } from "./animation_manager.js";
import { PdfGenerator } from "./pdf_generator.js";

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

    this.modalManager = new ModalManager();
    this.plagiarismChecker = new PlagiarismChecker();
    this.savedResultsManager = new SavedResultsManager();
    this.animationManager = new AnimationManager();
    this.pdfGenerator = new PdfGenerator(this.textArea, this.resultsContainer);
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

  // basic_mode.js
  async analyzeText(text) {
    const analyzer = new TextAnalyzer(text);
    const results = analyzer.analyze();

    // Update how sentiment is displayed
    const sentimentResult = results.sentimentScore;
    const sentimentHtml = `
      <div class="sentiment-result">
        <p>Sentiment: ${sentimentResult.label}</p>
        <p>Score: ${sentimentResult.score.toFixed(2)}</p>
        <p>Magnitude: ${sentimentResult.magnitude.toFixed(2)}</p>
      </div>
    `;

    // Include this sentimentHtml in your results rendering
    this.resultsRenderer.render({ ...results, sentimentHtml });
  }

  handleClearResults() {
    if (
      this.textArea.value.trim() === "" &&
      this.resultsContainer.innerHTML.trim() === ""
    ) {
      this.modalManager.showModal(
        "No Content to Clear",
        "There is no text or results to clear."
      );
    } else {
      this.textArea.value = "";
      this.resultsContainer.innerHTML = "";
      this.modalManager.showModal(
        "Cleared",
        "Text and results have been cleared."
      );
    }
  }

  async handlePlagiarismCheck() {
    const text = this.textArea.value.trim();
    const wordCount = text.split(/\s+/).length;
    const MIN_WORDS = 35;

    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter some text before checking for plagiarism"
      );
      return;
    }

    if (wordCount < MIN_WORDS) {
      this.modalManager.showModal(
        "Insufficient Text",
        `Please enter at least ${MIN_WORDS} words for an accurate plagiarism check. Current word count: ${wordCount}`
      );

      return;
    }

    this.modalManager.showModal("Checking for plagiarism...", "Please wait...");

    setTimeout(() => {
      const result = this.plagiarismChecker.checkPlagiarism(text);
      this.showPlagiarismResult(result);
    }, 2000);
  }

  async handleSaveResults() {
    const text = this.textArea.value.trim();
    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter some text before saving results"
      );
      return;
    }

    const analyzer = new TextAnalyzer(text);
    const analysisResults = analyzer.analyze();

    await this.animationManager.showSavingAnamation();

    const savedResult = this.savedResultsManager.saveResult(
      text,
      analysisResults
    );

    this.modalManager.showModal(
      "Results Saved",
      `
            <p>Your analysis has been saved successfully.</p>
            <p>Date: ${savedResult.date}</p>
            <p>Word Count: ${savedResult.results.wordCount}</p>
        `
    );
  }

  async handleLoadResults() {
    const savedResults = this.savedResultsManager.getsavedResults();
    if (savedResults.length === 0) {
      this.modalManager.showModal(
        "No Saved Results",
        "There are no saved results to load."
      );
      return;
    }

    await this.animationManager.showLoadingAnimation();

    const content = this.createLoadResultsContent(savedResults);
    this.modalManager.showModal(
      "Load Saved Results",
      content,
      this.handleLoadResultAction.bind(this)
    );
  }

  handleDownloadPdf() {
    const text = this.textArea.value.trim();
    if (!text) {
      this.modalManager.showModal(
        "No Text",
        "Please enter some text before downloading as PDF."
      );
      return;
    }

    this.showFileNameInputModal();
  }

  // Utility Functions
  showPlagiarismResult(result) {
    const content = `
        <div class="plagiarism-result">
            <div class="score-circle" style="background: conic-gradient(${
              result.message.color
            } ${result.overallScore}%, %ddd 0);">
                <span>${result.overallScore.toFixed(1)}%</span>
            </div>
            <p class="result-message" style="color:${result.message.color};">${
      result.message.text
    }</p>
            <div class="score-details">
                <p>Similarity Score: ${result.similarityScore.toFixed(1)}%</p>
                <p>Academic Score: ${result.academicScore.toFixed(1)}</p>
            </div>
        </div>
    `;

    this.modalManager.showModal("Plagiarism Check Result", content);
  }

  // Loading
  createLoadResultsContent(savedResults) {
    return `
      <div class="saved-results-grid">
        ${savedResults
          .map(
            (result) => `
          <div class="saved-result-card" data-id="${result.id}">
            <div class="result-content">
              <p class="result-date">${result.date}</p>
              <p class="result-word-count">Words: ${result.results.wordCount}</p>
            </div>
            <div class="result-actions">
              <button class="load-result-btn" data-action="load" data-id="${result.id}">
                <i class="fas fa-folder-open"></i>
              </button>
              <button class="delete-result-btn" data-action="delete" data-id="${result.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  handleLoadResultAction(event) {
    const target = event.target.closest("button");
    if (!target) return;

    const action = target.dataset.action;
    const resultId = parseInt(target.dataset.id);

    if (action === "load") {
      this.loadSavedResult(resultId);
    } else if (action === "delete") {
      this.showDeleteConfirmation(resultId);
    }
  }

  loadSavedResult(resultId) {
    const result = this.savedResultsManager.getResultsById(resultId);
    if (result) {
      this.textArea.value = result.text;
      this.handleTextInput();
      this.modalManager.closeModal();
    }
  }

  showDeleteConfirmation(resultId) {
    this.modalManager.showModal(
      "Confirm Deletion",
      `
        <p>Are you sure you want to delete this saved analysis?</p>
        <div class="confirmation-buttons">
          <button class="confirm-btn" id="confirmDelete" data-action="confirm" data-id="${resultId}">Yes, delete</button>
          <button class="cancel-btn" id="cancelDelete" data-action="cancel">Cancel</button>
        </div>
      `,
      this.handleDeleteConfirmation.bind(this)
    );
  }

  handleDeleteConfirmation(event) {
    const target = event.target.closest("button");
    if (!target) return;

    const action = target.dataset.action;

    if (action === "confirm") {
      const resultId = parseInt(target.dataset.id);
      this.savedResultsManager.deleteResult(resultId);
      this.handleLoadResults();
    } else if (action === "cancel") {
      this.modalManager.closeModal();
    }
  }

  // PDF Download Functionality
  showFileNameInputModal() {
    const content = `
        <div class="file-name-input">
            <input type="text" id="pdfFileName" placeholder="Enter file name" value="analysis">
            <p class="file-extension">.pdf</p>
        </div>
        <div class="modal-buttons">
            <button id="downloadPdf" class="primary-btn">Download</button>
            <button id="cancelDownload" class="secondary-btn">Cancel</button>
        </div>
    `;

    this.modalManager.showModal(
      "Name Your PDF",
      content,
      this.handlePdfModelAction.bind(this)
    );
  }

  async handlePdfModelAction(event) {
    const target = event.target;
    if (target.id === "downloadPdf") {
      const fileName =
        document.getElementById("pdfFileName").value.trim() || "analysis";
      this.modalManager.showLoadingModal("Generating PDF...");
      try {
        const pdf = await this.pdfGenerator.generatePdf(fileName);
        pdf.save(`${fileName}.pdf`);
        this.modalManager.showModal("Success", "Your PDF has been downloaded.");
      } catch (error) {
        console.error("Error generating PDF:", error);
        this.modalManager.showModal(
          "Error",
          "An error occurred while generating the PDF. Please try again."
        );
      }
    } else if (target.id === "cancelDownload") {
      this.modalManager.closeModal();
    }
  }
}
