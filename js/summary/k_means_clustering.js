"use strict";

export class KMeansClustering {
  fit(data, k, maxIterations = 100) {
    const centroids = this.initializeCentroids(data, k);
    let clusters;
    let iterations = 0;

    while (iterations < maxIterations) {
      clusters = this.assignClusters(data, centroids);
      const newCentroids = this.updateCentroids(data, clusters, k);
      if (this.hasConverged(centroids, newCentroids)) {
        break;
      }

      centroids.splice(0, centroids.length, ...newCentroids);
      iterations++;
    }

    return clusters;
  }

  initializeCentroids(data, k) {
    const centroids = [];
    const used = new Set();

    while (centroids.length < k) {
      const index = Math.floor(Math.random() * data.length);

      if (!used.has(index)) {
        centroids.push(data[index]);
        used.add(index);
      }
    }

    return centroids;
  }

  assignClusters(data, centroids) {
    return data.map((point, index) => {
      const distances = centroids.map((centroid) =>
        this.euclideanDistance(point, centroid)
      );
      return distances.indexOf(Math.min(...distances));
    });
  }

  updateCentroids(data, clusters, k) {
    const newCentroids = [];

    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, index) => clusters[index] === i);

      if (clusterPoints.length > 0) {
        newCentroids.push(this.calculateMean(clusterPoints));
      } else {
        newCentroids.push(data[Math.floor(Math.random() * data.length)]);
      }
    }

    return newCentroids;
  }

  euclideanDistance(a, b) {
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
  }

  calculateMean(points) {
    const sum = points.reduce(
      (acc, point) => acc.map((val, i) => val + point[i]),
      new Array(points[0].length).fill(0)
    );
    return sum.map((val) => val / points.length);
  }

  hasConverged(oldCentroids, newCentroids) {
    return oldCentroids.every(
      (centroid, i) => this.euclideanDistance(centroid, newCentroids[i]) < 0.001
    );
  }
}
