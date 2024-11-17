"use strict";

export class ModalManager {
  constructor() {
    this.modal = null;
  }

  showModal(title, content) {
    this.removeExistingModal();
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.innerHTML = `
        <div class="modal__content">
          <h2 class="modal__title">${title}</h2>
          <div class="modal__body">${content}</div>
          <button class="modal__close-btn">Close</button>
        </div>
      `;
    document.body.appendChild(this.modal);

    const closeBtn = this.modal.querySelector(".modal__close-btn");
    closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    // Close modal when clicking outside
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    document.body.classList.add("no-scroll");
  }

  removeExistingModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
    document.body.classList.remove("no-scroll");
  }

  closeModal() {
    this.removeExistingModal();
  }
}
