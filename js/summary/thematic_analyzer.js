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

  analyze() {
    const sentences = this.splitIntoSentences(this.text);
    const vectorizedSentences = this.vectorizer.fitTransform(sentences);
    const clusters = this.clustering.fit(vectorizedSentences, 5);

    const themes = this.extractThemes(clusters, sentences);
    const sentimentScores = this.analyzeSentiment(sentences);

    return {
      themes,
      sentimentScores,
      wordCount: this.text.split(/\s+/).length,
    };
  }

  splitIntoSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }

  extractThemes(clusters, sentences) {
    const uniqueThemes = new Set();
    const clusterMap = new Map();

    // Group sentences by cluster
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

        // Create a unique theme identifier based on keywords
        const themeIdentifier = keywords.join(",");

        if (!uniqueThemes.has(themeIdentifier)) {
          uniqueThemes.add(themeIdentifier);
          return {
            id: parseInt(clusterIndex) + 1,
            keywords,
            sentences: clusterSentences,
          };
        }
      })
      .filter((theme) => theme !== undefined); // Filter out undefined themes
  }

  analyzeSentiment(sentences) {
    return sentences.map((sentence) => this.calculateSentimentScore(sentence));
  }

  calculateSentimentScore(sentence) {
    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    let score = 0;

    words.forEach((word) => {
      if (sentimentWords.positive[word]) {
        score += sentimentWords.positive[word];
      } else if (sentimentWords.negative[word]) {
        score += sentimentWords.negative[word];
      }
    });

    return score;
  }
}
