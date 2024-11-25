"use strict";

import { stopWords } from "../archive/stop_words.js";
import { sentimentWords } from "../archive/sentiment_words.js";
import { TfIdfVectorizer } from "./tf_idf_vectorizer.js";
import { KMeansClustering } from "./k_means_clustering.js";

export class ThematicAnalyzer {
  constructor(text) {
    this.text = text;
    this.vectorizer = new TfIdfVectorizer(stopWords);
    this.clustering = new KMeansClustering();
  }

  analyze(minThemes = 3, maxThemes = 10) {
    const sentences = this.splitIntoSentences(this.text);
    const vectorizedSentences = this.vectorizer.fitTransform(sentences);

    let bestThemes = null;
    let bestScore = -Infinity;

    for (let k = minThemes; k <= maxThemes; k++) {
      const clusters = this.clustering.fit(vectorizedSentences, k);
      const themes = this.extractThemes(clusters, sentences);
      const score = this.evaluateThemes(themes);

      if (score > bestScore) {
        bestScore = score;
        bestThemes = themes;
      }
    }

    return {
      themes: this.filterAndRankThemes(bestThemes),
      sentimentScores: this.analyzeSentiment(sentences),
      wordCount: this.text.split(/\s+/).length,
    };
  }

  splitIntoSentences(text) {
    return (
      text.match(/[^.!?]+(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) ||
      []
    );
  }

  extractThemes(clusters, sentences) {
    const uniqueThemes = new Set();
    const clusterMap = new Map();

    clusters.forEach((clusterIndex, sentenceIndex) => {
      if (!clusterMap.has(clusterIndex)) {
        clusterMap.set(clusterIndex, []);
      }
      clusterMap.get(clusterIndex).push(sentenceIndex);
    });

    return Array.from(clusterMap.entries())
      .map(([clusterIndex, sentenceIndices]) => {
        const clusterSentences = sentenceIndices.map((i) => sentences[i]);
        const keywords = this.vectorizer.getTopFeatures(clusterSentences, 5);
        const themeIdentifier = keywords.join(",");

        if (!uniqueThemes.has(themeIdentifier)) {
          uniqueThemes.add(themeIdentifier);
          return {
            id: parseInt(clusterIndex) + 1,
            keywords,
            sentences: this.summarizeSentences(clusterSentences),
            score: this.calculateThemeScore(keywords, clusterSentences),
          };
        }
      })
      .filter((theme) => theme !== undefined)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  summarizeSentences(sentences) {
    if (sentences.length <= 3) return sentences;

    // Select the first, middle, and last sentence
    return [
      sentences[0],
      sentences[Math.floor(sentences.length / 2)],
      sentences[sentences.length - 1],
    ];
  }

  calculateThemeScore(keywords, sentences) {
    const keywordFrequency = keywords.reduce((acc, keyword) => {
      acc[keyword] = sentences.filter((s) =>
        s.toLowerCase().includes(keyword)
      ).length;
      return acc;
    }, {});

    return (
      Object.values(keywordFrequency).reduce((a, b) => a + b, 0) /
      sentences.length
    );
  }

  filterAndRankThemes(themes) {
    return themes
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((theme, index) => ({ ...theme, id: index + 1 }));
  }

  evaluateThemes(themes) {
    const uniqueKeywords = new Set(themes.flatMap((t) => t.keywords));
    const averageSentences =
      themes.reduce((acc, t) => acc + t.sentences.length, 0) / themes.length;
    return uniqueKeywords.size * averageSentences;
  }

  analyzeSentiment(sentences) {
    return sentences.map((sentence) => this.calculateSentimentScore(sentence));
  }

  calculateSentimentScore(sentence) {
    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((score, word) => {
      if (sentimentWords.positive[word]) score += sentimentWords.positive[word];
      if (sentimentWords.negative[word]) score += sentimentWords.negative[word];
      return score;
    }, 0);
  }

  calculateThemeScore(keywords, sentences) {
    const keywordFrequency = keywords.reduce((acc, keyword) => {
      acc[keyword] = sentences.filter((s) =>
        s.toLowerCase().includes(keyword)
      ).length;
      return acc;
    }, {});

    return (
      Object.values(keywordFrequency).reduce((a, b) => a + b, 0) /
      sentences.length
    );
  }
}
