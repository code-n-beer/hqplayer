const express = require("express");
const bodyParser = require("body-parser");
const mpv = require("node-mpv");
const Promise = require("bluebird");
const { getInfo } = require("ytdl-getinfo");

const app = express();

app.locals.player = new mpv({
    audio_only: true,
    verbose: true
});

app.locals.queue = [];
app.locals.current = null;

// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(bodyParser.json());
// app.use(express.static("frontend/"));
app.use(express.static("reactfront/build/"));
app.get('/react', (req, res) => {
    res.sendFile(__dirname + '/reactfront/build/index.html');
});

app.get("/now-playing", (req, res) => {
    res.json(req.app.locals.current);
});

app.get("/queue", (req, res) => {
    res.json(req.app.locals.queue);
});

app.post("/queue", (req, res, next) => {
    console.log(req.body)
    const url = req.body.url.replace(/\\/g, "");
    console.log(url)

    getInfo(url)
        .then((info) => {
            console.log(info)
            const entry = {
                title: info.items[0].title,
                url: url
            };

            let status;

            if (req.app.locals.current) {
                req.app.locals.queue.push(entry);
                status = "queued";
            } else {
                req.app.locals.current = entry;
                req.app.locals.player.loadStream(entry.url);
                status = "playing";
            }

            res.json({
                status,
                info: entry
            });
        })
        .catch(err => {
            return next(err);
        })
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

function playNext(locals) {
    const entry = locals.queue.shift();

    if (entry) {
        locals.current = entry;
        locals.player.loadStream(entry.url);
    }

    return entry;
}

app.post("/next", (req, res) => {
    const entry = playNext(req.app.locals);

    if (!entry) {
        res.json({
            status: "idle"
        });

        return;
    }

    res.json({
        status: "playing",
        info: entry
    });
});

app.listen(3005, () => {
    console.log("Running...");

    app.locals.player.on("stopped", () => {
        app.locals.current = null;
        playNext(app.locals);
    });
});
