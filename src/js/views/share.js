import Modal from "./modal.js";

class Share extends Modal {
  _parentElement = document.querySelector(".contents-container");

  constructor() {
    super();
    this._addHandlerOpenShare();
    this._addHandlerClickURL();
  }

  _generateMarkup(data) {
    const url = data.querySelector("a").getAttribute("href");
    const title = data.querySelector("a h3.title").textContent;
    return `
      <div class="btn btn-close-modal"><i class="fas fa-times"></i></div>
      <div class="modal-header"><h3>기사 공유하기</h3></div>
      <h4 class="share-title">${title}</h4>
      <div class="share-box">
      <input type="text" value="${url}" class="share-url" spellcheck="false">
      <div class="tool-tip">클릭하여 복사</div>
      </div>
      <div class="share-social"></div>
      
      `;
  }

  _addHandlerOpenShare() {
    this._parentElement.addEventListener(
      "click",
      function (e) {
        if (!e.target.closest(".fa-share-alt")) return;
        this._open(e.target.closest(".content-text"));
      }.bind(this)
    );
  }

  _addHandlerClickURL() {
    this._modalWindow.addEventListener("click", function (e) {
      if (!e.target.closest("input.share-url")) return;
      const newEl = document.createElement("input");
      newEl.setAttribute("type", "text");
      newEl.setAttribute("value", e.target.value);
      newEl.classList.add("share-url");
      newEl.setAttribute("spellcheck", "false");
      e.target.select();
      document.execCommand("copy");
      alert("복사되었습니다.");
      e.target.replaceWith(newEl);
    });
  }
}

export default new Share();
