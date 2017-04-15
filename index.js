const express = require("express");
const bodyParser = require("body-parser");
const mpv = require("node-mpv");
const Promise = require("promise");

const app = express();

app.locals.player = new mpv({
    audio_only: true,
    verbose: true
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/now-playing", (req, res) => {
    req.app.locals.player.getProperty("media-title")
        .then(title => res.json({
            title: title
        }));
});

app.get("/playlist", (req, res) => {
    req.app.locals.player.getProperty("playlist/count")
        .then(count => {
            let entries = [];
            console.log(`getting ${count} entries`);

            for (let i = 0; i < count; i++) {
                const entryName = `playlist/${i}/filename`;
                console.log(entryName);
                entries.push(player.getProperty(entryName));
            }

            console.log(entries);
            return Promise.all(entries);
        })
        .then(playlist => res.json({
            entries: playlist
        }));
});

app.post("/playlist", (req, res) => {
    const url = req.body.url.replace(/\\/g, "");
    req.app.locals.player.append(url, "append-play");

    req.app.locals.player.getProperty("playlist/count")
        .then(count => {
            res.json({
                status: {
                    position: count
                },
                url: url
            });
        });
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
    req.app.locals.player.next();

    res.json({
        status: "next"
    });
});

app.listen(3000, () => console.log("Running..."));
