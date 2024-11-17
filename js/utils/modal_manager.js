export class ModalManager {
  constructor() {
    this.modal = null;
  }

  showModal(title, content, onAction = null) {
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
    closeBtn.addEventListener("click", () => this.closeModal());

    if (onAction) {
      this.modal
        .querySelector(".modal__body")
        .addEventListener("click", onAction);
    }

    document.body.classList.add("no-scroll");
  }

  closeModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
      document.body.classList.remove("no-scroll");
    }
  }

  removeExistingModal() {
    this.closeModal();
  }
}
