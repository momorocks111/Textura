"use strict";

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
    const tones = ["happy", "sad", "angry", "neutral"];
    const toneIndex = output.indexOf(Math.max(...output));
    const toneSynonyms = {
      happy: ["joyful", "elated", "cheerful"],
      sad: ["gloomy", "melancholy", "sorrowful"],
      angry: ["furious", "enraged", "irritated"],
      neutral: ["indifferent", "impartial", "unbiased"],
    };
    return toneSynonyms[tones[toneIndex]][Math.floor(Math.random() * 3)];
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
