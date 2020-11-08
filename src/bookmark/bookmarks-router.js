const express = require("express");

const bodyParser = express.json();
const bookmarkRouter = express.Router();
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../store");

bookmarkRouter.get("/", (req, res) => {
    res.json(bookmarks);
});

bookmarkRouter.post("/", bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
        logger.error("TITLE IS REQUIRED");
        return res.status(400).send("TITLE IS REQUIRED");
    }
    if (!rating) {
        logger.error("RATING IS REQUIRED");
        return res.status(400).send("RATING IS REQUIRED");
    }
    if (!description) {
        logger.error("Description IS REQUIRED");
        return res.status(400).send("Description IS REQUIRED");
    }
    if (!url) {
        logger.error("URL IS REQUIRED");
        return res.status(400).send("URL IS REQUIRED");
    }

    const id = uuid();

    const bookmark = {
        id,
        title,
        url,
        description,
        rating,
    };

    bookmarks.push(bookmark);
    logger.info(`Card with ${id} id has been made`);
    res.status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(bookmarks);
});

bookmarkRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const bookmark = bookmarks.find((x) => x.id === id);

    if (!bookmark) {
        logger.error(`Bookmark with ${id} id was not found`);
        return res.status(400).send("BOOKMARK NOT FOUND");
    }

    res.status(200).send(bookmark);
});

bookmarkRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    const bookmarkIndex = bookmarks.findIndex((x) => x.id == id);
    console.log(bookmarkIndex);
    if (bookmarkIndex === -1) {
        logger.error(`Bookmark ${id} not found`);
        return res.status(400).send("BOOKMARK NOT FOUND");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with ${id} id has been deleted`);

    res.status(201).json(bookmarks);
});

module.exports = bookmarkRouter;