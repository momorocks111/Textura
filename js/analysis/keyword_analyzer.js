"use strict";

export class KeywordAnalyzer {
  constructor() {
    this.commonWords = new Set([
      "the",
      "and",
      "a",
      "an",
      "in",
      "to",
      "for",
      "of",
      "with",
      "on",
      "is",
      "was",
      "are",
      "were",
      "it",
      "this",
      "that",
      "by",
      "at",
      "as",
      "from",
      "or",
      "but",
      "not",
      "be",
      "have",
      "has",
    ]);
    this.nounEndings = ["tion", "ness", "ity"];
    this.verbEndings = ["ed", "ing", "ize", "ate"];
    this.adjectiveEndings = ["ful", "ous", "ive", "al"];
  }

  analyzeKeywords(text) {
    const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const frequency = {};

    // Count word frequencies while filtering out common words
    words.forEach((word) => {
      if (!this.commonWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    // Calculate scores and determine part of speech
    const totalWords = words.length;
    const keywords = Object.entries(frequency)
      .map(([word, count]) => ({
        word,
        score: Math.round((count / totalWords) * 100),
        pos: this.getPartOfSpeech(word),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    return { keywords, originalText: text };
  }

  getPartOfSpeech(word) {
    if (this.nounEndings.some((ending) => word.endsWith(ending))) return "noun";
    if (this.verbEndings.some((ending) => word.endsWith(ending))) return "verb";
    if (this.adjectiveEndings.some((ending) => word.endsWith(ending)))
      return "adjective";
    return "other";
  }

  suggestRelatedKeywords(keywords) {
    return keywords.map((keyword) => ({
      original: keyword.word,
      related: [
        keyword.word + "s",
        keyword.word + "ing",
        keyword.word + "ed",
        "re" + keyword.word,
        keyword.word + "ly",
      ].filter((w) => w !== keyword.word),
    }));
  }
}
