const postHeaders = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
});

function updateNowPlaying() {
    fetch("/now-playing").then((response) => {
            return response.json();
        })
        .then((info) => {
            const elem = document.getElementById("now-playing");

            let replacement = null;

            if (!info) {
                replacement = document.createElement("span");
                replacement.innerText = "nothing";
            } else {
                replacement = document.createElement("a");
                replacement.href = info.url;
                replacement.innerText = info.title;
            }

            replacement.id = "now-playing";
            elem.replaceWith(replacement);
        });
}

function addTrack() {
    const url = document.getElementById("url").value;

    if (!url) {
        return;
    }

    fetch("/queue", {
        method: "POST",
        headers: postHeaders,
        body: `url=${encodeURIComponent(url)}`
    });
}

function updateQueue() {
    fetch("/queue").then((response) => {
        return response.json();
    }).then((queue) => {
        let replacement = null;
        const elem = document.getElementById("queue");

        if (!queue) {
            replacement = document.createElement("span");
            replacement.innerText = "Nothing here :)";
        } else {
            replacement = document.createElement("div");

            queue.forEach((entry) => {
                const entryNode = document.createElement("p");

                const linkNode = document.createElement("a");
                linkNode.href = entry.url;
                linkNode.innerText = entry.title;

                entryNode.appendChild(linkNode);
                replacement.appendChild(entryNode);
            });
        }

        replacement.id = "queue";
        elem.replaceWith(replacement);
    });
}

function play() {
    fetch("/play", {
        method: "POST",
        headers: postHeaders
    });
}

function pause() {
    fetch("/pause", {
        method: "POST",
        headers: postHeaders
    });
}

function next() {
    fetch("/next", {
        method: "POST",
        headers: postHeaders
    });
}

function init() {
    setInterval(updateNowPlaying, 5000);
    setInterval(updateQueue, 5000);
}
