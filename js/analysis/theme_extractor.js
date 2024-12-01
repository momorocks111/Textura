"use strict";

export class ThemeExtractor {
  constructor() {
    this.stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]);
  }

  extractThemes(textAnalysis) {
    const processedTokens = this.preprocessTokens(textAnalysis.tokens);
    const tfidfScores = this.calculateTFIDF(processedTokens);
    const cooccurrenceMatrix = this.buildCooccurrenceMatrix(processedTokens);
    const topics = this.extractTopics(tfidfScores, cooccurrenceMatrix);
    return this.rankTopics(topics);
  }

  preprocessTokens(tokens) {
    return tokens
      .map((token) => token.toLowerCase())
      .filter((token) => !this.stopWords.has(token) && token.length > 2);
  }

  calculateTFIDF(tokens) {
    const wordFrequency = this.calculateWordFrequency(tokens);
    const idf = this.calculateIDF(wordFrequency, tokens.length);
    return Object.entries(wordFrequency).map(([word, freq]) => ({
      word,
      score: freq * idf[word],
    }));
  }

  calculateWordFrequency(tokens) {
    return tokens.reduce((acc, token) => {
      acc[token] = (acc[token] || 0) + 1;
      return acc;
    }, {});
  }

  calculateIDF(wordFrequency, totalTokens) {
    const idf = {};
    Object.keys(wordFrequency).forEach((word) => {
      idf[word] = Math.log(totalTokens / wordFrequency[word]);
    });
    return idf;
  }

  buildCooccurrenceMatrix(tokens) {
    const matrix = {};
    const windowSize = 5;

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      matrix[word] = matrix[word] || {};

      for (
        let j = Math.max(0, i - windowSize);
        j < Math.min(tokens.length, i + windowSize + 1);
        j++
      ) {
        if (i !== j) {
          const coword = tokens[j];
          matrix[word][coword] = (matrix[word][coword] || 0) + 1;
        }
      }
    }

    return matrix;
  }

  extractTopics(tfidfScores, cooccurrenceMatrix) {
    const topics = [];
    const usedWords = new Set();

    tfidfScores.sort((a, b) => b.score - a.score);

    for (const { word } of tfidfScores) {
      if (!usedWords.has(word)) {
        const relatedWords = this.findRelatedWords(word, cooccurrenceMatrix);
        topics.push({ mainWord: word, relatedWords });
        relatedWords.forEach((w) => usedWords.add(w));
      }

      if (topics.length >= 5) break;
    }

    return topics;
  }

  findRelatedWords(word, cooccurrenceMatrix) {
    const relatedWords = Object.entries(cooccurrenceMatrix[word] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([word]) => word);

    return [word, ...relatedWords];
  }

  rankTopics(topics) {
    return topics
      .map((topic) => ({
        mainTheme: topic.mainWord,
        relatedWords: topic.relatedWords.slice(1),
        score: topic.relatedWords.reduce(
          (sum, word, index) => sum + (5 - index),
          0
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }
}
