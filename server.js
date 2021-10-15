const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
let data = {};

// The server must output: "Express http server listening on port" - to the console, 
// where port is the port the server is currently listening on
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// home route
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html")); 
});

// home api
app.get('/api', async (req, res) => {
    let url = 'https://xkcd.com/info.0.json';
    data = await fetch(url)
    .then((d) => d.json());
    res.send(data);
});

// comic num routes
app.get('/:id', async (req, res) => {
    let url = `https://xkcd.com/${req.params.id}/info.0.json`;
    let data = await fetch(url)
        .then((d) => d.json())
        .catch((err) => err);
    if (data.num !== undefined) {
        res.sendFile(path.join(__dirname, "/public/index.html")); 
    } else {
        res.redirect('/');
    }
});

// comic num api
app.get("/api/:id", async (req, res) => {
    let url = `https://xkcd.com/${req.params.id}/info.0.json`;
    let data = await fetch(url)
        .then((d) => d.json())
    .catch((err) => err);
        
    res.send(data);
});

// 404 route
app.use((req, res) => {
    res.status(404).send(`
                <h1>404</h1>
                <p>The page you were looking for doesn't exist!</p>`);
});

app.listen(HTTP_PORT, onHttpStart);