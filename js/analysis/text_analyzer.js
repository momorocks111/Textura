"use strict";

import { sentimentWords } from "../archive/sentiment_words.js";
import { formalityIndicators } from "../archive/formality_indicators.js";

export class TextAnalyzer {
  constructor() {
    this.sentimentWords = sentimentWords;
    this.formalityIndicators = formalityIndicators;
  }

  analyzeText(text) {
    const words = this.tokenize(text);
    const sentences = this.getSentences(text);

    return {
      sentiment: this.analyzeSentiment(words),
      tone: this.analyzeTone(words, sentences),
      formality: this.analyzeFormality(words),
      readability: this.calculateReadabilityScore(text),
      entityRecognition: this.performEntityRecognition(text),
      keyPhrases: this.extractKeyPhrases(sentences),
      wordFrequency: this.analyzeWordFrequency(words),
      sentenceComplexity: this.analyzeSentenceComplexity(sentences),
    };
  }

  tokenize(text) {
    return text.toLowerCase().match(/\b(\w+)\b/g) || [];
  }

  getSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }

  analyzeSentiment(words) {
    let score = 0;
    words.forEach((word) => {
      score += this.sentimentWords.positive[word] || 0;
      score -= this.sentimentWords.negative[word] || 0;
    });
    return {
      score: score,
      label: score > 0 ? "positive" : score < 0 ? "negative" : "neutral",
    };
  }

  analyzeTone(words, sentences) {
    const toneIndicators = {
      humorous: ["laugh", "funny", "hilarious"],
      serious: ["grave", "important"],
      suspenseful: ["suddenly", "mysterious"],
      romantic: ["love", "passion"],
    };

    const toneScores = Object.keys(toneIndicators).reduce((acc, tone) => {
      acc[tone] = words.filter((word) =>
        toneIndicators[tone].includes(word)
      ).length;
      return acc;
    }, {});

    const dominantTone = Object.entries(toneScores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      scores: toneScores,
      dominant: dominantTone,
    };
  }

  analyzeFormality(words) {
    const formalCount = words.filter((word) =>
      this.formalityIndicators.formal.includes(word)
    ).length;
    const informalCount = words.filter((word) =>
      this.formalityIndicators.informal.includes(word)
    ).length;

    return {
      score: (formalCount - informalCount) / words.length,
      label:
        formalCount > informalCount
          ? "formal"
          : informalCount > formalCount
          ? "informal"
          : "neutral",
    };
  }

  calculateReadabilityScore(text) {
    const words = this.tokenize(text);
    const sentences = this.getSentences(text);
    const syllables = words.reduce(
      (count, word) => count + this.countSyllables(word),
      0
    );

    const fleschKincaid =
      206.835 -
      1.015 * (words.length / sentences.length) -
      84.6 * (syllables / words.length);
    return Math.round(fleschKincaid * 10) / 10;
  }

  countSyllables(word) {
    return word
      .toLowerCase()
      .split(/[^aeiouy]+/)
      .filter(Boolean).length;
  }

  performEntityRecognition(text) {
    const entities = {
      persons: text.match(/[A-Z][a-z]+ (?:[A-Z][a-z]+)*/g) || [],
      locations: (text.match(/(?:in|at|on) [A-Z][a-z]+/g) || []).map(
        (loc) => loc.split(" ")[1]
      ),
      organizations:
        text.match(/[A-Z][a-z]+ (?:Inc\.|Corp\.|LLC|Ltd\.)/g) || [],
    };

    return Object.entries(entities).reduce((acc, [key, value]) => {
      acc[key] = [...new Set(value)];
      return acc;
    }, {});
  }

  extractKeyPhrases(sentences) {
    const phrases = sentences.flatMap((sentence) => {
      const words = sentence.split(/\s+/);
      return words.slice(0, -1).map((_, i) => words.slice(i, i + 3).join(" "));
    });

    return [...new Set(phrases)].slice(0, 5);
  }

  analyzeWordFrequency(words) {
    const frequency = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, [word, count]) => {
        acc[word] = count;
        return acc;
      }, {});
  }

  analyzeSentenceComplexity(sentences) {
    const complexityCounts = sentences.map((sentence) => {
      const words = this.tokenize(sentence);
      const clauseCount = (sentence.match(/,/g) || []).length + 1;
      return {
        wordCount: words.length,
        clauseCount: clauseCount,
      };
    });

    return {
      averageWordsPerSentence:
        complexityCounts.reduce((sum, count) => sum + count.wordCount, 0) /
        sentences.length,
      averageClausesPerSentence:
        complexityCounts.reduce((sum, count) => sum + count.clauseCount, 0) /
        sentences.length,
    };
  }
}
