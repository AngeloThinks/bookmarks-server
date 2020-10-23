require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const bookmarks = require("./bookmarks.json");
const { v4: uuid } = require("uuid");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";
const savedBookmarks = [];

//middleware section
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

//validateBearerToken function, removed the app.use
function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
}

app.get("/bookmarks", validateBearerToken, (req, res) => {
  res.json(savedBookmarks);
});

app.get("/bookmarks/:id", validateBearerToken, (req, res) => {
  let { bookmarks } = req.body;
  if (!bookmarks) {
    return res.status(404).send("Error 404 Bookmark  not found");
  }

  res.send("Hello, world!");
});

app.post("/bookmarks", validateBearerToken, (req, res) => {
  console.log(req.body);
  const { title, description, url } = req.body;

  if (!title) {
    return res.status(400).send("Title required");
  }

  if (!description) {
    return res.status(400).send("Description required");
  }

  if (!url) {
    return res.status(400).send("URL required");
  }

  const id = uuid();
  const newBookmarks = {
    id: uuid(),
    title,
    description,
    url,
  };

  bookmarks.push(newBookmarks);

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(newBookmarks);
});

//bookmark or bookmarks?

app.delete("/bookmarks/:bookmarksId", validateBearerToken, (req, res) => {
  const { bookmarksId } = req.params;
  const index = bookmarks.findIndex((b) => b.id === bookmarksId);
  if (bookmarks === -1) {
    return res.status(404).send("Bookmark not found");
  }
  bookmarks.splice(index, 1);

  res.send("Deleted");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
