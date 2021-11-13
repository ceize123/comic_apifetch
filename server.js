const express = require("express");
const path = require("path");
const dataService = require("./data-service.js"); // customize to module
const fetch = require("node-fetch");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
let data = {};

// The server must output: "Express http server listening on port" - to the console, 
// where port is the port the server is currently listening on
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static("public"));

// home route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html")); 
});

// home api
app.get("/api", async (req, res) => {
    let url = "https://xkcd.com/info.0.json";
    data = await fetch(url)
        .then((d) => d.json())
        .catch((err) => err);
    
    dataService.comicUpdate(data)
        .then(() => dataService.getViewedCount(data))
        .then((dat) => {
            let view = "viewed";
            data[view] = dat[0].comicViewed;
        }).then(() => {
            res.send(data);
        }).catch(() => {
            res.status(500).send("unable to update");
        });
});

// comic num routes
app.get("/:id", async (req, res) => {
    let url = `https://xkcd.com/${req.params.id}/info.0.json`;
    data = await fetch(url)
        .then((d) => d.json())
        .catch((err) => err);
    
    dataService.comicUpdate(data)
        .then(() => dataService.getViewedCount(data))
        .then((dat) => {
            let view = "viewed";
            data[view] = 10;
        }).catch(() => {
            res.status(500).send("unable to update");
        });

    if (data.num !== undefined) {
        res.sendFile(path.join(__dirname, "/public/index.html")); 
    } else {
        res.redirect("/");
    }
});

// comic num api
app.get("/api/:id", async (req, res) => {
    let url = `https://xkcd.com/${req.params.id}/info.0.json`;
    data = await fetch(url)
        .then((d) => d.json())
        .catch((err) => err);
    
    dataService.comicUpdate(data)
        .then(() => dataService.getViewedCount(data))
        .then((dat) => {
            let view = "viewed";
            data[view] = dat[0].comicViewed;
        }).then(() => {
            res.send(data);
        }).catch(() => {
            res.status(500).send("unable to update");
        });
});

// 404 route
app.use((req, res) => {
    res.status(404).send(`
                <h1>404</h1>
                <p>The page you were looking for doesn't exist!</p>`);
});

// app.listen(HTTP_PORT, onHttpStart);

// The server must listen on process.env.PORT || 8080
function listen() {
    return new Promise(function (resolve, reject) {
        if (app.listen(HTTP_PORT, onHttpStart)) {
            resolve();
        } else {
            reject();
        }
    });
}

// Initialize data first, listen second
dataService.initialize()
    .then(listen)
    .catch((rejectMsg) => {
        console.log("Unable to start server: ", rejectMsg);
    });