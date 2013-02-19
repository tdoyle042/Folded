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
	console.log("Got request");

	var myimage = new Buffer(request.body.image,'base64');
	image = myimage;
	fs.writeFile("image.jpeg",myimage,function(err){
		if(err) throw err;
		console.log("saved file!");
		response.send({sucess:true});
	});
});

app.get("/getImage",function(request,response) {
	console.log("get image!");
	response.send({"image": image,sucess:true});
});

//API Requests

app.listen("3000");
console.log("Listening at 3000");
