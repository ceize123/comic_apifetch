var express = require("express");
var path = require("path");
var cors = require('cors');

var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// The server must output: "Express http server listening on port" - to the console, 
// where port is the port the server is currently listening on
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// const corsOptions ={
//     origin:'http://localhost:8080/', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use(cors()); // Use this after the variable declaration
// app.use(cors({origin: '*'}));
// app.options("/", cors(corsOptions));  


app.get("/", function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.sendFile(path.join(__dirname, "/views/home.html")); 
});

app.listen(HTTP_PORT, onHttpStart);