const express = require("express");

const app = express();

let pageViews = 0;

const viewUpdater = (req, res, next) => {
    console.log("middleware hit");
    pageViews++;
    next();
};
app.use(viewUpdater);

app.get("/", (req, res) => {
    res.send(`page count is ${pageViews}`);
});

app.listen(3000, () => console.log("server is runing bro"));
