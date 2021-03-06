const { getInfo } = require("ytdl-getinfo");
const mpv = require("node-mpv");

class Player {
    constructor(mpvOptions) {
        mpvOptions = mpvOptions || {
            audio_only: true
        };

        this.mpv = new mpv(mpvOptions);
        this.current = null;
        this.queue = [];
        this.paused = false;

        this.mpv.on("stopped", this.next.bind(this));
    }

    get nowPlaying() {
        return {
            status: this.paused ? "paused" : "playing",
            info: this.current
        };
    }

    enqueue(url) {
        return getInfo(url).then((info) => {
            const entry = {
                title: info.items[0].title,
                url: url
            };

            let status;

            if (this.current) {
                // Currenty playing something, add it to the queue
                this.queue.push(entry);
                status = "queued";
            } else {
                // Play it right away
                this.current = entry;
                this.mpv.loadStream(entry.url);
                status = "playing";
            }

            return {
                status,
                info: entry
            };
        });
    }

    play() {
        this.mpv.play();
        this.paused = false;
    }

    pause() {
        this.mpv.pause();
        this.paused = true;
    }

    next() {
        const entry = this.queue.shift() || null;
        this.current = entry;

        if (entry) {
            this.mpv.loadStream(entry.url);

            if (this.paused) {
                this.play();
            }
        } else {
            this.mpv.stop();
        }

        return entry;
    }
}

module.exports = Player;
