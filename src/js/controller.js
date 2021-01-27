import * as model from "./model.js";
import sideMenu from "./views/sideMenu.js";
import contents from "./views/contents.js";
import contentsHeader from "./views/contentsHeader.js";
import search from "./views/search.js";
import keywords from "./views/keywords.js";
import pagination from "./views/pagination.js";
import share from "./views/share.js";
import settings from "./views/settings.js";
import {
  INIT_CONTENT_NUM,
  MAX_PAGE,
  RENDER_ON_SCROLL_NUM,
  CONTENT_PER_PAGE,
  CATEGORY_KOR,
} from "./config.js";

// import "core-js/stable";
// import "regenerator-runtime/runtime";

const controlLoadCategory = async function (category, pageNum = 1) {
  try {
    model.state.category = category;
    model.state.currentPage = pageNum;
    model.state.keyword = "";

    if (category === "follows") {
      loadFollow();
      return;
    }
    if (category === "bookmarks") {
      loadBookmarks(pageNum);
      return;
    }

    // Rest Categories: [general, business, entertainment, sports, health, science, technology]
    // render header
    contentsHeader.clear();
    contentsHeader.renderHeader(CATEGORY_KOR[category]);

    // get data
    const [data, totalResults] = await model.getNewsByCategory(
      category,
      model.state.currentPage
    );

    // parse data & update state
    model.createArticlesObject(data);

    // if no articles to display
    if (!model.state.articles.length) {
      contents.renderMessage("해당 카테고리에 기사가 없습니다.");
      return;
    }

    // render articles
    contents.renderContent(
      model.state.articles.slice(0, INIT_CONTENT_NUM),
      true
    );

    // render pagination & toggle current
    loadPagination(model.state.currentPage, totalResults);

    // update state
    model.state.nextArticleIndex = INIT_CONTENT_NUM;
  } catch (err) {
    console.log(err);
  }
};

const loadFollow = function () {
  // clear header, contents, pagination
  contentsHeader.clear();
  contents.clear();
  loadPagination(0);

  // update state
  model.state.articles = [];

  if (!model.state.follows.length)
    contentsHeader.renderHeader("팔로우 중인 키워드가 없습니다.");
  else {
    // if has follow list
    keywords.renderList();
    keywords.updateList(model.state.follows, true);

    // load articles of most recently followed keyword
    model.state.keyword = model.state.follows[model.state.follows.length - 1];
    controlLoadKeyword(model.state.keyword);
  }
};

const loadBookmarks = function (pageNum) {
  // clear keywords list
  contentsHeader.clear();
  contents.clear();

  // no bookmarks
  if (!model.state.bookmarks.length) {
    // render header
    contentsHeader.renderHeader("저장한 기사가 없습니다.");

    // clear pagination
    loadPagination(0);

    // update state
    model.state.articles = [];
    return;
  }

  // has bookmarks
  // order bookmarks, set dateFiltered
  model.orderBookmarks();

  // update state
  model.state.articles = model.state.bookmarks;

  // render articles
  contents.renderContent(
    model.state.articles.slice(
      (pageNum - 1) * CONTENT_PER_PAGE,
      (pageNum - 1) * CONTENT_PER_PAGE + INIT_CONTENT_NUM
    ),
    true
  );

  // render pagination
  loadPagination(pageNum, model.state.articles.length);

  // update state
  model.state.nextArticleIndex =
    (pageNum - 1) * CONTENT_PER_PAGE + INIT_CONTENT_NUM;
};

const controlLoadKeyword = async function (query, pageNum = 1) {
  if (!query) return;

  model.state.category = "";
  model.state.keyword = query;
  model.state.currentPage = pageNum;

  // remove category selected
  sideMenu.toggleCategory();

  // if list doesn't exists
  if (!keywords.getList()) {
    contentsHeader.clear();
    keywords.renderList();
  }

  // update keyword list
  const isFollow = model.state.follows.includes(query);

  if (
    ![...keywords.getListItems()]
      .map((el) => el.textContent.trim())
      .includes(query)
  ) {
    keywords.updateList([query], isFollow);
  }
  keywords.toggleSelected(query);

  // get data from model
  const [data, totalResults] = await model.getNewsByKeyword(
    query,
    model.state.currentPage
  );

  // parse data & update state
  model.createArticlesObject(data);

  // if no articles to display
  if (!model.state.articles.length) {
    contents.renderMessage(
      "해당 키워드의 기사가 없습니다. 다른 키워드로 검색하세요."
    );
    loadPagination(0);
    return;
  }

  // render articles
  contents.renderContent(model.state.articles.slice(0, INIT_CONTENT_NUM), true);

  // render pagination & toggle current
  loadPagination(model.state.currentPage, totalResults);

  // update state
  model.state.nextArticleIndex = INIT_CONTENT_NUM;
};

const loadPagination = function (current, total) {
  if (!current) {
    pagination.renderPagination(0);
    return;
  }

  // render pagination & toggle current
  pagination.renderPagination(
    Math.min(Math.ceil(total / CONTENT_PER_PAGE), MAX_PAGE)
  );
  pagination.toggleNumber(current);
};

const controlInfiniteScroll = function (entries) {
  const [entry] = entries;

  // guard clause
  if (!entry.isIntersecting) return;

  // get article index to render
  const start = model.state.nextArticleIndex;

  // render
  contents.renderContent(
    model.state.articles.slice(start, start + RENDER_ON_SCROLL_NUM),
    false
  );

  // update state
  model.state.nextArticleIndex = start + RENDER_ON_SCROLL_NUM;
};

const controlFollow = function (keyword) {
  if (!keyword) return;

  model.editFollow(keyword);
};

const controlContentButtonClick = function (btn, url) {
  const btnType = btn.classList.contains("fa-bookmark") ? "bookmark" : "share";

  if (btnType === "bookmark") {
    // toggle the button
    contents.toggleBookmark(btn);

    // bookmark / unbookmark
    model.editBookmark(url);

    return;
  }

  if (btnType === "share") {
    // modal
    return;
  }
};

const controlLoadPage = function (pageNum) {
  if (!model.state.category) {
    controlLoadKeyword(model.state.keyword, pageNum);
    return;
  }

  if (!model.state.keyword) {
    controlLoadCategory(model.state.category, pageNum);
  }
};

const controlDarkMode = function () {
  settings.toggleDarkModeSwitch();
};

sideMenu.addHandlerCategory(controlLoadCategory);
search.addHandlerSearch(controlLoadKeyword);
keywords.addHandlerKeywordClick(controlLoadKeyword);
keywords.addHandlerFollow(controlFollow);
contents.addHandlerScroll(controlInfiniteScroll);
contents.addHandlerClick(controlContentButtonClick);
pagination.addHandlerPageClick(controlLoadPage);
settings.addHandlerDarkMode(controlDarkMode);

controlLoadCategory("general");
