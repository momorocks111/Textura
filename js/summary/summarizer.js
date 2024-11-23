"use strict";

export class Summarizer {
  constructor(text) {
    this.text = text;
    this.sentences = this.splitIntoSentences(text);
  }

  summarize() {
    const sentenceScores = this.scoreSentences();
    const topSentences = this.getTopSentences(sentenceScores);
    return this.constructSummary(topSentences);
  }

  splitIntoSentences(text) {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  }

  scoreSentences() {
    const wordFrequency = this.calculateWordFrequency();
    return this.sentences.map((sentence) => ({
      sentence,
      score: this.calculateSentenceScore(sentence, wordFrequency),
    }));
  }

  calculateWordFrequency() {
    const words = this.text.toLowerCase().match(/\b\w+\b/g) || [];

    return words.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
  }

  calculateSentenceScore(sentence, wordFrequency) {
    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];

    return (
      words.reduce((score, word) => score + (wordFrequency[word] || 0), 0) /
      words.length
    );
  }

  getTopSentences(sentenceScores) {
    const sortedSentences = sentenceScores.sort((a, b) => b.score - a.score);
    const summaryLength = Math.max(1, Math.ceil(this.sentences.length * 0.3));

    return sortedSentences.slice(0, summaryLength);
  }

  constructSummary(topSentences) {
    return topSentences
      .sort(
        (a, b) =>
          this.sentences.indexOf(a.sentence) -
          this.sentences.indexOf(b.sentence)
      )
      .map((item) => item.sentence)
      .join(" ");
  }
}
