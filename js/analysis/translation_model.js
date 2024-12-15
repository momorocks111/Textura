"use strict";

export class TranslationModel {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.learningRate = 0.1;

    this.weightsIH = this.initializeWeights(inputSize, hiddenSize);
    this.weightsHO = this.initializeWeights(hiddenSize, outputSize);
    this.biasH = new Array(hiddenSize).fill(0);
    this.biasO = new Array(outputSize).fill(0);
  }

  initializeWeights(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() - 0.5)
    );
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  train(input, target) {
    // Forward Pass
    const hidden = this.multiply(input, this.weightsIH).map((sum, i) =>
      this.sigmoid(sum + this.biasH[i])
    );

    const output = this.multiply(hidden, this.weightsHO).map((sum, i) =>
      this.sigmoid(sum + this.biasO[i])
    );

    // Backpropagation
    const outputErrors = target.map((t, i) => t - output[i]);
    const hiddenErrors = this.multiply(
      outputErrors,
      this.transpose(this.weightsHO)
    );

    // Update weights and biases
    this.weightsHO = this.weightsHO.map((row, i) =>
      row.map(
        (weight, j) => weight + this.learningRate * outputErrors[i] * hidden[j]
      )
    );

    this.biasO = this.biasO.map(
      (bias, i) => bias + this.learningRate * outputErrors[i]
    );

    this.weightsIH = this.weightsIH.map((row, i) =>
      row.map(
        (weight, j) => weight + this.learningRate + hiddenErrors[i] * input[j]
      )
    );

    this.biasH = this.biasH.map(
      (bias, i) => bias + this.learningRate * hiddenErrors[i]
    );
  }

  predict(input) {
    const hidden = this.multiply(input, this.weightsIH).map((sum, i) =>
      this.sigmoid(sum + this.biasH[i])
    );

    return this.multiply(hidden, this.weightsHO).map((sum, i) =>
      this.sigmoid(sum + this.biasO[i])
    );
  }

  multiply(a, b) {
    if (!Array.isArray(a[0])) {
      // If 'a' is a 1D array, convert it to a 2D array
      a = [a];
    }
    return a.map((row) =>
      b[0].map((_, i) => row.reduce((sum, val, j) => sum + val * b[j][i], 0))
    );
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  translate(input) {
    // Implement translation logic
    return "Translated text: " + input; // Placeholder
  }
}
