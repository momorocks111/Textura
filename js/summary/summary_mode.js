"use strict";

import { TextAnalyzer } from "../basic/text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";
import { ModalManager } from "../utils/modal_manager.js";
import { Summarizer } from "./summarizer.js";
import { Paraphraser } from "./paraphraser.js";

export class SummaryMode {
  constructor() {
    this.summarizationInput = document.getElementById("summarizationInput");
    this.summarizeButton = document.getElementById("summarizeButton");
    this.paraphraseButton = document.getElementById("paraphraseButton");
    this.thematicAnalysisButton = document.getElementById(
      "thematicAnalysisButton"
    );
    this.headlineGeneratorButton = document.getElementById(
      "headlineGeneratorButton"
    );
    this.summaryResultsContainer = document.querySelector(".summaryResults");

    this.resultsRenderer = new ResultsRenderer(this.summaryResultsContainer);
    this.modalManager = new ModalManager();

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.summarizeButton.addEventListener(
      "click",
      this.handleSummarize.bind(this)
    );

    this.paraphraseButton.addEventListener(
      "click",
      this.handleParaphrase.bind(this)
    );
    this.thematicAnalysisButton.addEventListener(
      "click",
      this.handleThematicAnalysis.bind(this)
    );
    this.headlineGeneratorButton.addEventListener(
      "click",
      this.handleHeadlineGeneration.bind(this)
    );
  }

  handleSummarize() {
    const text = this.summarizationInput.value.trim();
    if (!this.validateText(text, "summarize")) return;

    const summarizer = new Summarizer(text);

    const summary = summarizer.summarize();

    this.resultsRenderer.renderSummary(summary);
  }

  handleParaphrase() {
    const text = this.summarizationInput.value.trim();
    if (!this.validateText(text, "paraphrase")) return;

    const paraphraser = new Paraphraser(text);
    const paraphrasedText = paraphraser.paraphrase();

    this.resultsRenderer.renderParaphrase(paraphrasedText, text);
  }

  handleThematicAnalysis() {
    const text = this.summarizationInput.value.trim();
    if (!this.validateText(text, "thematic analysis")) return;
  }

  handleHeadlineGeneration() {
    const text = this.summarizationInput.value.trim();
    if (!this.validateText(text, "generate headlines")) return;
  }

  validateText(text, message) {
    if (!text) {
      this.modalManager.showModal(
        "Empty Text",
        `Please enter text to ${message}`
      );
      return false;
    }
    return true;
  }
}
