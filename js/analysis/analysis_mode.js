"use strict";

export class AnalysisMode {
  constructor() {
    this.textArea = document.getElementById("analysisInput");
    this.analysisResults = document.getElementById("analysisResults");
    this.textGenerationButton = document.getElementById("textGenerationButton");
    this.keywordSuggestionsButton = document.getElementById(
      "keywordSuggestionsButton"
    );
    this.translationButton = document.getElementById("translationButton");
    this.clusteringButton = document.getElementById("clusteringButton");

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.textGenerationButton.addEventListener(
      "click",
      this.handleTextGeneration.bind(this)
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

  handleTextGeneration() {
    console.log("Text Generation feature not implemented yet.");
  }

  handleKeywordSuggestion() {
    console.log("Keyword Suggestions feature not yet implemented");
  }

  handleTranslationModel() {
    console.log("Train Translation Model feature not yet implemented");
  }

  handleClusterSentences() {
    console.log("Cluster Sentences feature not yet implemented");
  }
}
