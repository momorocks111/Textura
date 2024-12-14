"use strict";

export class KeywordVisualizer {
  generateWordCloud(keywords) {
    return keywords
      .map(
        (keyword) =>
          `<span class="keyword-cloud__item" style="font-size: ${
            12 + keyword.score
          }px">
            ${keyword.word}
          </span>`
      )
      .join(" ");
  }

  generateScoreBar(score) {
    return `<div class="keyword-bar" style="width: ${score}%; background-color: hsl(${
      120 - score
    }, 70%, 50%);"></div>`;
  }
}
