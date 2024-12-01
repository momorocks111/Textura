"use strict";

import { sentimentWords } from "../archive/sentiment_words.js";

// export class StoryTextAnalyzer {
//   constructor() {
//     this.sentimentWords = sentimentWords;
//     this.storyGenres = [
//       "romance",
//       "mystery",
//       "adventure",
//       "sci-fi",
//       "fantasy",
//       "horror",
//       "comedy",
//       "drama",
//     ];
//     this.genreKeywords = {
//       romance: ["love", "heart", "passion", "relationship"],
//       mystery: ["detective", "clue", "solve", "secret"],
//       adventure: ["journey", "explore", "quest", "discover"],
//       "sci-fi": ["space", "future", "technology", "alien"],
//       fantasy: ["magic", "dragon", "wizard", "kingdom"],
//       horror: ["fear", "dark", "scary", "monster"],
//       comedy: ["funny", "laugh", "joke", "humor"],
//       drama: ["conflict", "emotional", "intense", "struggle"],
//     };
//   }

//   analyzeText(text) {
//     const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
//     const wordFrequency = {};
//     let sentimentScore = 0;
//     const entities = new Set();
//     const phrases = this.extractPhrases(text);
//     const genreCounts = this.initializeGenreCounts();

//     words.forEach((word) => {
//       wordFrequency[word] = (wordFrequency[word] || 0) + 1;
//       sentimentScore += this.getSentimentScore(word);
//       if (this.isCapitalized(word)) entities.add(word);
//       this.updateGenreCounts(word, genreCounts);
//     });

//     const topWords = Object.entries(wordFrequency)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 10)
//       .map((entry) => entry[0]);

//     const keyPhrases = phrases.sort((a, b) => b.length - a.length).slice(0, 5);

//     return {
//       topWords,
//       sentimentScore,
//       entities: Array.from(entities),
//       keyPhrases,
//       overallSentiment: this.getOverallSentiment(sentimentScore),
//       wordCount: words.length,
//       uniqueWordCount: Object.keys(wordFrequency).length,
//       mostFrequentWord: topWords[0],
//       averageWordLength: this.calculateAverageWordLength(words),
//       readabilityScore: this.calculateReadabilityScore(text),
//       suggestedGenre: this.suggestGenre(genreCounts),
//     };
//   }

//   getSentimentScore(word) {
//     return (
//       this.sentimentWords.positive[word] ||
//       this.sentimentWords.negative[word] ||
//       0
//     );
//   }

//   isCapitalized(word) {
//     return word[0] === word[0].toUpperCase();
//   }

//   extractPhrases(text) {
//     const phrases = [];
//     const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
//     sentences.forEach((sentence) => {
//       const words = sentence.trim().split(/\s+/);
//       for (let i = 0; i < words.length - 1; i++) {
//         phrases.push(words[i] + " " + words[i + 1]);
//         if (i < words.length - 2) {
//           phrases.push(words[i] + " " + words[i + 1] + " " + words[i + 2]);
//         }
//       }
//     });
//     return phrases;
//   }

//   initializeGenreCounts() {
//     return this.storyGenres.reduce(
//       (acc, genre) => ({ ...acc, [genre]: 0 }),
//       {}
//     );
//   }

//   updateGenreCounts(word, genreCounts) {
//     this.storyGenres.forEach((genre) => {
//       if (this.genreKeywords[genre].includes(word)) {
//         genreCounts[genre]++;
//       }
//     });
//   }

//   getOverallSentiment(score) {
//     if (score > 10) return "very positive";
//     if (score > 0) return "positive";
//     if (score < -10) return "very negative";
//     if (score < 0) return "negative";
//     return "neutral";
//   }

//   calculateAverageWordLength(words) {
//     return words.reduce((sum, word) => sum + word.length, 0) / words.length;
//   }

//   calculateReadabilityScore(text) {
//     const sentences = text.split(/[.!?]+/).length;
//     const words = text.split(/\s+/).length;
//     const syllables = this.countSyllables(text);

//     // Using the Flesch-Kincaid readability test
//     return (
//       206.835 -
//       1.015 * (words / sentences) -
//       84.6 * (syllables / words)
//     ).toFixed(2);
//   }

//   countSyllables(text) {
//     // This is a simplified syllable counter
//     return text
//       .toLowerCase()
//       .split(/\s+/)
//       .reduce((count, word) => {
//         return count + (word.match(/[aeiou]/gi) || []).length; // Count vowels as syllables
//       }, 0);
//   }

//   suggestGenre(genreCounts) {
//     return Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0];
//   }
// }

export class StoryTextAnalyzer {
  analyzeText(text) {
    return {
      characters: this.extractCharacters(text),
      mainCharacter: this.extractMainCharacter(text),
      setting: this.extractSetting(text),
      goal: this.extractGoal(text),
      challenges: this.extractChallenges(text),
      emotions: this.analyzeEmotions(text),
      themes: this.extractThemes(text),
    };
  }

  extractCharacters(text) {
    const nameRegex =
      /\b[A-Z][a-z]+ (?:[A-Z][a-z]+ )?[A-Z][a-z]+\b|\b[A-Z][a-z]+\b/g;
    return [...new Set(text.match(nameRegex) || [])];
  }

  extractMainCharacter(text) {
    const characters = this.extractCharacters(text);
    return characters[0] || "The protagonist";
  }

  extractSetting(text) {
    const locationRegex = /\b(?:in|at|on|near) (?:the |a )?([\w\s]+)/i;
    const match = text.match(locationRegex);
    return match ? match[1] : "an unspecified location";
  }

  extractGoal(text) {
    const goalKeywords = ["dream", "goal", "ambition", "aspiration", "aim"];
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (
        goalKeywords.some((keyword) => sentence.toLowerCase().includes(keyword))
      ) {
        return sentence.trim();
      }
    }
    return "an unspecified goal";
  }

  extractChallenges(text) {
    const challengeKeywords = [
      "challenge",
      "problem",
      "difficulty",
      "obstacle",
      "struggle",
      "skepticism",
    ];
    const sentences = text.split(/[.!?]+/);
    return sentences.filter((sentence) =>
      challengeKeywords.some((keyword) =>
        sentence.toLowerCase().includes(keyword)
      )
    );
  }

  analyzeEmotions(text) {
    const emotionKeywords = {
      determination: ["determined", "resolute", "committed"],
      fear: ["afraid", "scared", "fearful"],
      excitement: ["excited", "thrilled", "enthusiastic"],
      doubt: ["doubtful", "uncertain", "hesitant"],
    };

    const emotions = {};
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      emotions[emotion] = keywords.some((keyword) =>
        text.toLowerCase().includes(keyword)
      );
    }
    return emotions;
  }

  extractThemes(text) {
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ]);
    const wordCounts = words.reduce((acc, word) => {
      if (!stopWords.has(word) && word.length > 3) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  }
}
