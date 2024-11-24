"use strict";

import { synonyms } from "../archive/synonyms.js";
import { sentenceStructures } from "../archive/sentence_structures.js";

export class Paraphraser {
  constructor(text) {
    this.text = text;
    this.sentences = this.splitIntoSentences(text);
  }

  paraphrase() {}

  splitIntoSentences(text) {
    return text.match(/[^.!?]+[.!?]+/g);
  }
}
