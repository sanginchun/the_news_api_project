import * as helpers from "./helpers.js";
import { NEWS_API_KEY } from "./config.js";
import { NEWS_API_URL } from "./config.js";
import { TIME_OUT_SEC } from "./config.js";
import { THUMBNAIL_WORDS } from "./config.js";

// import "regenerator-runtime";

export const state = {
  articles: [],
  nextArticleIndex: 0,
  follows: [],
  bookmarks: [],
  currentPage: 0,
  category: "",
  keyword: "",
};

export const createArticlesObject = function (data) {
  let articles = data.map(parseArticle).map(articleFilters);
  articles.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  articles = removeDuplicate(articles);

  state.articles = articles;
};

const removeDuplicate = function (articles) {
  const duplicates = [];
  for (let i = 0; i < articles.length - 1; i++) {
    if (articles[i].title === articles[i + 1].title) duplicates.push(i);
  }

  return articles.filter((_, i) => !duplicates.includes(i));
};

const articleFilters = function (article) {
  [article.title, article.source] = helpers.getTitleSource(
    article.title,
    article.source
  );
  article.description = helpers.getDescription(
    article.description,
    THUMBNAIL_WORDS
  );
  article.dateFiltered = helpers.getTimeString(article.date);
  article.img = article.img ? article.img : "../img/sample.jpg";
  article.bookmark = isBookmarked(article.url);
  return article;
};

const parseArticle = function (data) {
  const article = {
    title: data.title,
    source: data.source.name,
    description: data.description,
    url: data.url,
    img: data.urlToImage,
    date: data.publishedAt,
  };
  return article;
};

const persistFollows = function () {
  localStorage.setItem("follows", JSON.stringify(state.follows));
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const isBookmarked = function (url) {
  return state.bookmarks?.find((article) => article.url === url) ? true : false;
};

export const orderBookmarks = function () {
  state.bookmarks.map(function (article) {
    article.dateFiltered = helpers.getTimeString(article.date);
  });

  state.bookmarks.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

export const editFollow = function (keyword) {
  if (state.follows.includes(keyword)) {
    // delete
    const index = state.follows.indexOf(keyword);
    state.follows.splice(index, 1);
  } else state.follows.push(keyword); // add

  persistFollows();
};

export const editBookmark = function (url) {
  // check if it's already bookmarked
  const bookmarked = state.bookmarks.find((article) => article.url === url);

  // if not bookmarked
  if (!bookmarked) {
    const article = state.articles.find((a) => a.url === url);
    article.bookmark = true;
    state.bookmarks.push(article);
  } else state.bookmarks.splice(state.bookmarks.indexOf(bookmarked), 1); // if bookmarked

  persistBookmarks();
};

const getLocal = function (key) {
  const data = localStorage.getItem(key);
  if (data) state[key] = JSON.parse(data);
};

const init = function () {
  getLocal("follows");
  getLocal("bookmarks");
};

init();

const getNews = async function (url) {
  try {
    const fetchProm = fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": NEWS_API_KEY,
      },
    });

    const res = await Promise.race([fetchProm, helpers.timeout(TIME_OUT_SEC)]);
    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};

export const getNewsByCategory = async function (category, pageNum) {
  try {
    const URL =
      NEWS_API_URL +
      `top-headlines/?country=kr&category=${category}&page=${pageNum}`;

    const data = await getNews(URL);

    return [data.articles, data.totalResults];
  } catch (err) {
    throw err;
  }
};

export const getNewsByKeyword = async function (keyword, pageNum) {
  try {
    const URL =
      NEWS_API_URL + `everything/?q=${keyword}&language=ko&page=${pageNum}`;

    const data = await getNews(URL);

    return [data.articles, data.totalResults];
  } catch (err) {
    throw err;
  }
};
