import Modal from "./modal.js";

class Settings extends Modal {
  _parentElement = document.querySelector(".settings");

  constructor() {
    super();
    this._addHandlerOpenModal();
    this._addHandlerSendMessage();
    this._renderConfirmMessage();
  }

  _generateMarkup(menu) {
    if (menu === "의견 보내기") {
      return `
      <div class="btn btn-close-modal"><i class="fas fa-times"></i></div>
      <div class="modal-header"><h3>의견 보내기</h3></div>
      <form>
        <textarea></textarea>
        <div class="btn btn-send-message">완료</div>
      </form>`;
    }

    if (menu === "다크 모드") {
      const isDark = document.querySelector("body").classList.contains("dark");
      return `
      <div class="btn btn-close-modal"><i class="fas fa-times"></i></div>
      <div class="modal-header"><h3>다크 모드</h3></div>
      <div class="icon-box">
        <i class="fa${isDark ? "s" : "r"} fa-lightbulb fa-5x"></i>
        <h2>${isDark ? "ON" : "OFF"}</h2>
      </div>`;
    }

    if (menu === "도움말") {
      return `
      <div class="btn btn-close-modal"><i class="fas fa-times"></i></div>
      <div class="modal-header"><h3>도움말</h3></div>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque, dolor vero. Pariatur ut mollitia autem, minima voluptates commodi veritatis iste.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque, dolor vero. Pariatur ut mollitia autem, minima voluptates commodi veritatis iste.</p>
      `;
    }
  }

  _addHandlerOpenModal() {
    this._parentElement.querySelectorAll("li").forEach((li) =>
      li.addEventListener(
        "click",
        function (e) {
          if (!e.target.closest("li")) return;
          this._open(e.target.textContent);
        }.bind(this)
      )
    );
  }

  _addHandlerSendMessage() {
    this._modalWindow.addEventListener(
      "click",
      function (e) {
        if (!e.target.closest(".btn-send-message")) return;

        console.log(e.target.closest("form").querySelector("textarea").value);
        this._renderConfirmMessage();
      }.bind(this)
    );
  }

  _renderConfirmMessage() {
    const markup = `
    <div class="btn btn-close-modal"><i class="fas fa-times"></i></div>
    <div class="modal-header"><h3>의견 보내기</h3></div>
    <p>감사합니다.</p>`;
    this._modalWindow.innerHTML = markup;
  }

  toggleDarkModeSwitch() {
    const button = this._modalWindow.querySelector(".icon-box i");
    const text = this._modalWindow.querySelector(".icon-box h2");

    if (text.textContent === "ON") {
      text.textContent = "OFF";
      button.classList.replace("fas", "far");
      document.querySelector("body").classList.remove("dark");
      return;
    }

    if (text.textContent === "OFF") {
      text.textContent = "ON";
      button.classList.replace("far", "fas");
      document.querySelector("body").classList.add("dark");
      return;
    }
  }

  addHandlerDarkMode(handler) {
    this._modalWindow.addEventListener("click", function (e) {
      if (!e.target.closest(".fa-lightbulb")) return;
      handler();
    });
  }
}

export default new Settings();
