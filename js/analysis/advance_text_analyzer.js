"use strict";

import { storyElements } from "../archive/story_elements.js";

export class AdvancedTextAnalyzer {
  analyzeText(text) {
    const tokens = this.tokenize(text);
    const posTags = this.tagPartsOfSpeech(tokens);
    const entities = this.recognizeNamedEntities(tokens);
    const sentenceStructure = this.analyzeSentenceStructure(text);
    const readabilityScore = this.calculateReadabilityScore(text);

    return {
      tokens,
      posTags,
      entities,
      sentenceStructure,
      readabilityScore,
    };
  }

  tokenize(text) {
    return text.match(/\b\w+\b/g) || [];
  }

  tagPartsOfSpeech(tokens) {
    // Simplified POS tagging
    return tokens.map((token) => {
      if (storyElements.characters.includes(token))
        return { word: token, pos: "NOUN" };
      if (storyElements.actions.includes(token))
        return { word: token, pos: "VERB" };
      if (storyElements.descriptors.includes(token))
        return { word: token, pos: "ADJ" };
      return { word: token, pos: "OTHER" };
    });
  }

  recognizeNamedEntities(tokens) {
    return tokens.filter(
      (token) =>
        storyElements.characters.includes(token) ||
        storyElements.settings.includes(token)
    );
  }

  analyzeSentenceStructure(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.map((sentence) => ({
      length: sentence.split(" ").length,
      type: sentence.endsWith("?") ? "question" : "statement",
    }));
  }

  calculateReadabilityScore(text) {
    const words = text.split(" ").length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    return (words / sentences).toFixed(2);
  }
}
