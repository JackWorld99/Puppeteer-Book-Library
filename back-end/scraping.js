const fs = require("fs");
// const express = require("express");
const puppeteer = require("puppeteer");

// var app = express();
// app.use(express.json());
// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "*Origin,X-Requested-With,Content-Type,Accept"
//   );
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//   next();
// });

var books = [];

(async () => {
  let url = "https://en.my1lib.org/s/programming";
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const bookUrl = await page.$$eval("#searchResultBox  h3  a", (options) => {
    return options
      .slice(0, 3)
      .map((x) => x.href)
      .filter((x) => x.includes("https"));
  });

  for (let bookUrls of bookUrl) {
    getBookDetails(bookUrls);
  }
  await browser.close();
})();

async function getBookDetails(href) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
  });
  const page = await browser.newPage();
  await page.goto(href);

  const title = await page.evaluate(() => {
    return document.querySelector("div.row.cardBooks h1").innerText.trim();
  });
  const image = await page.evaluate(() => {
    return document.querySelector("div.row.cardBooks img").src;
  });
  const web_url = href;

  var bookObj = {
    title: title,
    web_url: web_url,
    image: image,
  };

  books.push(bookObj);
  await fs.writeFile("book.json", JSON.stringify(books), (err) => {
    if (err) console.log(err);
  });

  await browser.close();
}

// app.get("/crawler", (req, res) => {
//   try {
//     // let url = req.query.url;
//     let url = "https://en.my1lib.org/s/programming";
//     scrapeBook(url);
//   } catch (error) {
//     res.send({ error: error.toString() });
//   }
// });

// const port = 8081;
// app.listen(port, () => {
//   console.log(`Server Listening on http://localhost:${port}`);
// });
