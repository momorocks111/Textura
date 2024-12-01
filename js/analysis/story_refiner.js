"use strict";

import { grammarRules } from "../archive/grammar_rules.js";

export class StoryRefiner {
  constructor() {
    this.grammarRules = grammarRules;
  }

  refineStory(story) {
    let refinedStory = story;

    this.grammarRules.forEach((rule) => {
      refinedStory = this.applyRule(refinedStory, rule);
    });

    return this.finalizeRefinement(refinedStory);
  }

  applyRule(text, rule) {
    return text.replace(rule.regex, (match) => {
      switch (rule.name) {
        case "Double negatives":
          return this.fixDoubleNegative(match);
        case "Subject-verb agreement":
          return this.fixSubjectVerbAgreement(match);
        case "Run-on sentence":
          return this.fixRunOnSentence(match);
        case "Comma splice":
          return this.fixCommaSplice(match);
        case "Passive voice":
          return this.fixPassiveVoice(match);
        case "Redundant phrases":
          return this.fixRedundantPhrase(match);
        case "Misplaced modifier":
          return this.fixMisplacedModifier(match);
        case "Sentence fragment":
          return this.fixSentenceFragment(match);
        default:
          return this.capitalizeAndPunctuate(match);
      }
    });
  }

  fixDoubleNegative(match) {
    return match.replace(/\b(?:not|never)\b/i, "");
  }

  fixSubjectVerbAgreement(match) {
    const [subject, verb] = match.split(/\s+/);
    const correctedVerb = subject.toLowerCase() === "i" ? "am" : "is";
    return `${subject} ${correctedVerb}`;
  }

  fixRunOnSentence(match) {
    return match.replace(/\s+/, ". ");
  }

  fixCommaSplice(match) {
    return match.replace(",", ";");
  }

  fixPassiveVoice(match) {
    // This is a simplified fix and may not work for all cases
    const parts = match.split(/\s+/);
    return `${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}`;
  }

  fixRedundantPhrase(match) {
    const redundantPhrases = {
      "absolutely essential": "essential",
      "advance planning": "planning",
      "basic fundamentals": "fundamentals",
      "close proximity": "near",
      "completely filled": "filled",
      "end result": "result",
      "free gift": "gift",
      "future plans": "plans",
      "past history": "history",
      "revert back": "revert",
      "unexpected surprise": "surprise",
    };
    return redundantPhrases[match.toLowerCase()] || match;
  }

  fixMisplacedModifier(match) {
    const [modifier, ...rest] = match.split(/\s+/);
    return `${rest.join(" ")} ${modifier}`;
  }

  fixSentenceFragment(match) {
    return `It is notable that ${match.toLowerCase()}`;
  }

  capitalizeAndPunctuate(sentence) {
    return (
      sentence.charAt(0).toUpperCase() +
      sentence.slice(1) +
      (sentence.endsWith(".") ? "" : ".")
    );
  }

  finalizeRefinement(story) {
    return story
      .split(". ")
      .map((sentence) => this.capitalizeAndPunctuate(sentence.trim()))
      .join(" ");
  }
}
