const express = require("express");
const path = require("path");
const cors = require('cors');

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// The server must output: "Express http server listening on port" - to the console, 
// where port is the port the server is currently listening on
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));
const cors = require('cors');
const corsOptions ={
    origin:'https://tranquil-peak-64703.herokuapp.com/', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// app.use(cors()); // Use this after the variable declaration

app.get("/", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(path.join(__dirname, "/views/home.html")); 
});

// app.get("/api/users", (req, res) => {
//     res.json({message: "fetch all users"});
// });

// app.get("/api/users/:userId", (req, res) => {
//     res.json({message: "get user with Id: " + req.params.userId});
// });

app.listen(HTTP_PORT, onHttpStart);