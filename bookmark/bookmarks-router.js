const express = requir("express");

const bodyParser = express.Router();
const bookmarkRouter = express.Router();
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../bookmarks");

bookmarkRouter.get("/", (req, res) => {
    res.json(bookmarks);
});

bookmarkRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const bookmark = bookmarks.find((x) => x.id === id);

    if(!bookmark) {
        logger.error(`Bookmark with ${id} id was not found`);
        return res.status(400).send("bookmark not found");
    }
    
    res.status(200).send(bookmark)
});

bookmarkRouter.post("/", bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if(!title) {
        logger.error("title is required");
        return res.status(400).sent("title is required");
    }

    if(!url) {
        logger.error("url is required");
        return res.status(400).sent("url is required");
    }
    
    if(!description) {
        logger.error("description is required");
        return res.status(400).sent("description is required");
    }

    if(!rating) {
        logger.error("rating is required");
        return res.status(400).sent("rating is required");
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
    logger.info(`Card with ${id} has been made`);
    res.status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(bookmarks);
    

});

bookmarkRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    const bookmarkIndex = bookmarks.findIndes((x) => x.id == id);
    console.log(bookmarkIndex); 
    if(bookmarkIndex === -1) {
        logger.error(`Bookmark ${id} not found`);
        return res.status(400).send("bookmark not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with ${id} id has been deleted`);

    res.status(201).json(bookmarks);
});

module.exports = bookmarkRouter;