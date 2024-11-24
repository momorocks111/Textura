"use strict";

export class TfIdfVectorizer {
  constructor(stopWords) {
    this.stopWords = new Set(stopWords);
    this.vocabulary = new Map();
    this.idf = new Map();
  }

  fitTransform(documents) {
    this.fit(documents);
    return this.transform(documents);
  }

  fit(documents) {
    const docFreq = new Map();
    documents.forEach((doc) => {
      const terms = this.tokenize(doc);
      const uniqueTerms = new Set(terms);
      uniqueTerms.forEach((term) => {
        docFreq.set(term, (docFreq.get(term) || 0) + 1);
        if (!this.vocabulary.has(term)) {
          this.vocabulary.set(term, this.vocabulary.size);
        }
      });
    });

    const N = documents.length;
    this.idf = new Map(
      [...docFreq].map(([term, df]) => [term, Math.log(N / df)])
    );
  }

  transform(documents) {
    return documents.map((doc) => {
      const vector = new Array(this.vocabulary.size).fill(0);
      const terms = this.tokenize(doc);
      terms.forEach((term) => {
        if (this.vocabulary.has(term)) {
          const index = this.vocabulary.get(term);
          vector[index] += 1;
        }
      });
      return vector.map(
        (tf, i) => tf * (this.idf.get([...this.vocabulary.keys()][i]) || 0)
      );
    });
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .match(/\b\w+\b/g)
      .filter((word) => !this.stopWords.has(word));
  }

  getTopFeatures(documents, n) {
    const tfidfScores = this.transform(documents);
    const aggregatedScores = tfidfScores.reduce((acc, scores) => {
      scores.forEach((score, i) => (acc[i] = (acc[i] || 0) + score));
      return acc;
    }, []);

    return [...this.vocabulary.entries()]
      .map(([term, index]) => ({ term, score: aggregatedScores[index] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(({ term }) => term);
  }
}
