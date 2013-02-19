var express = require('express');
var app = express();

var fs = require('fs');
var atob = require('atob');
app.use(express.bodyParser());

var image;

//Routes to serve web pages
app.get("/",function(request,response) {
	response.sendfile("static/home.html");
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

app.post("/saveImage",function (request,response) {

});

app.get("/getImage",function(request,response) {

});

//API Requests

app.listen("3000");
console.log("Listening at 3000");
