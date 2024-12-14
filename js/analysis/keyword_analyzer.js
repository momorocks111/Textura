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
    ]);
  }

  analyzeKeywords(text) {
    const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const frequency = {};

    words.forEach((word) => {
      if (!this.commonWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({
        word,
        score: Math.round((count / words.length) * 100),
        pos: this.getPartOfSpeech(word),
      }));

    return {
      keywords,
      originalText: text,
    };
  }

  getPartOfSpeech(word) {
    const nounEndings = ["tion", "ness", "ity"];
    const verbEndings = ["ed", "ing", "ize", "ate"];
    const adjectiveEndigns = ["full", "ous", "ive", "al"];

    if (nounEndings.some((ending) => word.endsWith(ending))) return "noun";
    if (verbEndings.some((ending) => word.endsWith(ending))) return "verb";
    if (adjectiveEndigns.some((ending) => word.endsWith(ending)))
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
      ].filter((w) => w !== keyword.word),
    }));
  }
}
