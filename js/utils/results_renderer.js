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
        <span class="result-value">${results.wordCount || 0}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Character Count:</span>
        <span class="result-value">${results.characterCount || 0}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Sentence Count:</span>
        <span class="result-value">${results.sentenceCount || 0}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Paragraph Count:</span>
        <span class="result-value">${results.paragraphCount || 0}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Reading Time:</span>
        <span class="result-value">${results.readingTime || 0} minute(s)</span>
      </div>
      <div class="result-item">
        <span class="result-label">Average Word Length:</span>
        <span class="result-value">${(results.averageWordLength || 0).toFixed(
          2
        )} characters</span>
      </div>
      <div class="result-item">
        <span class="result-label">Longest Word:</span>
        <span class="result-value">${results.longestWord || "N/A"}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Readability Score:</span>
        <span class="result-value">${(results.readabilityScore || 0).toFixed(
          2
        )}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Sentiment Analysis:</span>
        <div class="sentiment-result">
          <p>Label: <span class="sentiment-label ${this.getSentimentClass(
            results.sentimentScore?.label
          )}">${results.sentimentScore?.label || "N/A"}</span></p>
          <p>Score: <span class="sentiment-score">${
            results.sentimentScore?.score.toFixed(2) || "N/A"
          }</span></p>
          <p>Magnitude: <span class="sentiment-magnitude">${
            results.sentimentScore?.magnitude.toFixed(2) || "N/A"
          }</span></p>
        </div>
      </div>
      <div class="result-item">
        <span class="result-label">Most Frequent Words:</span>
        <ul>
          ${
            results.mostFrequentWords
              ? results.mostFrequentWords
                  .map((item) => `<li>${item.word}: ${item.count}</li>`)
                  .join("")
              : "N/A"
          }
        </ul>
      </div>
      <div class="result-item">
        <span class="result-label">Top Topics:</span>
        <ul>
          ${
            results.topicAnalysis
              ? results.topicAnalysis
                  .map(
                    (item) => `<li>${item.word}: ${item.score.toFixed(4)}</li>`
                  )
                  .join("")
              : "N/A"
          }
        </ul>
      </div>
    `;
  }

  getSentimentClass(label) {
    switch (label) {
      case "Very Positive":
      case "Positive":
        return "positive-sentiment";
      case "Negative":
      case "Very Negative":
        return "negative-sentiment";
      case "Neutral":
      default:
        return "neutral-sentiment";
    }
  }
}
