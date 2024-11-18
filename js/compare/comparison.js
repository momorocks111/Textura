"use strict";

export class Comparison {
  calculateSimilarityScore(text1, text2) {
    const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
    const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return (intersection.size / union.size) * 100;
  }

  findUniqueWords(text1, text2) {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    return {
      text1: [...words1].filter((word) => !words2.has(word)),
      text2: [...words2].filter((word) => !words1.has(word)),
    };
  }

  findCommonPhrases(text1, text2, minLength = 3) {
    const phrases1 = this.generatePhrases(text1, minLength);
    const phrases2 = this.generatePhrases(text2, minLength);
    return phrases1.filter((phrase) => phrases2.includes(phrase));
  }

  generatePhrases(text, minLength) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const phrases = [];

    for (let i = 0; i <= words.length - minLength; i++) {
      for (let j = 0; j <= Math.min(words.length - i, 6); j++) {
        phrases.push(words.slice(i + j).join(" "));
      }
    }

    return phrases;
  }

  compareReadability(score1, score2) {
    const diff = score1 - score2;

    return {
      difference: diff,
      interpretation:
        diff > 0 ? "Text 1 is more readable" : "Text 2 is more readable",
    };
  }

  compareSentiment(sentiment1, sentiment2) {
    return {
      text1: sentiment1,
      text2: sentiment2,
      difference: sentiment1.score - sentiment2.score,
    };
  }

  compareTopics(topics1, topics2) {
    const array1 = Array.isArray(topics1)
      ? topics1
      : Object.entries(topics1 || {});

    const array2 = Array.isArray(topics2)
      ? topics2
      : Object.entries(topics2 || {});

    const allTopics = new Set([
      ...array1.map((t) => (Array.isArray(t) ? t[0] : t.word)),
      ...array2.map((t) => (Array.isArray(t) ? t[0] : t.word)),
    ]);

    return Array.from(allTopics).map((topic) => {
      const findScore = (arr, topic) => {
        const found = arr.find(
          (t) => (Array.isArray(t) ? t[0] : t.word) === topic
        );

        return found ? (Array.isArray(found) ? found[1] : found.score) : 0;
      };

      return {
        topic,
        text1Score: findScore(array1, topic),
        text2Score: findScore(array2, topic),
      };
    });
  }
}
