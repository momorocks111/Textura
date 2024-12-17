"use strict";

import { toneWords } from "../../archive/tone.js";

export class NeuralTextTransformer {
  constructor(textAnalyzer, wordEmbeddings, rnn) {
    this.textAnalyzer = textAnalyzer;
    this.wordEmbeddings = wordEmbeddings;
    this.rnn = rnn;
  }

  transformText(text, transformationType) {
    const sentences = this.textAnalyzer.getSentences(text);
    const transformedSentences = sentences.map((sentence) =>
      this.transformSentence(sentence, transformationType)
    );
    return transformedSentences.join(" ");
  }

  transformSentence(sentence, transformationType) {
    const words = this.textAnalyzer.tokenize(sentence);
    const embeddings = words.map((word) =>
      this.wordEmbeddings.getEmbedding(word)
    );
    const rnnOutput = this.rnn.forward(embeddings);

    const transformedWords = words.map((word, i) =>
      this.transformWord(word, rnnOutput[i], transformationType)
    );

    return transformedWords.join(" ");
  }

  transformWord(word, output, transformationType) {
    switch (transformationType) {
      case "tone":
        return this.changeToneWord(word, output);
      case "sentiment":
        return this.changeSentimentWord(word, output);
      case "formality":
        return this.changeFormalityWord(word, output);
      case "randomize":
        return this.randomizeWord(word);
      default:
        return word;
    }
  }

  changeToneWord(word, output) {
    const tones = Object.keys(toneWords);
    const toneIndex = output.indexOf(Math.max(...output));
    const selectedTone = tones[toneIndex];

    const lowercaseWord = word.toLowerCase();

    // Check if the word is in any of the tone categories
    for (const [tone, words] of Object.entries(toneWords)) {
      if (words.includes(lowercaseWord)) {
        // If it is, replace it with a word from the selected tone
        // But if the current tone is the same as the selected tone, keep the original word
        if (tone === selectedTone) {
          return word;
        }
        const newWord =
          toneWords[selectedTone][
            Math.floor(Math.random() * toneWords[selectedTone].length)
          ];
        // Preserve the original capitalization
        return word[0] === word[0].toUpperCase()
          ? newWord.charAt(0).toUpperCase() + newWord.slice(1)
          : newWord;
      }
    }

    // If the word is not in our tone words, return it unchanged
    return word;
  }

  changeSentimentWord(word, output) {
    const sentiments = ["positive", "negative", "neutral"];
    const sentimentIndex = output.indexOf(Math.max(...output));
    const sentimentSynonyms = {
      positive: ["great", "excellent", "wonderful"],
      negative: ["terrible", "awful", "horrible"],
      neutral: ["okay", "fine", "average"],
    };
    return sentimentSynonyms[sentiments[sentimentIndex]][
      Math.floor(Math.random() * 3)
    ];
  }

  changeFormalityWord(word, output) {
    const formalities = ["formal", "informal"];
    const formalityIndex = output.indexOf(Math.max(...output));
    const formalitySynonyms = {
      formal: ["esteemed", "distinguished", "respected"],
      informal: ["cool", "awesome", "nice"],
    };
    return formalitySynonyms[formalities[formalityIndex]][
      Math.floor(Math.random() * 3)
    ];
  }

  randomizeWord(word) {
    const randomWords = ["banana", "elephant", "symphony", "quantum", "nebula"];
    return randomWords[Math.floor(Math.random() * randomWords.length)];
  }
}
