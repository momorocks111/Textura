"use strict";

export class AnimationManager {
  showSavingAnamation() {
    return new Promise((resolve) => {
      const animationContainer = document.createElement("div");
      animationContainer.className = "saving-animation";
      animationContainer.innerHTML = `
                <div class="saving-card">
                    <h3>Saving Analysis</h3>
                    <div class="progress-bar"></div>
                </div>
            `;

      document.body.appendChild(animationContainer);

      setTimeout(() => {
        animationContainer.classList.add("saved");
        setTimeout(() => {
          document.body.removeChild(animationContainer);
          resolve();
        }, 1000);
      }, 1500);
    });
  }

  showLoadingAnimation() {
    return new Promise((resolve) => {
      const animationContainer = document.createElement("div");
      animationContainer.className = "loading-animation";
      animationContainer.innerHTML = `
            <div class="loading-card">
                <h3>Loading Saved Results</h3>
                <div class="spinner"></div>
            </div>
        `;

      document.body.appendChild(animationContainer);

      setTimeout(() => {
        document.body.removeChild(animationContainer);
        resolve();
      }, 1500);
    });
  }
}
