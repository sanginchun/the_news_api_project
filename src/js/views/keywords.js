class Keywords {
  _parentElement = document.querySelector(".display-container");
  _list = document.createElement("ul");

  constructor() {
    this._list.classList.add("keywords-list");
  }

  _generateMarkup(keyword, follows) {
    return `
        <li>${keyword}<div class="btn">
        <i class="fa${follows ? "s" : "r"} fa-check-circle"></i>
        </div></li>`;
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  getList() {
    return this._parentElement.querySelector("ul");
  }

  getListItems() {
    return this._list.querySelectorAll("li");
  }

  renderList() {
    this.clear();
    this._list.innerHTML = "";
    this._parentElement.appendChild(this._list);
  }

  updateList(keywords, follows) {
    keywords.forEach((keyword) =>
      this._list.insertAdjacentHTML(
        "afterbegin",
        this._generateMarkup(keyword, follows)
      )
    );
  }

  toggleSelected(text) {
    this.getListItems().forEach(function (li) {
      li.classList.remove("selected");
      if (li.textContent.trim() === text) li.classList.add("selected");
    });
  }

  _toggleCheckButton(i) {
    if (i.classList.contains("fas")) {
      i.classList.remove("fas");
      i.classList.add("far");
      return;
    }
    if (i.classList.contains("far")) {
      i.classList.remove("far");
      i.classList.add("fas");
      return;
    }
  }

  addHandlerKeywordClick(handler) {
    this._list.addEventListener("click", function (e) {
      if (e.target.closest("i") || !e.target.closest("li")) return;
      handler(e.target.closest("li").textContent.trim());
    });
  }

  addHandlerFollow(handler) {
    this._list.addEventListener(
      "click",
      function (e) {
        if (!e.target.closest("i")) return;
        this._toggleCheckButton(e.target);
        handler(e.target.closest("li").textContent.trim());
      }.bind(this)
    );
  }
}

export default new Keywords();
