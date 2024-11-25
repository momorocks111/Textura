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

  renderStylometryResults(results) {
    this.container.innerHTML = `
      <div class="stylometry-results">
        <div class="metrics-section">
          <h2 class="metrics-title">Original Text Metrics</h2>
          ${this.renderMetrics(results.original)}
        </div>
        <div class="metrics-section">
          <h2 class="metrics-title">Comparing Text Metrics</h2>
          ${this.renderMetrics(results.comparing)}
        </div>
        <div class="metrics-section">
          <h2 class="metrics-title">Differences</h2>
          ${this.renderMetrics(results.differences)}
        </div>
      <div>
    `;
  }

  /**
   * For Stylometry Analysis
   * @param {any} metrics
   */
  renderMetrics(metrics) {
    return `
      <div class="metrics-list">
        ${Object.entries(metrics)
          .map(
            ([key, value]) => `
          <div class="metric-item">
            <div class="metric-label">${this.formatLabel(key)}</div>
            <div class="metric-value">${this.formatValue(value)}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  formatLabel(key) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  formatValue(value) {
    if (typeof value === "number") {
      return value.toFixed(2);
    } else if (typeof value == "object" && value !== null) {
      if ("score" in value && "label" in value && "magnitude" in value) {
        return `Label: ${value.label}, Score: ${value.score.toFixed(
          2
        )}, Magnitude: ${value.magnitude.toFixed(2)}`;
      } else {
        return JSON.stringify(value);
      }
    } else {
      return value;
    }
  }

  // Comparing Sophistication
  renderSophisticationResults(results) {
    this.container.innerHTML = `
      <div class="sophistication-results">
        <h2>Sophistication Analysis Results</h2>
        <div class="sophistication-container">
          <div class="text-analysis">
            <h3>Original Text</h3>
            ${this.renderTextAnalysis(results.text1)}
          </div>
          <div class="text-analysis">
            <h3>Comparing Text</h3>
            ${this.renderTextAnalysis(results.text2)}
          </div>
          </div>
        <div class="comparison-summary">
          <h3>Comparison Summary</h3>
          ${this.renderComparisonSummary(results.comparison)}
        </div>
      </div>
    `;
  }

  renderTextAnalysis(analysis) {
    return `
      <div class="analysis-item">
        <span>Vocabulary Complexity:</span>
        <div class="progress-bar" style="width: ${
          analysis.vocabularyComplexity
        }%"></div>
      </div>
      <div class="analysis-item">
        <span>Sentence Complexity:</span>
        <div class="progress-bar" style="width: ${
          analysis.sentenceStructure.complexSentenceRatio
        }%"></div>
      </div>
      <div class="analysis-item">
        <span>Grammar Accuracy:</span>
        <div class="progress-bar" style="width: ${
          analysis.grammarAccuracy
        }%"></div>
      </div>
      <div class="analysis-item">
        <span>Idiom Usage:</span>
        <div class="progress-bar" style="width: ${
          analysis.idiomUsage * 10
        }%"></div>
      </div>
      <div class="analysis-item">
        <span>Punctuation Usage:</span>
        <div class="progress-bar" style="width: ${
          analysis.punctuationUsage
        }%"></div>
      </div>
      <div class="analysis-item">
        <span>Overall Sophistication:</span>
        <div class="progress-bar" style="width: ${
          analysis.overallSophistication
        }%"></div>
      </div>
    `;
  }

  renderComparisonSummary(comparison) {
    const getComparisonClass = (value) =>
      value > 0 ? "positive" : value < 0 ? "negative" : "neutral";

    return `
      <div class="comparison-item ${getComparisonClass(
        comparison.vocabularyComplexity
      )}">
        <span>Vocabulary Complexity Difference:</span>
        <span>${comparison.vocabularyComplexity.toFixed(2)}%</span>
      </div>
      <div class="comparison-item ${getComparisonClass(
        comparison.sentenceComplexity
      )}">
        <span>Sentence Complexity Difference:</span>
        <span>${comparison.sentenceComplexity.toFixed(2)}%</span>
      </div>
      <div class="comparison-item ${getComparisonClass(
        comparison.grammarAccuracy
      )}">
        <span>Grammar Accuracy Difference:</span>
        <span>${comparison.grammarAccuracy.toFixed(2)}%</span>
      </div>
      <div class="comparison-item ${getComparisonClass(comparison.idiomUsage)}">
        <span>Idiom Usage Difference:</span>
        <span>${comparison.idiomUsage.toFixed(2)}</span>
      </div>
      <div class="comparison-item ${getComparisonClass(
        comparison.punctuationUsage
      )}">
        <span>Punctuation Usage Difference:</span>
        <span>${comparison.punctuationUsage.toFixed(2)}%</span>
      </div>
      <div class="comparison-item ${getComparisonClass(
        comparison.overallSophistication
      )}">
        <span>Overall Sophistication Difference:</span>
        <span>${comparison.overallSophistication.toFixed(2)}%</span>
      </div>
      <p class="comparison-conclusion">
        ${
          comparison.overallSophistication > 0
            ? "The original text is more sophisticated."
            : comparison.overallSophistication < 0
            ? "The comparing text is more sophisticated."
            : "Both texts have similar levels of sophistication."
        }
      </p>
    `;
  }

  showLoadingAnimation() {
    this.container.innerHTML = '<div class="loading-spinner"></div>';
  }

  hideLoadingAnimation() {
    this.container.innerHTML = "";
  }

  //=======================================
  //============= SUMMARY MODE ============
  //=======================================
  // Summary Mode
  renderSummary(summary) {
    this.container.innerHTML = `
      <div class="summary-result">
        <h2>Summary</h2>
        <div class="summary-content">${summary}</div>
        <button class="copy-button" aria-label="Copy summary">
          <i class="fas fa-clipboard"></i>
        </button>
      </div>
    `;

    this.addCopyFunctionality();
  }

  // Paraphase Feature
  renderParaphrase(paraphrasedText, originalText) {
    this.container.innerHTML = `
      <div class="paraphrase-result">
        <h2>Paraphrased Text</h2>
        <div class="paraphrased-content">${paraphrasedText}</div>
        <h3>Original Text</h3>
        <div class="original-content">${this.highlightDifferences(
          originalText,
          paraphrasedText
        )}
        </div>
      </div>
    `;

    this.addParaphraseCopyFunctionality();
  }

  highlightDifferences(originalText, paraphrasedText) {
    const originalWords = originalText.split(" ");
    const paraphrasedWords = paraphrasedText.split(" ");
    let result = "";

    for (let i = 0; i < originalWords.length; i++) {
      if (originalWords[i] !== paraphrasedWords[i]) {
        result += `<span class="highlighted">${originalWords[i]}</span> `;
      } else {
        result += originalWords[i] + " ";
      }
    }

    return result.trim();
  }

  addCopyFunctionality() {
    const copyButton = this.container.querySelector(".copy-button");
    const summaryContent = this.container.querySelector(".summary-content");

    copyButton.addEventListener("click", () => {
      navigator.clipboard
        .writeText(summaryContent.textContent)
        .then(() => {
          copyButton.classList.add("copied");
          setTimeout(() => copyButton.classList.remove("copied"), 2000);
        })
        .catch((err) => console.error("Failed to copy text: ", err));
    });
  }

  addParaphraseCopyFunctionality() {
    const copyButton = document.createElement("button");
    copyButton.className = "paraphrase-copy-button";
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.setAttribute("aria-label", "Copy paraphrased text");

    const paraphrasedContent = this.container.querySelector(
      ".paraphrased-content"
    );
    paraphrasedContent.parentNode.insertBefore(copyButton, paraphrasedContent);

    copyButton.addEventListener("click", () => {
      navigator.clipboard
        .writeText(paraphrasedContent.textContent)
        .then(() => {
          copyButton.classList.add("copied");
          setTimeout(() => copyButton.classList.remove("copied"), 2000);
        })
        .catch((err) => console.error("Failed to copy text: ", err));
    });
  }

  // Render Thematic Analysis
  renderThematicAnalysis(results) {
    const themeColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

    this.container.innerHTML = `
      <div class="thematic-analysis-results">
        <h2>Thematic Analysis Results</h2>
        <p>Word Count: ${results.wordCount}</p>
        <div class="themes-container">
          ${results.themes
            .map(
              (theme, index) => `
            <div class="theme-bubble" style="background-color: ${
              themeColors[index % themeColors.length]
            }">
              <h3>Theme ${theme.id}</h3>
              <p><strong>Keywords:</strong> ${theme.keywords.join(", ")}</p>
              </br>
              <ul>
                ${theme.sentences
                  .slice(0, 3) // Limit to 3 sentences
                  .map((sentence) => `<li>${sentence}</li>`)
                  .join("")}
              </ul>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="sentiment-chart">
          <h3>Sentiment Analysis</h3>
          ${this.renderSentimentChart(results.sentimentScores)}
        </div>
    </div>
    `;
  }

  renderSentimentChart(sentimentScores) {
    const chartHeight = 200;
    const barWidth = 5;
    const svg = `
      <svg width="${sentimentScores.length * barWidth}" height="${chartHeight}">
        ${sentimentScores
          .map((score, index) => {
            const height = Math.abs(score) * (chartHeight / 2);
            const y = score > 0 ? chartHeight / 2 - height : chartHeight / 2;
            const color = score > 0 ? "#4CAF50" : "#F44336";
            return `<rect x="${
              index * barWidth
            }" y="${y}" width="${barWidth}" height="${height}" fill="${color}" />`;
          })
          .join("")}
          <line x1="0" y1="${chartHeight / 2}" x2="${
      sentimentScores.length * barWidth
    }" y2="${chartHeight / 2}" stroke="black" />
      </svg>
    `;

    return svg;
  }
}
