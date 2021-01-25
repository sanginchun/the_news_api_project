class Pagination {
  _parentElement = document.querySelector("#pagination .page-list");

  _generateMarkup(num) {
    return `<li>${num}</li>`;
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderPagination(total) {
    this._clear();

    for (let i = 0; i < total; i++) {
      this._parentElement.insertAdjacentHTML(
        "beforeend",
        this._generateMarkup(i + 1)
      );
    }
  }

  addHandlerPageClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (!e.target.closest("li")) return;
      handler(+e.target.closest("li").textContent);
    });
  }

  toggleNumber(pageNum) {
    const listEls = this._parentElement.querySelectorAll("li");
    listEls.forEach((el) => el.classList.remove("selected"));
    listEls[+pageNum - 1].classList.add("selected");
  }
}

export default new Pagination();
