"use strict";

export class StoryElementExtractor {
  constructor(text) {
    this.text = text;
    this.sentences = this.splitIntoSentences(text);
  }

  extractElements() {
    return {
      characters: this.extractCharacters(),
      settings: this.extractSettings(),
      actions: this.extractActions(),
      themes: this.extractThemes(),
    };
  }

  extractCharacters() {
    const characterRegex =
      /\b[A-Z][a-z]+ (?:[A-Z][a-z]+ )?[A-Z][a-z]+\b|\b[A-Z][a-z]+\b/g;

    const potentialCharacters = this.text.match(characterRegex) || [];

    return [...new Set(potentialCharacters)];
  }

  extractSettings() {
    const settingKeywords = ["in", "at", "on", "near", "under", "over"];
    const settings = this.sentences
      .filter((sentence) =>
        settingKeywords.some((keyword) => sentence.includes(keyword))
      )
      .map((sentence) => {
        const match = sentence.match(
          new RegExp(`(${settingKeywords.join("|")})\\s(.+)`)
        );
        return match ? match[2].replace(/\.$/, "") : null;
      })
      .filter(Boolean);
    return [...new Set(settings)];
  }

  extractActions() {
    const actionRegex = /\b[a-z]+ed\b|\b[a-z]+ing\b/g;

    const actions = this.text.match(actionRegex) || [];

    return [...new Set(actions)];
  }

  extractThemes() {
    const commonWords = new Set([
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

    const words = this.text.toLowerCase().match(/\b\w+\b/g) || [];

    const wordFrequency = words.reduce((acc, word) => {
      if (!commonWords.has(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  splitIntoSentences(text) {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  }
}
