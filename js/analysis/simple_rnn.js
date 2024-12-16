"use strict";

export class SimpleRNN {
  constructor(inputSize, hiddenSize, outputSize) {
    this.Wxh = this.initializeMatrix(inputSize, hiddenSize);
    this.Whh = this.initializeMatrix(hiddenSize, hiddenSize);
    this.Why = this.initializeMatrix(hiddenSize, outputSize);
    this.bh = new Array(hiddenSize).fill(0);
    this.by = new Array(outputSize).fill(0);
  }

  initializeMatrix(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() - 0.5)
    );
  }

  forward(inputs) {
    let h = new Array(this.Whh.length).fill(0);
    const outputs = [];

    for (const x of inputs) {
      h = this.tanh(
        this.add(
          this.multiply(x, this.Wxh),
          this.multiply(h, this.Whh),
          this.bh
        )
      );
      const y = this.add(this.multiply(h, this.Why), this.by);
      outputs.push(y);
    }

    return outputs;
  }

  //   multiply(a, b) {
  //     if (Array.isArray(a) && Array.isArray(b[0])) {
  //       console.log("a", a);
  //       console.log("b", b[0]);
  //       // Matrix multiplication
  //       return a.map((row) => {
  //         console.log(row);
  //         b[0].map((_, i) =>
  //           row.reduce((sum, cell, j) => sum + cell * b[j][i], 0)
  //         );
  //       });
  //     } else if (Array.isArray(a) && Array.isArray(b)) {
  //       // Vector-vector multiplication (dot product)
  //       return a.reduce((sum, val, i) => sum + val * b[i], 0);
  //     } else if (Array.isArray(a) && typeof b === "number") {
  //       // Vector-scalar multiplication
  //       return a.map((val) => val * b);
  //     } else if (typeof a === "number" && Array.isArray(b)) {
  //       // Scalar-vector multiplication
  //       return b.map((val) => a * val);
  //     } else {
  //       // Scalar multiplication
  //       return a * b;
  //     }
  //   }

  multiply(a, b) {
    if (Array.isArray(a) && Array.isArray(b[0])) {
      // Vector-matrix multiplication
      return b[0].map((_, i) =>
        a.reduce((sum, val, j) => sum + val * b[j][i], 0)
      );
    } else if (Array.isArray(a) && Array.isArray(b)) {
      // Vector-vector multiplication (dot product)
      return a.reduce((sum, val, i) => sum + val * b[i], 0);
    } else if (Array.isArray(a) && typeof b === "number") {
      // Vector-scalar multiplication
      return a.map((val) => val * b);
    } else if (typeof a === "number" && Array.isArray(b)) {
      // Scalar-vector multiplication
      return b.map((val) => a * val);
    } else {
      // Scalar multiplication
      return a * b;
    }
  }

  add(...arrays) {
    const length = arrays[0].length;
    return Array.from({ length }, (_, i) =>
      arrays.reduce((sum, arr) => sum + (arr[i] || 0), 0)
    );
  }

  tanh(arr) {
    return arr.map((x) => Math.tanh(x));
  }
}
