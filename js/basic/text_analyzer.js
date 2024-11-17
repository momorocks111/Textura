"use strict";

import { sentimentLexicon } from "./sentiment_lexicon.js";

export class TextAnalyzer {
  constructor(text) {
    this.text = text;
  }

  analyze() {
    return {
      wordCount: this.countWords(),
      characterCount: this.countCharacters(),
      sentenceCount: this.countSentences(),
      paragraphCount: this.countParagraphs(),
      readingTime: this.calculateReadingTime(),
      averageWordLength: this.calculateAverageWordLength(),
      longestWord: this.findLongestWord(),
      mostFrequentWords: this.findMostFrequentWords(),
      readabilityScore: this.calculateReadabilityScore(),
      sentimentScore: this.analyzeSentiment(),
      topicAnalysis: this.analyzeTopics(),
    };
  }

  countWords() {
    return this.text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  countCharacters() {
    return this.text.length;
  }

  countSentences() {
    return this.text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;
  }

  countParagraphs() {
    return this.text.split(/\n\s*\n/).filter((para) => para.trim().length > 0)
      .length;
  }

  calculateReadingTime() {
    const wordsPerMinute = 200;
    return Math.ceil(this.countWords() / wordsPerMinute);
  }

  calculateAverageWordLength() {
    const words = this.text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return totalLength / words.length;
  }

  findLongestWord() {
    return this.text
      .trim()
      .split(/\s+/)
      .reduce(
        (longest, word) => (word.length > longest.length ? word : longest),
        ""
      );
  }

  findMostFrequentWords(limit = 5) {
    const words = this.text.toLowerCase().match(/\b\w+\b/g);
    const frequency = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  calculateReadabilityScore() {
    const sentences = this.countSentences();
    const words = this.countWords();
    const syllables = this.countSyllables();

    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  }

  countSyllables() {
    // Simplified method
    return (
      this.text
        .toLowerCase()
        .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
        .replace(/^y/, "")
        .match(/[aeiouy]{1,2}/g)?.length || 0
    );
  }

  analyzeSentiment() {
    const words = this.text.toLowerCase().match(/\b\w+\b/g);

    let score = 0;
    let sentenceScore = 0;
    let isNegated = false;
    let intensifierMultiplier = 1;

    const sentences = this.text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);

    sentences.forEach((sentence) => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];

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

          // Consider Context
          const surroundingWords = sentenceWords
            .slice(Math.max(0, index - 2), index)
            .concat(sentenceWords.slice(index + 1, index + 3));

          const contextMultiplier =
            this.calculateContextMultiplier(surroundingWords);

          wordScore *= contextMultiplier;

          sentenceScore += wordScore;
        }
      });

      score += sentenceScore;
      sentenceScore = 0;
    });

    const normalizedScore = score / sentences.length;

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

  analyzeTopics() {
    const words = this.text.toLowerCase().match(/\b\w+\b/g);
    const wordFrequency = {};
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    // Calculate TF-IDF
    const tfidf = Object.entries(wordFrequency).map(([word, frequency]) => {
      const tf = frequency / words.length;
      const idf = Math.log(1 / (frequency / words.length));
      return { word, score: tf * idf };
    });

    return tfidf.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}
