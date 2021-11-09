const fs = require("fs");
const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();

var books = [];

router.get("/", (req, res) => {
  try {
    scrapeBook(req, res);
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

async function scrapeBook(req, res) {
  var limits = Number(req.query.limits);
  var stuffToScrape = req.query.stuff;

  let url = "https://en.my1lib.org/s/" + stuffToScrape;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const bookUrl = await page.$$eval(
    "#searchResultBox  h3  a",
    (options, limits) => {
      return options
        .slice(0, limits)
        .map((x) => x.href)
        .filter((x) => x.includes("https"));
    },
    limits
  );

  let bookUrl_len = bookUrl.length;

  for (let bookUrls of bookUrl) {
    getBookDetails(bookUrls, bookUrl_len, res);
  }

  await browser.close();
}

async function getBookDetails(href, length, res) {
  const browser = await puppeteer.launch();
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

  if (books.length == length) {
    createJson(res);
  }

  await browser.close();
}

async function createJson(res) {
  await fs.writeFile("public/book.json", JSON.stringify(books), (err) => {
    if (err) {
      return console.log(err);
    }
  });
  res.json(books);
  books = [];
}

module.exports = router;
