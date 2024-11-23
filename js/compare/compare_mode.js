"use strict";

import { TextAnalyzer } from "../basic/text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";
import { Comparison } from "./comparison.js";
import { ModalManager } from "../utils/modal_manager.js";
import { DiffHighlighter } from "./diff_highlighter.js";
import { StylometryAnalyzer } from "./stylometry_analyzer.js";
import { SophisticationAnalyzer } from "./sophistication_analyzer.js";

export class CompareMode {
  constructor() {
    this.originalTextArea = document.getElementById("originalText");
    this.comparingTextArea = document.getElementById("comparingText");
    this.compareButton = document.getElementById("compareButton");
    this.diffHighlightButton = document.getElementById("diffHighlightButton");
    this.stylometryAnalysisButton = document.getElementById(
      "stylometryAnalysisButton"
    );
    this.commonPhraseButton = document.getElementById("commonPhraseButton");
    this.compareResultsContainer = document.getElementById("compareResults");

    this.resultsRenderer = new ResultsRenderer(this.compareResultsContainer);
    this.comparison = new Comparison();
    this.diffhighlighter = new DiffHighlighter();
    this.modalManager = new ModalManager();

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.compareButton.addEventListener("click", this.handleCompare.bind(this));

    this.diffHighlightButton.addEventListener(
      "click",
      this.handleDiffHighlight.bind(this)
    );

    this.stylometryAnalysisButton.addEventListener(
      "click",
      this.handleStylometryAnalysis.bind(this)
    );

    this.commonPhraseButton.addEventListener(
      "click",
      this.handleSophisticationComparison.bind(this)
    );
  }

  async handleCompare() {
    const originalText = this.originalTextArea.value.trim();
    const comparingText = this.comparingTextArea.value.trim();

    if (!originalText || !comparingText) {
      this.modalManager.showModal(
        "Enter Both Fields",
        "Both fields have to be filled out for comparison"
      );

      return;
    }

    const originalAnalyzer = new TextAnalyzer(originalText);
    const comparingAnalyzer = new TextAnalyzer(comparingText);

    const originalResults = originalAnalyzer.analyze();
    const comparingResults = comparingAnalyzer.analyze();

    const similarityScore = this.comparison.calculateSimilarityScore(
      originalText,
      comparingText
    );

    const uniqueWords = this.comparison.findUniqueWords(
      originalText,
      comparingText
    );
    const commonPhrases = this.comparison.findCommonPhrases(
      originalText,
      comparingText
    );
    const readabilityComparison = this.comparison.compareReadability(
      originalResults.readabilityScore,
      comparingResults.readabilityScore
    );
    const sentimentComparison = this.comparison.compareSentiment(
      originalResults.sentimentScore,
      comparingResults.sentimentScore
    );
    const topicComparison = this.comparison.compareTopics(
      originalResults.topicAnalysis,
      comparingResults.topicAnalysis
    );

    const comparisonResults = {
      originalText: originalResults,
      comparingText: comparingResults,
      similarityScore,
      uniqueWords,
      commonPhrases,
      readabilityComparison,
      sentimentComparison,
      topicComparison,
    };

    this.resultsRenderer.renderComparisonResults(comparisonResults);
  }

  handleDiffHighlight() {
    const originalText = this.originalTextArea.value.trim();
    const comparingText = this.comparingTextArea.value.trim();

    if (!originalText || !comparingText) {
      this.modalManager.showModal(
        "Enter Both Fields",
        "Both fields have to be filled out for check differences"
      );

      return;
    }

    const highlightedText = this.diffhighlighter.highlightDifferences(
      originalText,
      comparingText
    );
    this.renderHightlightedDifferences(highlightedText);
  }

  //   Diff Highlighter Funcs
  renderHightlightedDifferences(highlightedTexts) {
    this.compareResultsContainer.innerHTML = `
        <div class="highlighted-differences">
            <div class="highlighted-text original-text">
            <h3>Original Text</h3>
            <div>${highlightedTexts.text1}</div>
            </div>
            <div class="highlighted-text comparing-text">
            <h3>Comparing Text</h3>
            <div>${highlightedTexts.text2}</div>
            </div>
        </div>
    `;
  }

  async handleStylometryAnalysis() {
    const originalText = this.originalTextArea.value.trim();
    const comparingText = this.comparingTextArea.value.trim();

    if (!originalText || !comparingText) {
      this.modalManager.showModal(
        "Missing Text",
        "Please enter text in both fields to perform stylometric analysis"
      );

      return;
    }

    const stylometryAnalyzer = new StylometryAnalyzer(
      originalText,
      comparingText
    );
    const analysisResults = await stylometryAnalyzer.analyze();
    this.resultsRenderer.renderStylometryResults(analysisResults);
  }

  async handleSophisticationComparison() {
    const originalText = this.originalTextArea.value.trim();
    const comparingText = this.comparingTextArea.value.trim();

    if (!this.validateTexts(originalText, comparingText)) return;

    this.resultsRenderer.showLoadingAnimation();

    const sophisticationAnalyzer = new SophisticationAnalyzer(
      originalText,
      comparingText
    );
    const analysisResults = await sophisticationAnalyzer.analyze();

    this.resultsRenderer.hideLoadingAnimation();
    this.resultsRenderer.renderSophisticationResults(analysisResults);
  }

  validateTexts(text1, text2) {
    if (!text1 || !text2) {
      this.modalManager.showModal(
        "Enter Both Fields",
        "Both fields must be filled out for comparison"
      );
      return false;
    }

    if (text1.split(/\s+/).length < 30 || text2.split(/\s+/).length < 30) {
      this.modalManager.showModal(
        "Insufficient Words",
        "Each text must contain at least 30 words"
      );
      return false;
    }

    return true;
  }
}
