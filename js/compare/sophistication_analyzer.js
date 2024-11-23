"use strict";

import { sophisticationLexicon } from "../archive/sophistication_lexicon.js";
import { idioms } from "../archive/idioms.js";
import { grammarRules } from "../archive/grammar_rules.js";

export class SophisticationAnalyzer {
  constructor(text1, text2) {
    this.text1 = text1;
    this.text2 = text2;
  }

  async analyze() {
    const analysis1 = await this.analyzeText(this.text1);
    const analysis2 = await this.analyzeText(this.text2);
    return this.compareAnalysis(analysis1, analysis2);
  }

  async analyzeText(text) {
    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    return {
      vocabularyComplexity: this.analyzeVocabularyComplexity(words),
      sentenceStructure: this.analyzeSentenceStructure(sentences),
      grammarAccuracy: this.analyzeGrammar(text),
      idiomUsage: this.analyzeIdiomUsage(text),
      punctuationUsage: this.analyzePunctuation(text),
      overallSophistication: 0,
    };
  }

  analyzeVocabularyComplexity(words) {
    let complexWords = 0;
    words.forEach((word) => {
      if (sophisticationLexicon.complex.includes(word.toLowerCase())) {
        complexWords++;
      }
    });

    return (complexWords / words.length) * 100;
  }

  analyzeSentenceStructure(sentences) {
    const avgLength =
      sentences.reduce((sum, sentence) => sum + sentence.split(" ").length, 0) /
      sentences.length;

    const complexSentences = sentences.filter(
      (sentence) => sentence.includes(",") || sentence.includes(";")
    ).length;

    return {
      averageLength: avgLength,
      complexSentenceRatio: (complexSentences / sentences.length) * 100,
    };
  }

  analyzeGrammar(text) {
    let errors = 0;

    grammarRules.forEach((rule) => {
      if (rule.regex.test(text)) {
        errors++;
      }
    });
    return (1 - errors / grammarRules.length) * 100;
  }

  analyzeIdiomUsage(text) {
    let idiomCount = 0;
    idioms.forEach((idiom) => {
      if (text.includes(idiom)) {
        idiomCount++;
      }
    });

    return idiomCount / (text.split(" ").length / 100);
  }

  analyzePunctuation(text) {
    const punctuationMarks = text.match(/[.,;:!?]/g) || [];
    return (punctuationMarks.length / text.split(" ").length) * 100;
  }

  compareAnalysis(analysis1, analysis2) {
    const calculateOverallSophistication = (analysis) => {
      return (
        analysis.vocabularyComplexity * 0.3 +
        analysis.sentenceStructure.complexSentenceRatio * 0.2 +
        analysis.grammarAccuracy * 0.2 +
        analysis.idiomUsage * 0.15 +
        analysis.punctuationUsage * 0.15
      );
    };

    analysis1.overallSophistication = calculateOverallSophistication(analysis1);
    analysis2.overallSophistication = calculateOverallSophistication(analysis2);

    return {
      text1: analysis1,
      text2: analysis2,
      comparison: {
        vocabularyComplexity:
          analysis1.vocabularyComplexity - analysis2.vocabularyComplexity,
        sentenceComplexity:
          analysis1.sentenceStructure.complexSentenceRatio -
          analysis2.sentenceStructure.complexSentenceRatio,
        grammarAccuracy: analysis1.grammarAccuracy - analysis2.grammarAccuracy,
        idiomUsage: analysis1.idiomUsage - analysis2.idiomUsage,
        punctuationUsage:
          analysis1.punctuationUsage - analysis2.punctuationUsage,
        overallSophistication:
          analysis1.overallSophistication - analysis2.overallSophistication,
      },
    };
  }
}
