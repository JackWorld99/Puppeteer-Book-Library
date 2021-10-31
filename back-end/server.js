const fs = require("fs");
var express = require("express");

var app = express();
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "Origin,X-Requested-With,Content-Type,Accept" // For POST CORS Error
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

var JsonFile = __dirname + "/book.json";

//Get content from a JSON file
app.get("/json_file", (req, res) => {
  try {
    let data = fs.readFileSync(`${__dirname}/${req.query.name}.json`);
    res.json(JSON.parse(data));
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Create JSON file
app.put("/json_file", (req, res) => {
  try {
    const fileName = __dirname + "/" + req.query.name + ".json";
    let bodyData = req.body;
    fs.open(fileName, "r", (error, fd) => {
      fs.writeFile(fileName, JSON.stringify(bodyData), (error) => {
        // Create new JSON file
        if (error) console.log(error);
      });
    });
    res.send({ success: "File successfully created." });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

//Update JSON file
app.post("/json_file", (req, res) => {
  try {
    const fileName = __dirname + "/" + "book.json";
    let bodyData = req.body;
    fs.open(fileName, "r", (error, fd) => {
      let book = JSON.parse(fs.readFileSync(fileName, "utf8")); // Read file content
      bodyData.forEach((newBook) => {
        book.push(newBook);
      });
      fs.writeFileSync(fileName, JSON.stringify(book)); // Write content to the file
    });
    res.send({ success: "File successfully updated." });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Delete JSON file
app.delete("/json_file", (req, res) => {
  try {
    fs.unlinkSync(__dirname + "/" + req.query.name + ".json");
    res.send({ success: "File deleted." });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Get book details
app.get("/book", (req, res) => {
  try {
    let book = JSON.parse(fs.readFileSync(JsonFile));
    const title = req.query.title;
    let response = {};
    book.forEach(function (books, index) {
      if (books["title"] == title) {
        response = books;
      }
    });
    res.json(response);
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Add new book
app.put("/book", (req, res) => {
  try {
    let bookInfo = res.body;
    fs.open(JsonFile, "r", (error, fd) => {
      let fileContent = JSON.parse(fs.readFileSync(JsonFile, "utf8")); // Read file content
      fileContent.push(bookInfo);
      fs.writeFileSync(JsonFile, JSON.stringify(fileContent)); // Write content to the file
    });
    res.send({ success: "Book was added successfully." });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Update book details
app.post("/book", (req, res) => {
  try {
    let title = req.query.title;
    let bodyData = req.body;
    let found = false;
    fs.open(JsonFile, "r", (error, fd) => {
      var books = JSON.parse(fs.readFileSync(JsonFile, "utf8")); // Read file content
      books.forEach(function (book, index) {
        if (book["title"] == title) {
          found = true;
          book["title"] = bodyData["title"];
          book["web_url"] = bodyData["web_url"];
          book["image_url"] = bodyData["image_url"];
        }
      });
      if (found) {
        fs.writeFileSync(JsonFile, JSON.stringify(books)); // Write content to the file
        res.send({ success: "Book was updated successfully." });
      } else {
        res.send({ error: title + "not found." });
      }
    });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// Delete book
app.delete("/book", (req, res) => {
  let title = req.query.title;
  let book = JSON.parse(fs.readFileSync(JsonFile));
  var bookIndex = -1;
  book.forEach(function (books, index) {
    if (books["title"] == title) {
      bookIndex = index;
    }
  });
  if (bookIndex > -1) {
    book.splice(bookIndex, 1);
    fs.writeFileSync(JsonFile, JSON.stringify(book));
    res.send({ success: "Book was deleted successfully." });
  } else {
    res.send({ error: title + "not found." });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server listening at http://localhosr:${port}`);
});
