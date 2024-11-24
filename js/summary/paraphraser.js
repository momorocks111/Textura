"use strict";

import { synonyms } from "../archive/synonyms.js";
import { sentenceStructures } from "../archive/sentence_structures.js";
import { idioms } from "../archive/idioms.js";
import { entityTypes, patterns } from "../archive/entity_patterns.js";
import { grammarRules } from "../archive/grammar_rules.js";

export class Paraphraser {
  constructor(text) {
    this.text = text;
    this.sentences = this.splitIntoSentences(text);
    this.namedEntities = this.extractNamedEntities(text);
  }

  paraphrase() {
    return this.sentences
      .map((sentence) => this.paraphraseSentence(sentence))
      .join(" ");
  }

  splitIntoSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g) || [];
  }

  extractNamedEntities(text) {
    let entities = {};

    // Extract Entities using regular expressions
    for (let type of entityTypes) {
      entities[type] = (text.match(patterns[type]) || []).filter(Boolean);
    }

    // Additional processing for better accuracy
    const words = text.split(/\s+/);
    const capitalizedWords = words.filter((word) => /^[A-Z][a-z]+$/.test(word));

    // Check for consecutive capitalized words not caught by other patterns
    for (let i = 0; i < capitalizedWords.length - 1; i++) {
      const potentialEntity = capitalizedWords.slice(i, i + 2).join(" ");
      if (!Object.values(entities).flat().includes(potentialEntity)) {
        entities.Person = entities.Person || [];
        entities.Person.push(potentialEntity);
      }
    }

    // Remove Duplicates
    for (let type in entities) {
      entities[type] = [...new Set(entities[type])];
    }

    // Flatten the result
    return Object.values(entities).flat();
  }

  paraphraseSentence(sentence) {
    sentence = this.handleIdioms(sentence);
    let paraphrased = this.replaceSynonyms(sentence);
    paraphrased = this.alterSentenceStructure(paraphrased);
    paraphrased = this.contextAwareRephrase(paraphrased);
    paraphrased = this.preserveNamedEntities(paraphrased);
    return this.ensureGrammaticalCorrectness(paraphrased);
  }

  handleIdioms(sentence) {
    for (let [idiom, replacement] of Object.entries(idioms)) {
      if (sentence.includes(idiom)) {
        sentence = sentence.replace(idiom, replacement);
      }
    }
    return sentence;
  }

  replaceSynonyms(sentence) {
    return sentence.replace(/\b\w+\b/g, (word) => {
      if (this.isNamedEntity(word)) return word;
      const synonym = this.getSynonym(word, sentence);
      return synonym || word;
    });
  }

  isNamedEntity(word) {
    return (
      this.namedEntities &&
      this.namedEntities.some((entity) => entity.includes(word))
    );
  }

  getSynonym(word, context) {
    const synonymList = synonyms[word.toLowerCase()];
    if (!synonymList || synonymList.length === 0) return null;

    const contextWords = context
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);
    const wordFrequency = this.getWordFrequency(contextWords);

    const scoredSynonyms = synonymList.map((syn) => ({
      word: syn,
      score: this.calculateSynonymScore(syn, word, contextWords, wordFrequency),
    }));

    scoredSynonyms.sort((a, b) => b.score - a.score);
    return scoredSynonyms[0].word;
  }

  calculateSynonymScore(synonym, originalWord, contextWords, wordFrequency) {
    let score = 0;

    // Context similarity
    score += this.getContextSimilarity(synonym, contextWords, wordFrequency);

    // Length similarity
    score +=
      1 -
      Math.abs(synonym.length - originalWord.length) /
        Math.max(synonym.length, originalWord.length);

    // Character overlap
    score += this.getCharacterOverlap(synonym, originalWord);

    // Levenshtein distance (simplified)
    score +=
      1 -
      this.levenshteinDistance(synonym, originalWord) /
        Math.max(synonym.length, originalWord.length);

    return score;
  }

  getContextSimilarity(synonym, contextWords, wordFrequency) {
    return (
      contextWords.reduce((score, contextWord) => {
        if (synonym.includes(contextWord)) {
          score += wordFrequency[contextWord] || 1;
        }
        return score;
      }, 0) / contextWords.length
    );
  }

  getCharacterOverlap(word1, word2) {
    const set1 = new Set(word1.toLowerCase());
    const set2 = new Set(word2.toLowerCase());
    const intersection = new Set([...set1].filter((char) => set2.has(char)));
    return intersection.size / Math.max(set1.size, set2.size);
  }

  levenshteinDistance(word1, word2) {
    const m = word1.length,
      n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      }
    }

    return dp[m][n];
  }

  getWordFrequency(words) {
    return words.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {});
  }

  alterSentenceStructure(sentence) {
    const structure =
      sentenceStructures[Math.floor(Math.random() * sentenceStructures.length)];
    return structure.replace("{sentence}", sentence);
  }

  contextAwareRephrase(sentence) {
    const words = sentence.split(" ");
    const posTagged = this.posTag(words);
    const dependencies = this.getDependencies(posTagged);

    let rephrased = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const pos = posTagged[i][1];
      const dependents = dependencies.filter((dep) => dep.head === i);

      if (pos.startsWith("VB")) {
        rephrased += this.rephraseVerb(word, pos, dependents) + " ";
      } else if (pos.startsWith("JJ")) {
        rephrased += this.rephraseAdjective(word, pos, dependents) + " ";
      } else if (pos.startsWith("RB")) {
        rephrased += this.rephraseAdverb(word, pos, dependents) + " ";
      } else {
        rephrased += word + " ";
      }
    }

    return rephrased.trim();
  }

  posTag(words) {
    return words.map((word) => [word, this.getDetailedPOS(word)]);
  }

  getDetailedPOS(word) {
    if (word.endsWith("ly")) return "RB";
    if (word.endsWith("ed")) return "VBD";
    if (word.endsWith("ing")) return "VBG";
    if (word.endsWith("s")) return "NNS";
    if (word.endsWith("er") || word.endsWith("est")) return "JJR";
    if (["am", "is", "are", "was", "were"].includes(word)) return "VBZ";
    return "NN";
  }

  getDependencies(posTagged) {
    const dependencies = [];
    for (let i = 0; i < posTagged.length; i++) {
      if (posTagged[i][1].startsWith("VB")) {
        for (let j = 0; j < posTagged.length; j++) {
          if (i !== j) {
            if (posTagged[j][1].startsWith("NN")) {
              dependencies.push({ head: i, dependent: j, relation: "obj" });
            } else if (
              posTagged[j][1].startsWith("JJ") ||
              posTagged[j][1].startsWith("RB")
            ) {
              dependencies.push({ head: i, dependent: j, relation: "mod" });
            }
          }
        }
      }
    }

    return dependencies;
  }

  rephraseVerb(verb, pos, dependents) {
    const synonym = this.getSynonym(
      verb,
      dependents.map((d) => d.word).join(" ")
    );

    if (synonym) {
      return this.conjugateVerb(synonym, pos);
    }

    return verb;
  }

  conjugateVerb(verb, pos) {
    if (pos === "VBD") return verb + "ed";
    if (pos === "VBG") return verb + "ing";
    if (pos === "VBZ") return verb + "s";
    return verb;
  }

  rephraseAdjective(adjective, pos, dependents) {
    const synonym = this.getSynonym(
      adjective,
      dependents.map((d) => d.word).join(" ")
    );

    if (synonym) {
      return this.adjustAdjective(synonym, pos);
    }

    return adjective;
  }

  adjustAdjective(adjective, pos) {
    if (pos === "JJR") return adjective + "er";
    if (pos === "JJS") return adjective + "est";

    return adjective;
  }

  rephraseAdverb(adverb, pos, dependents) {
    const synonym = this.getSynonym(
      adverb,
      dependents.map((d) => d.word).join(" ")
    );

    return synonym || adverb;
  }

  preserveNamedEntities(sentence) {
    this.namedEntities.forEach((entity) => {
      const regex = new RegExp(`\\b${entity}\\b`, "g");
      sentence = sentence.replace(regex, entity);
    });

    return sentence;
  }

  ensureGrammaticalCorrectness(sentence) {
    // Basic corrections
    sentence = sentence.replace(
      /\b(a|an)\s+(\w+)/gi,
      (match, article, word) => {
        return (/^[aeiou]/i.test(word) ? "an " : "a ") + word;
      }
    );
    sentence = sentence.replace(/\s+/g, " ").trim();
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    // Apply grammar rules
    grammarRules.forEach((rule) => {
      if (rule.regex.test(sentence)) {
        console.warn(`Grammar issue detected: ${rule.name}`);
        // Here you can implement specific corrections for each rule
        // For demonstration, we'll just log the issue
      }
    });

    // Ensure proper spacing after punctuation
    sentence = sentence.replace(/([.,!?])(\w)/g, "$1 $2");

    // Ensure sentence ends with proper punctuation
    if (!/[.!?]$/.test(sentence)) {
      sentence += ".";
    }

    return sentence;
  }
}
