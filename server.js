const fs = require("fs");
const express = require("express");
const scrapingRouter = require("./routes/scraping");
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("/scrape", scrapingRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/json-file", (req, res) => {
  try {
    let data = fs.readFileSync("public/book.json");
    res.json(JSON.parse(data));
  } catch (err) {
    res.send({ error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server listening at port http://localhost:${port}`);
});
