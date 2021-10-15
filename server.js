const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const exphbs = require("express-handlebars");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
let data = {};

// The server must output: "Express http server listening on port" - to the console, 
// where port is the port the server is currently listening on
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));
// app.use('/:id', express.static('public'));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html")); 
});


app.get('/api', async (req, res) => {
    let url = 'https://xkcd.com/info.0.json';
    data = await fetch(url)
    .then((d) => d.json());
    res.send(data);
    // res.sendFile(path.join(__dirname, "/views/home.html")); 
});

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
    // res.redirect(`/${req.params.id}`);
    // res.render('/public/index.html');

});

app.get("/api/:id", async (req, res) => {
    let url = `https://xkcd.com/${req.params.id}/info.0.json`;
    let data = await fetch(url)
        .then((d) => d.json())
    .catch((err) => err);
        
    res.send(data);
    // res.render('viewData', {
    //     dt: data,
    //     layout: false,
    // });
});

// 404 route
app.use((req, res) => {
    res.status(404).send(`
                <h1>404</h1>
                <p>The page you were looking for doesn't exist!</p>`);
});

// app.get("/api/users", async (req, res) => {
//     let url = 'https://xkcd.com/info.0.json';
//     let data = await fetch(url)
//         .then((d) => d.json());
//     res.send(data);
//     res.json({ message: "fetch all users" });
    
// });

// app.get("/api/users/:userId", async (req, res) => {
//     let url = `https://xkcd.com/${req.params.id}/info.0.json`;
//     let data = await fetch(url)
//         .then((d) => d.json());
//     res.send(data);
//     res.json({message: "get user with Id: " + req.params.userId});
// });

// app.put("/api/users/:userId", async (req, res) => {
//     let url = 'https://xkcd.com/info.0.json';
//     let data = await fetch(url)
//         .then((d) => d.json());
//     res.json(data);
//     res.json({ message: "fetch all users" });
// });

app.listen(HTTP_PORT, onHttpStart);