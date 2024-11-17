"use strict";

export class TextAnalyzer {
  constructor(text) {
    this.text = text;
  }

  analyze() {
    return {
      wordCount: this.countWords(),
      characterCount: this.countCharacters(),
      sentenceCount: this.countSentences(),
      paragraphCount: this.paragraphCount(),
      readingTime: this.calculateReadingTime(),
      averageWordLength: this.calculateAverageWordLength(),
      longestWord: this.findLongestWord(),
      mostFrequentWord: this.findMostFrequentWords(),
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
    const positiveWords = new Set([
      "good",
      "great",
      "excellent",
      "happy",
      "positive",
    ]);

    const negativeWords = new Set([
      "bad",
      "awful",
      "terrible",
      "sad",
      "negative",
    ]);

    const words = this.text.toLowerCase().match(/\b\w+\b/g);
    let score = 0;
    words.forEach((word) => {
      if (positiveWords.has(word)) score++;
      if (negativeWords.has(word)) score--;
    });
    return score;
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
