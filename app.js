var express = require('express');
var app = express();

var fs = require('fs');
app.use(express.bodyParser());

//Routes to serve web pages
app.get("/",function(request,response) {
	response.sendfile("static/home.html");
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

//API Requests

app.listen("3000");
console.log("Listening at 3000");
