"use strict";

export class SavedResultsManager {
  constructor() {
    this.savedResults = this.loadSavedResults();
  }

  loadSavedResults() {
    return JSON.parse(localStorage.getItem("savedResults")) || [];
  }

  saveResult(text, analysisResults) {
    const savedResult = {
      id: Date.now(),
      text,
      results: analysisResults,
      date: new Date().toLocaleString(),
    };
    this.savedResults.push(savedResult);
    this.persistResults();
    return savedResult;
  }

  getsavedResults() {
    return this.savedResults;
  }

  getResultsById(id) {
    return this.savedResults.find((result) => result.id === id);
  }

  deleteResult(id) {
    this.savedResults = this.savedResults.filter((result) => result.id !== id);
    this.persistResults();
  }

  persistResults() {
    localStorage.setItem("savedResults", JSON.stringify(this.savedResults));
  }
}
