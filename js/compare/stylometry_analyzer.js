"use strict";

import { sentimentLexicon } from "../archive/sentiment_lexicon.js";

export class StylometryAnalyzer {
  constructor(originalText, comparingText) {
    this.originalText = originalText;
    this.comparingText = comparingText;
  }

  async analyze() {
    const originalMetrics = await this.calculateMetrics(this.originalText);
    const comparingMetrics = await this.calculateMetrics(this.comparingText);

    return {
      original: originalMetrics,
      comparing: comparingMetrics,
      differences: this.calculateDifferences(originalMetrics, comparingMetrics),
    };
  }

  async calculateMetrics(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(Boolean);

    return {
      wordCount: words.length,
      sentences: sentences.length,
      averageSentenceLength: words.length / sentences.length || 0,
      averageWordLength:
        words.reduce((sum, word) => sum + word.length, 0) / words.length || 0,
      lexicalDensity: await this.calculateLexicalDensity(words),
      typeTokenRatio: new Set(words).size / words.length,
      functionWordRatio: (await this.countFunctionWords(words)) / words.length,
      readabilityScore: this.calculateReadabilityScore(text),
      sentimentScore: await this.analyzeSentiment(text),
    };
  }

  async calculateLexicalDensity(words) {
    const lexicalWords = await this.filterLexicalWords(words);
    return lexicalWords.length / words.length;
  }

  async filterLexicalWords(words) {
    const functionWords = await this.getFunctionWords();
    return words.filter((word) => !functionWords.has(word));
  }

  async getFunctionWords() {
    return new Set([
      "the",
      "is",
      "at",
      "which",
      "on",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "with",
      "to",
    ]);
  }

  async countFunctionWords(words) {
    const functionWords = await this.getFunctionWords();
    return words.filter((word) => functionWords.has(word)).length;
  }

  calculateReadabilityScore(text) {
    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const syllables = words.reduce(
      (count, word) => count + this.countSyllables(word),
      0
    );

    return (
      206.835 -
      1.015 * (words.length / sentences.length) -
      84.6 * (syllables / words.length)
    );
  }

  countSyllables(word) {
    word = word.toLowerCase();

    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    return word.match(/[aeiouy]{1,2}/g)?.length || 1;
  }

  async analyzeSentiment(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    let totalScore = 0;

    sentences.forEach((sentence) => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      let sentenceScore = 0;
      let isNegated = false;
      let intensifierMultiplier = 1;

      sentenceWords.forEach((word, index) => {
        if (sentimentLexicon.negators.has(word)) {
          isNegated = true;
        } else if (sentimentLexicon.intensifiers.has(word)) {
          intensifierMultiplier = 2;
        } else {
          let wordScore = 0;

          if (sentimentLexicon.positive.has(word)) {
            wordScore = 1;
          } else if (sentimentLexicon.negative.has(word)) {
            wordScore = -1;
          }

          if (isNegated) {
            wordScore *= -1;
            isNegated = false;
          }

          wordScore *= intensifierMultiplier;
          intensifierMultiplier = 1;

          const surroundingWords = sentenceWords
            .slice(Math.max(0, index - 2), index)
            .concat(sentenceWords.slice(index + 1, index + 3));

          const contextMultiplier =
            this.calculateContextMultiplier(surroundingWords);

          wordScore *= contextMultiplier;
          sentenceScore += wordScore;
        }
      });

      totalScore += sentenceScore;
    });

    const normalizedScore = totalScore / sentences.length;

    return {
      score: normalizedScore,
      label: this.getSentimentLabel(normalizedScore),
      magnitude: Math.abs(normalizedScore),
    };
  }

  calculateContextMultiplier(surroundingWords) {
    let multiplier = 1;
    surroundingWords.forEach((word) => {
      if (sentimentLexicon.intensifiers.has(word)) {
        multiplier *= 1.5;
      } else if (sentimentLexicon.negators.has(word)) {
        multiplier *= -1;
      }
    });

    return multiplier;
  }

  getSentimentLabel(score) {
    if (score > 0.5) return "Very Positive";
    if (score > 0.1) return "Positive";
    if (score > -0.1) return "Neutral";
    if (score > -0.5) return "Negative";
    return "Very Negative";
  }

  calculateDifferences(originalMetrics, comparingMetrics) {
    const differences = {};
    for (const key in originalMetrics) {
      if (
        typeof originalMetrics[key] === "number" &&
        typeof comparingMetrics[key] === "number"
      ) {
        differences[key] = Math.abs(
          originalMetrics[key] - comparingMetrics[key]
        );
      }
    }
    return differences;
  }
}
