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
      .slice(0, 5)
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

    // Shuffle and select five random headlines
    return this.getRandomSubset(allHeadlines, 5);
  }

  getRandomSubset(array, size) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  }

  generateQuestionHeadlines() {
    return headlineTemplates.questions.map((template) =>
      template
        .replace("{keyword1}", this.keywords[0])
        .replace("{keyword2}", this.keywords[1])
    );
  }

  generateHowToHeadlines() {
    return headlineTemplates.howTo.map((template) =>
      template
        .replace("{keyword1}", this.keywords[0])
        .replace("{keyword2}", this.keywords[1])
    );
  }

  generateListHeadlines() {
    const number = Math.floor(Math.random() * 7) + 3;
    return headlineTemplates.lists.map((template) =>
      template
        .replace("{number}", number)
        .replace("{keyword1}", this.keywords[0])
        .replace("{keyword2}", this.keywords[1])
    );
  }

  generateEmotionalHeadlines() {
    const templates = headlineTemplates.emotional[this.sentiment];
    return templates.map((template) =>
      template
        .replace("{keyword1}", this.keywords[0])
        .replace("{keyword2}", this.keywords[1])
    );
  }
}
