"use strict";

import { headlineTemplates } from "../archive/headline_templates.js";

export class HeadlineGenerator {
  constructor(text, stopWords, sentimentLexicon) {
    this.text = text;
    this.stopWords = new Set(stopWords);
    this.sentimentWords = sentimentLexicon;
    this.keywords = this.extractKeywords();
    this.sentiment = this.analyzeSentiment();
  }

  extractKeywords() {
    const words = this.text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};

    words.forEach((word) => {
      if (!this.stopWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Increase to top 10 keywords
      .map(([word]) => word);
  }

  analyzeSentiment() {
    const words = this.text.toLowerCase().match(/\b\w+\b/g) || [];
    let sentimentScore = 0;

    words.forEach((word) => {
      if (this.sentimentWords.positive.has(word)) sentimentScore++;
      if (this.sentimentWords.negative.has(word)) sentimentScore--;
    });

    return sentimentScore > 0
      ? "positive"
      : sentimentScore < 0
      ? "negative"
      : "neutral";
  }

  generate() {
    const allHeadlines = [
      ...this.generateQuestionHeadlines(),
      ...this.generateHowToHeadlines(),
      ...this.generateListHeadlines(),
      ...this.generateEmotionalHeadlines(),
    ];

    return this.getRandomSubset(allHeadlines, 5);
  }

  getRandomSubset(array, size) {
    return array.sort(() => 0.5 - Math.random()).slice(0, size);
  }

  getRandomKeywords(count) {
    return this.getRandomSubset(this.keywords, count);
  }

  replaceKeywords(template) {
    const keywordCount = (template.match(/{keyword\d+}/g) || []).length;
    const selectedKeywords = this.getRandomKeywords(keywordCount);

    return template.replace(
      /{keyword(\d+)}/g,
      (_, index) =>
        selectedKeywords[index - 1] ||
        this.keywords[Math.floor(Math.random() * this.keywords.length)]
    );
  }

  generateQuestionHeadlines() {
    return headlineTemplates.questions.map((template) =>
      this.replaceKeywords(template)
    );
  }

  generateHowToHeadlines() {
    return headlineTemplates.howTo.map((template) =>
      this.replaceKeywords(template)
    );
  }

  generateListHeadlines() {
    return headlineTemplates.lists.map((template) => {
      const number = Math.floor(Math.random() * 7) + 3;
      return this.replaceKeywords(template.replace("{number}", number));
    });
  }

  generateEmotionalHeadlines() {
    const templates = headlineTemplates.emotional[this.sentiment];
    return templates.map((template) => this.replaceKeywords(template));
  }
}
