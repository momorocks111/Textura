"use strict";

export class ResultsRenderer {
  constructor(container) {
    this.container = container;
  }

  render(results) {
    this.container.innerHTML = `
          <h2>Text Analysis Results</h2>
          <div class="result-item">
            <span class="result-label">Word Count:</span>
            <span class="result-value">${results.wordCount}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Character Count:</span>
            <span class="result-value">${results.characterCount}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Sentence Count:</span>
            <span class="result-value">${results.sentenceCount}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Paragraph Count:</span>
            <span class="result-value">${results.paragraphCount}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Reading Time:</span>
            <span class="result-value">${results.readingTime} minute(s)</span>
          </div>
          <div class="result-item">
            <span class="result-label">Average Word Length:</span>
            <span class="result-value">${results.averageWordLength.toFixed(
              2
            )} characters</span>
          </div>
          <div class="result-item">
            <span class="result-label">Longest Word:</span>
            <span class="result-value">${results.longestWord}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Readability Score:</span>
            <span class="result-value">${results.readabilityScore.toFixed(
              2
            )}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Sentiment Score:</span>
            <span class="result-value">${results.sentimentScore}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Most Frequent Words:</span>
            <ul>
              ${results.mostFrequentWords
                .map((item) => `<li>${item.word}: ${item.count}</li>`)
                .join("")}
            </ul>
          </div>
          <div class="result-item">
            <span class="result-label">Top Topics:</span>
            <ul>
              ${results.topicAnalysis
                .map(
                  (item) => `<li>${item.word}: ${item.score.toFixed(4)}</li>`
                )
                .join("")}
            </ul>
          </div>
        `;
  }
}
