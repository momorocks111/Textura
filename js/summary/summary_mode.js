"use strict";

import { TextAnalyzer } from "../basic/text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";
import { ModalManager } from "../utils/modal_manager.js";
import { Summarizer } from "./summarizer.js";
import { Paraphraser } from "./paraphraser.js";
import { ThematicAnalyzer } from "./thematic_analyzer.js";
import { stopWords } from "../archive/stop_words.js";
import { sentimentLexicon } from "../archive/sentiment_lexicon.js";
import { HeadlineGenerator } from "./headline_generator.js";

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

    if (!this.isTextCoherent(text)) {
      this.modalManager.showModal(
        "Invalid Text",
        "Please enter coherent text for analysis"
      );

      return;
    }

    const thematicAnalyzer = new ThematicAnalyzer(text);
    const analysisResults = thematicAnalyzer.analyze();
    this.resultsRenderer.renderThematicAnalysis(analysisResults);
  }

  handleHeadlineGeneration() {
    const text = this.summarizationInput.value.trim();
    if (!this.validateText(text, "generate headlines")) return;

    if (!this.isTextCoherent(text)) {
      this.modalManager.showModal(
        "Invalid Text",
        "Please enter coherent text for analysis"
      );
      return;
    }

    const headlineGenerator = new HeadlineGenerator(
      text,
      stopWords,
      sentimentLexicon
    );
    const headlines = headlineGenerator.generate();

    this.resultsRenderer.renderHeadlines(headlines, {
      regenerateCallback: this.handleHeadlineGeneration.bind(this),
      selectCallback: (selectedHeadline) => {
        this.modalManager.showModal(
          "Selected Headline",
          `You've chosen: "${selectedHeadline}"`
        );
      },
    });
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

  isTextCoherent(text) {
    const words = text.split(/\s+/);
    if (words.length < 30) return false;

    // Simple coherence check (can be improved with more sophisticated NLP techniques)
    const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
    return uniqueWords.size / words.length > 0.4; // Arbitrary threshold
  }
}
