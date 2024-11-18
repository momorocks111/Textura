"use strict";

export class DiffHighlighter {
  highlightDifferences(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    const maxLength = Math.max(words1.length, words2.length);

    const highlightedText1 = [];
    const highlightedText2 = [];

    for (let i = 0; i < maxLength; i++) {
      if (i < words1.length && i < words2.length) {
        if (words1[i].toLowerCase() === words2[i].toLowerCase()) {
          highlightedText1.push(`<span class="same-word">${words1[i]}</span>`);
          highlightedText2.push(`<span class="same-word">${words2[i]}</span>`);
        } else {
          highlightedText1.push(`<span class="diff-word">${words1[i]}</span>`);
          highlightedText2.push(`<span class="diff-word">${words2[i]}</span>`);
        }
      } else if (i < words1.length) {
        highlightedText1.push(`<span class="diff-word">${words1[i]}</span>`);
      } else if (i < words2.length) {
        highlightedText2.push(`<span class="diff-word">${words2[i]}</span>`);
      }
    }

    return {
      text1: highlightedText1.join(" "),
      text2: highlightedText2.join(" "),
    };
  }
}
