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

  renderComparisonResults(comparisonResults) {
    this.container.innerHTML = `
      <div class="textura-comparison-results">
        <h2>Text Comparison Results</h2>
        
        <div class="textura-comparison-section">
          <h3>Similarity Score</h3>
          <div class="textura-similarity-score">${comparisonResults.similarityScore.toFixed(
            2
          )}%</div>
        </div>
        
        <div class="textura-comparison-section">
          <h3>Unique Words</h3>
          <div class="textura-unique-words-container">
            <div class="textura-unique-words-list">
              <h4>Original Text</h4>
              <ul>
                ${comparisonResults.uniqueWords.text1
                  .slice(0, 10)
                  .map((word) => `<li>${word}</li>`)
                  .join("")}
              </ul>
            </div>
            <div class="textura-unique-words-list">
              <h4>Comparing Text</h4>
              <ul>
                ${comparisonResults.uniqueWords.text2
                  .slice(0, 10)
                  .map((word) => `<li>${word}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
        
        <div class="textura-comparison-section">
          <h3>Common Phrases</h3>
          <ul class="textura-common-phrases">
            ${comparisonResults.commonPhrases
              .slice(0, 5)
              .map((phrase) => `<li>${phrase}</li>`)
              .join("")}
          </ul>
        </div>
        
        <div class="textura-comparison-section">
          <h3>Readability Comparison</h3>
          <div class="textura-readability-comparison">
            <p>${comparisonResults.readabilityComparison.interpretation}</p>
            <p>Difference: ${comparisonResults.readabilityComparison.difference.toFixed(
              2
            )}</p>
          </div>
        </div>
        
        <div class="textura-comparison-section">
          <h3>Sentiment Comparison</h3>
          <div class="textura-sentiment-comparison">
            <p>Original Text: <span class="textura-sentiment-label textura-sentiment-${comparisonResults.sentimentComparison.text1.label.toLowerCase()}">${
      comparisonResults.sentimentComparison.text1.label
    }</span> (${comparisonResults.sentimentComparison.text1.score.toFixed(
      2
    )})</p>
            <p>Comparing Text: <span class="textura-sentiment-label textura-sentiment-${comparisonResults.sentimentComparison.text2.label.toLowerCase()}">${
      comparisonResults.sentimentComparison.text2.label
    }</span> (${comparisonResults.sentimentComparison.text2.score.toFixed(
      2
    )})</p>
          </div>
        </div>
        
        <div class="textura-comparison-section">
          <h3>Topic Comparison</h3>
          <ul class="textura-topic-comparison">
            ${comparisonResults.topicComparison
              .slice(0, 5)
              .map(
                (topic) => `
              <li>
                <span class="textura-topic-name">${topic.topic}</span>
                <div class="textura-topic-scores">
                  <span class="textura-topic-score">Original: ${topic.text1Score.toFixed(
                    2
                  )}</span>
                  <span class="textura-topic-score">Comparing: ${topic.text2Score.toFixed(
                    2
                  )}</span>
                </div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
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
