"use strict";

import { ModalManager } from "../utils/modal_manager.js";
import { StoryGenerator } from "./story_generator.js";

export class AnalysisMode {
  constructor() {
    this.textArea = document.getElementById("analysisInput");
    this.analysisResults = document.querySelector(".analysisResults");
    this.storyGenerationButton = document.getElementById(
      "storyGenerationButton"
    );
    this.keywordSuggestionsButton = document.getElementById(
      "keywordSuggestionsButton"
    );
    this.translationButton = document.getElementById("translationButton");
    this.clusteringButton = document.getElementById("clusteringButton");

    // Utils
    this.modalManager = new ModalManager();

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.storyGenerationButton.addEventListener(
      "click",
      this.handleStoryGeneration.bind(this)
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

  handleStoryGeneration() {
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
        "Please enter at least 30 words for a proper story generation"
      );
      return;
    }

    const storyGenerator = new StoryGenerator(text);
    const generatedStory = storyGenerator.generateStory();

    this.displayGeneratedStory(generatedStory);
  }

  displayGeneratedText(generatedText) {
    this.analysisResults.innerHTML = `
      <h2>Generated Text</h2>
      <p>${generatedText.join("<br>")}</p>
    `;
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

  isTextCoherent(text) {
    const words = text.split(/\s+/);
    if (words.length < 30) return false;

    // Simple coherence check (can be improved with more sophisticated NLP techniques)
    const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
    return uniqueWords.size / words.length > 0.4; // Arbitrary threshold
  }

  displayGeneratedStory(story) {
    this.analysisResults.innerHTML = `
      <h2>Generated Story</h2>
      <p>${story}</p>
    `;
  }
}
