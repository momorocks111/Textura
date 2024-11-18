"use strict";

import { TextAnalyzer } from "../basic/text_analyzer.js";
import { ResultsRenderer } from "../utils/results_renderer.js";
import { Comparison } from "./comparison.js";
import { ModalManager } from "../utils/modal_manager.js";
import { DiffHighlighter } from "./diff_highlighter.js";

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

    this.stylometryAnalysisButton.addEventListener("click", () => {
      console.log("Stylometry Analysis functionality to be implemented.");
      // Call your stylometry analysis logic here
    });

    this.commonPhraseButton.addEventListener("click", () => {
      console.log("Compare Sophistication functionality to be implemented.");
      // Call your sophistication comparison logic here
    });
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
}
