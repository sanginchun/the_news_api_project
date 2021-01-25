class Content {
  _parentElement = document.querySelector(".contents-container");
  _sentinel = document.querySelector("#scroll-sentinel");

  _generateMarkup(article) {
    const markup = `
      <article class="content">
        <div class="content-text">
          <a href="${article.url}" target="_blank"><h3 class="title">${
      article.title
    }</h3></a>
          <h6 class="source">${article.source}&nbsp;&nbsp;-&nbsp;&nbsp;${
      article.dateFiltered
    }</h6>
          <div class="icons">
            <i class="fa${article.bookmark ? "s" : "r"} fa-bookmark"></i>
            <i class="fas fa-share-alt"></i>
          </div>
          <p class="description">${article.description}</p>
        </div>
        <img src="${article.img}" alt="" class="content-img" />
      </article>`;

    return markup;
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  renderMessage(msg) {
    this.clear();
    const el = document.createElement("h3");
    const node = document.createTextNode(msg);
    el.appendChild(node);
    this._parentElement.insertAdjacentElement("afterbegin", el);
  }

  renderContent(articles, init) {
    // clear if initial load
    if (init) {
      this.clear();
      window.scrollTo(0, 0);
    }

    if (!articles) return;

    // render each article at the end of the container
    articles.forEach((article) =>
      this._parentElement.insertAdjacentHTML(
        "beforeend",
        this._generateMarkup(article)
      )
    );

    // append sentinel
    this._parentElement.appendChild(this._sentinel);
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (!e.target.closest("i")) return;
      e.stopPropagation();
      const url = e.target
        .closest(".content-text")
        .querySelector("a")
        .getAttribute("href");
      handler(e.target, url);
    });
  }

  addHandlerScroll(handler) {
    const observer = new IntersectionObserver(handler, {
      root: null,
      threshold: 0,
    });
    observer.observe(this._sentinel);
  }

  toggleBookmark(i) {
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
}

export default new Content();
