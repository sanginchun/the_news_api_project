export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getTimeString = function (input) {
  const now = new Date();
  const then = new Date(input);

  const hoursAgo = (now - then) / (1000 * 60 * 60);

  if (hoursAgo < 1) return "방금 전";
  if (hoursAgo < 24) return `${Math.floor(hoursAgo)}시간 전`;
  if (hoursAgo < 36) return `어제`;
  if (hoursAgo < 24 * 3) return "며칠 전";

  return `${then.getFullYear()}년 ${then.getMonth() + 1}월 ${then.getDate()}일`;
};

export const getTitleSource = function (title, source) {
  let titleArr;
  let sourceArr;

  let newTitle;
  let newSource;

  if (title.includes("/")) {
    titleArr = title.split("/");
    sourceArr = titleArr.pop();

    newSource = sourceArr.split("-")[0].trim();
    newTitle = titleArr.join("/").trim();
  } else if (title.includes(" - ")) {
    titleArr = title.split("-");
    sourceArr = titleArr.pop();

    newSource = sourceArr.split("-")[0].trim();
    newTitle = titleArr.join("-").trim();
  }

  return [newTitle ? newTitle : title, newSource ? newSource : source];
};

export const getDescription = function (description, wordNum) {
  let newDesc = description;
  newDesc = newDesc?.replace(".", ". ").split(" ").slice(0, wordNum).join(" ");

  return newDesc ? newDesc : "";
};
