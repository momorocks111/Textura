"use strict";

export class WordEmbeddings {
  constructor(dimension = 50, windowSize = 2) {
    this.dimension = dimension;
    this.windowSize = windowSize;
    this.embeddings = {};
  }

  createEmbeddings(text) {
    console.log("Input to createEmbeddings:", text);
    const words = text.toLowerCase().split(/\s+/);
    console.log("Words after splitting:", words.slice(0, 10));

    // Initialize embeddings for all unique words
    const uniqueWords = [...new Set(words)];
    uniqueWords.forEach((word) => {
      if (!this.embeddings[word]) {
        this.embeddings[word] = Array.from(
          { length: this.dimension },
          () => Math.random() - 0.5
        );
      }
    });

    // Train embeddings
    for (let epoch = 0; epoch < 5; epoch++) {
      for (let i = 0; i < words.length; i++) {
        const target = words[i];
        for (
          let j = Math.max(0, i - this.windowSize);
          j <= Math.min(words.length - 1, i + this.windowSize);
          j++
        ) {
          if (i !== j) {
            const context = words[j];
            this.updateEmbedding(target, context);
          }
        }
      }
    }
  }

  updateEmbedding(target, context, learningRate = 0.01) {
    if (!this.embeddings[target] || !this.embeddings[context]) {
      console.warn(
        `Embedding not found for word: ${
          !this.embeddings[target] ? target : context
        }`
      );
      return;
    }

    const targetEmb = this.embeddings[target];
    const contextEmb = this.embeddings[context];

    const dot = targetEmb.reduce((sum, val, i) => sum + val * contextEmb[i], 0);
    const sigmoid = 1 / (1 + Math.exp(-dot));
    const error = sigmoid - 1;

    // Update target embedding
    for (let i = 0; i < this.dimension; i++) {
      targetEmb[i] -= learningRate * error * contextEmb[i];
    }

    // Update context embedding
    for (let i = 0; i < this.dimension; i++) {
      contextEmb[i] -= learningRate * error * targetEmb[i];
    }
  }

  getEmbedding(word) {
    return this.embeddings[word.toLowerCase()] || Array(this.dimension).fill(0);
  }
}
