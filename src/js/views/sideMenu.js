class SideMenu {
  _btn = document.querySelector(".fa-bars");
  _menu = document.getElementById("main-nav");
  _categoryList = document.querySelectorAll("#main-nav .category li");
  _watcher = window.matchMedia("(max-width: 1024px)");

  constructor() {
    this._addToggleButton();
    this._addToggleCategoryList();
    this._addWatcher();
  }

  _addToggleButton() {
    this._btn.addEventListener("click", this.toggleSideMenu.bind(this));
  }

  _addWatcher() {
    this._watcher.addEventListener("change", this._onScreenChange.bind(this));
  }

  _addToggleCategoryList() {
    this._categoryList.forEach((li) =>
      li.addEventListener("click", this.toggleCategory.bind(this))
    );
  }

  addHandlerCategory(handler) {
    this._categoryList.forEach(function (li) {
      li.addEventListener("click", function (e) {
        if (!e.target.closest("li")) return;
        handler(e.target.closest("li").dataset.category);
      });
    });
  }

  toggleCategory(e) {
    this._categoryList.forEach((li) => li.classList.remove("selected"));
    e?.target.closest("li").classList.add("selected");
  }

  _hide() {
    this._menu.classList.add("draw");
  }

  _show() {
    this._menu.classList.remove("draw");
  }

  toggleSideMenu() {
    if (this._menu.classList.contains("draw")) this._show();
    else this._hide();
  }

  _onScreenChange(w) {
    // w: MediaQueryListEvent
    if (w.matches) this._hide();
    else this._show();
  }
}

export default new SideMenu();
