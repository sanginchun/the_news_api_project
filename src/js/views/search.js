class Search {
  _parentElement = document.querySelector(".search-container");

  getQuery() {
    const query = this._parentElement.querySelector(".search-field").value;
    this._clearInput();
    return query.trim();
  }

  _clearInput() {
    this._parentElement.querySelector(".search-field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();
        handler(this.getQuery());
      }.bind(this)
    );
  }
}

export default new Search();
