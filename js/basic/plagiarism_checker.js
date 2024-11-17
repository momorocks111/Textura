"use strict";

import { wordBank } from "./word_bank.js";

export class PlagiarismChecker {
  constructor() {
    this.wordBank = wordBank;
  }

  checkPlagiarism(text) {
    const words = this.tokenize(text);
    const textFingerprint = this.generateFingerprint(words);
    const similarityScore = this.calculateSimilarity(textFingerprint);
    const academicScore = this.calculateAcademicScore(words);
    const overallScore = this.calculateOverallScore(
      similarityScore,
      academicScore
    );

    return {
      similarityScore,
      academicScore,
      overallScore,
      message: this.generateMessage(overallScore),
    };
  }

  tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }

  generateFingerprint(words) {
    const nGrams = this.generateNGrams(words, 3);
    return nGrams.map((ngram) => this.hash(ngram.join(" ")));
  }

  generateNGrams(words, n) {
    const nGrams = [];
    for (let i = 0; i <= words.length - n; i++) {
      nGrams.push(words.slice(i, i + n));
    }
    return nGrams;
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  calculateSimilarity(fingerprint) {
    // This is going to be simulated
    const simulatedMatchCount = Math.floor(Math.random() * fingerprint.length);
    return (simulatedMatchCount / fingerprint.length) * 100;
  }

  calculateAcademicScore(words) {
    const academicWords = words.filter((word) =>
      this.wordBank.academic.includes(word)
    );
    const casualWords = words.filter((word) =>
      this.wordBank.casual.includes(word)
    );

    const academicRatio = academicWords.length / words.length;
    const casualRatio = casualWords.length / words.length;

    return Math.min(100, Math.max(0, (academicRatio - casualRatio) * 100));
  }

  calculateOverallScore(similarityScore, academicScore) {
    return similarityScore * 0.7 + academicScore * 0.3;
  }

  generateMessage(score) {
    if (score < 20)
      return {
        color: "green",
        text: "Low similarity. Great job on your originality!",
      };

    if (score < 40)
      return {
        color: "lightgreen",
        text: "Moderate similarity. Consider revising some parts.",
      };

    if (score < 60)
      return {
        color: "yellow",
        text: "High similarity. You should rephrase significant portions.",
      };

    if (score < 80)
      return {
        color: "orange",
        text: "Very high similarity. Major revision needed.",
      };

    return {
      color: "red",
      text: "Extremely high similarity. Please rewrite your text.",
    };
  }
}
