"use strict";

export class WordEmbeddings {
  constructor(dimension = 50, windowSize = 2, negSamples = 5) {
    this.dimension = dimension;
    this.windowSize = windowSize;
    this.negSamples = negSamples;
    this.embeddings = {};
    this.wordFrequencies = {};
    this.totalWords = 0;
    this.samplingTable = [];
  }

  createEmbeddings(text) {
    const words = text.toLowerCase().split(/\s+/);
    this.buildVocabulary(words);
    this.initializeEmbeddings();
    this.createSamplingTable();
    this.trainSkipGram(words);
  }

  buildVocabulary(words) {
    words.forEach((word) => {
      if (!this.wordFrequencies[word]) {
        this.wordFrequencies[word] = 0;
      }
      this.wordFrequencies[word]++;
      this.totalWords++;
    });
  }

  initializeEmbeddings() {
    Object.keys(this.wordFrequencies).forEach((word) => {
      this.embeddings[word] = this.randomVector();
    });
  }

  randomVector() {
    return Array.from(
      { length: this.dimension },
      () => (Math.random() - 0.5) / this.dimension
    );
  }

  createSamplingTable() {
    const tableSize = 1e8;
    const powFrequencies = Object.entries(this.wordFrequencies).map(
      ([word, freq]) => [word, Math.pow(freq, 0.75)]
    );
    const totalPowFreq = powFrequencies.reduce(
      (sum, [_, freq]) => sum + freq,
      0
    );

    let i = 0;
    let d1 = powFrequencies[i][1] / totalPowFreq;

    for (let j = 0; j < tableSize; j++) {
      this.samplingTable[j] = powFrequencies[i][0];

      if (j / tableSize > d1) {
        i++;
        d1 += powFrequencies[i][1] / totalPowFreq;
      }

      if (i >= powFrequencies.length) {
        i = powFrequencies.length - 1;
      }
    }
  }

  sampleNegative(target) {
    let negative;

    do {
      negative =
        this.samplingTable[
          Math.floor(Math.random() * this.samplingTable.length)
        ];
    } while (negative === target);
    return negative;
  }

  trainSkipGram(words) {
    const learningRate = 0.025;

    for (let i = 0; i < words.length; i++) {
      for (
        let j = Math.max(0, i - this.windowSize);
        j <= Math.min(words.length - 1, i + this.windowSize);
        j++
      ) {
        if (i === j) continue;

        const target = words[i];
        const context = words[j];

        this.trainPair(target, context, 1, learningRate);

        for (let k = 0; k < this.negSamples; k++) {
          const negative = this.sampleNegative(target);
          this.trainPair(target, negative, 0, learningRate);
        }
      }
    }
  }

  trainPair(target, context, label, learningRate) {
    const targetVector = this.embeddings[target];
    const contextVector = this.embeddings[context];

    const dot = targetVector.reduce(
      (sum, val, i) => sum + val * contextVector[i],
      0
    );
    const sigmoid = 1 / (1 + Math.exp(-dot));
    const gradient = learningRate * (label - sigmoid);

    for (let i = 0; i < this.dimension; i++) {
      targetVector[i] += gradient * contextVector[i];
      contextVector[i] += gradient * targetVector[i];
    }
  }

  getEmbedding(word) {
    return this.embeddings[word.toLowerCase()] || this.randomVector();
  }
}
