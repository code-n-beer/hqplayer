const express = require("express");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const Player = require("./player");

const app = express();

app.locals.player = new Player({
    audio_only: true,
    verbose: true
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("frontend/"));

app.get("/now-playing", (req, res) => {
    res.json(req.app.locals.player.nowPlaying);
});

app.get("/queue", (req, res) => {
    res.json(req.app.locals.player.queue);
});

app.post("/queue", (req, res) => {
    const url = req.body.url.replace(/\\/g, "");

    req.app.locals.player.enqueue(url)
        .then((status) => res.json(status));
});

app.post("/play", (req, res) => {
    req.app.locals.player.play();

    res.json({
        status: "playing"
    });
});

app.post("/pause", (req, res) => {
    req.app.locals.player.pause();

    res.json({
        status: "paused"
    });
});

app.post("/next", (req, res) => {
    const entry = req.app.locals.player.next();

    const response = {
        status: "idle"
    };

    if (entry) {
        response.status = "playing";
        response.info = entry;
    }

    res.json(response);
});

app.listen(3000, () => {
    console.log("Running...");
});
