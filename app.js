var express = require('express');
var app = express();

var fs = require('fs');
var atob = require('atob');
app.use(express.bodyParser());

var images;

// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

//Routes to serve web pages
app.get("/",function(request,response) {
	response.sendfile("static/home.html");
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

//gets all saved images
app.get("/images",function(request,response) {
	response.send({
		images: images,
		success: true
	});
});

//posts the images you're currently saving
app.post("/images",function (request,response) {
	console.log("trace5");
	console.log(request.body);
	var item = { "recordedMovements": request.body.recordedMovements};
	var successful = (item.recordedMovements !== undefined);
	if (successful) {
		images.push(item);
		writeFile("images.txt", JSON.stringify(images));
	}
	else {
		console.log("whoops");
		item = undefined;
	}
	response.send({
		item: item,
		success: successful
	});
});

//API Requests


function initServer() {
  // When we start the server, we must load the stored data
  var defaultList = "[]";
  readFile("images.txt", defaultList, function(err, data) {
    //console.log(data);
	images = JSON.parse(data);
  });
}

initServer();  
app.listen("3000");
console.log("Listening at 3000");
