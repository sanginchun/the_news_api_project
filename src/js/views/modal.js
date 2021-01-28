export default class Modal {
  _modalWindow = document.querySelector(".modal-window");
  _overlay = document.querySelector(".overlay");

  constructor() {
    this._addHandlerCloseModal();
  }

  _open(data) {
    this._modalWindow.innerHTML = this._generateMarkup(data);

    this._overlay.classList.remove("hidden");
    // this._modalWindow.classList.remove("hidden");
    this._modalWindow.classList.add("modal-open");
    this._modalWindow.classList.remove("modal-closed");
  }

  _close() {
    this._overlay.classList.add("hidden");
    // this._modalWindow.classList.add("hidden");
    this._modalWindow.classList.add("modal-closed");
    this._modalWindow.classList.remove("modal-open");
  }

  _addHandlerCloseModal() {
    // close by overlay click
    this._overlay.addEventListener("click", this._close.bind(this));

    // close by X button click
    this._modalWindow.addEventListener(
      "click",
      function (e) {
        if (!e.target.closest(".btn-close-modal")) return;

        this._close();
      }.bind(this)
    );

    // close by ESC
    document.addEventListener(
      "keydown",
      function (e) {
        if (
          e.key === "Escape" &&
          !this._modalWindow.classList.contains("hidden")
        )
          this._close();
      }.bind(this)
    );
  }
}
