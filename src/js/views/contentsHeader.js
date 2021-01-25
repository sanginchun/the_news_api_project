class ContentsHeader {
  _parentElement = document.querySelector(".display-container");
  _headerEl = document.createElement("h2");

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderHeader(text) {
    this._headerEl.textContent = text;
    this._parentElement.appendChild(this._headerEl);
  }
}

export default new ContentsHeader();
