"use strict";

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
    return [
      ...this.generateQuestionHeadlines(),
      ...this.generateHowToHeadlines(),
      ...this.generateListHeadlines(),
      ...this.generateEmotionalHeadlines(),
    ];
  }

  generateQuestionHeadlines() {
    const questions = [
      `Why is ${this.keywords[0]} the talk of the town?`,
      `How does ${this.keywords[0]} impact ${this.keywords[1]}?`,
      `What's the secret behind ${this.keywords[0]}?`,
    ];
    return questions;
  }

  generateHowToHeadlines() {
    return [
      `How to Master ${this.keywords[0]} and Boost Your ${this.keywords[1]}`,
    ];
  }

  generateListHeadlines() {
    const number = Math.floor(Math.random() * 7) + 3;
    return [
      `${number} Surprising Facts About ${this.keywords[0]} You Didn't Know`,
    ];
  }

  generateEmotionalHeadlines() {
    const emotionalWords = {
      positive: ["Amazing", "Incredible", "Inspiring"],
      negative: ["Shocking", "Alarming", "Controversial"],
      neutral: ["Unexpected", "Intriguing", "Thought-Provoking"],
    };

    const emotion =
      emotionalWords[this.sentiment][
        Math.floor(Math.random() * emotionalWords[this.sentiment].length)
      ];
    return [
      `The ${emotion} Truth About ${this.keywords[0]} and ${this.keywords[1]}`,
    ];
  }
}
