var express = require('express');
var app = express();

var fs = require('fs');
app.use(express.bodyParser());

var images = [];
var users = new Object();
var games = [];

//Routes to serve web pages
app.get("/",function(request,response) {
	// response.sendfile("static/home.html");
	response.sendfile("static/welcome.html");
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

app.get("/share/:id", function (request,response) {
	var imageID = request.params.id;
	if(imageID >= 0 && imageID < images.length){
		response.send({
						image: images[imageID],
						sucess: true
					});
	}
	else {
		response.send({sucess:false});
	}
});

app.post("/saveImage", function (request,response) {
	var gameID = request.game.id;
	var imageID = request.body.id;
	var imageData = request.body.imageData;

	games[gameID][imageID] = imageData;
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
		saveImages();
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

app.get("/login", function (request,response) {
	var recievedUsername = request.body.username;
	var recievedPassword = request.body.password;

	if(authUser(recievedUsername,recievedPassword))
		response.send({sucess : true});
	else
		response.send({sucess : false});
});



app.get("/register", function (request,response) {
	response.sendfile("static/register.html");
});

app.post("/register", function (request,response) {
	console.log("Reques to register user recieved!");

	var recievedUsername = request.body.username;
	var recievedPassword = request.body.password;
	var recievedName = request.body.realName;

	if(users[recievedUsername] === undefined) {
		newUser = new Object();
		newUser["username"] = recievedUsername;
		newUser["password"] = recievedPassword;
		newUser["name"] = recievedName;
		users[recievedUsername] = newUser;
		saveUsers();
		console.log("Created the user!");
		response.send({sucess : true});
	}
	else {
		console.log("Username taken!");
		response.statusCode = 300;
		response.send("Error: Username Taken!");
	}
});

app.get("/users", function (request,response) {
	response.send({data : users, sucess : true});
});

// app.get("/getImage", function (request,response) {
// 	var gameID = request.body.id;
// });

function initServer() {
	readData();
}

function readData() {
	fs.readFile("users.txt",function(err,data) {
		if(err) {
			console.log("Error Reading Users");
			users = new Object();
			saveUsers();
		}
		else {
			users = JSON.parse(data);
		}
	});

	fs.readFile("images.txt",function(err,data) {
		if(err) {
			console.log("Error Reading Images");
			images = new Object();
			saveImages();
		}
		else {
			images = JSON.parse(data);
		}
	});

	fs.readFile("games.txt",function(err,data) {
		if(err) {
			console.log("Error Reading Games");
			games = new Object();
			saveGames();
		}
		else {
			games = JSON.parse(data);
		}
	});
}

function saveImages() {
	var imagesString = JSON.stringify(images);
	fs.writeFile("images.txt",imagesString,function(err){
		if(err) {
			console.log("Error writing Images to Disk");
		}
		else {
			console.log("Wrote Users to Disk");
		}
	});
}

function saveUsers() {
	var usersString = JSON.stringify(users);
	fs.writeFile("users.txt",usersString,function(err){
		if(err) {
			console.log("Error writing Users to Disk");
		}
		else {
			console.log("Wrote Users to Disk");
		}
	});
}

function saveGames() {
	var gamesString = JSON.stringify(games);
	fs.writeFile("games.txt",gamesString,function(err){
		if(err) {
			console.log("Error writing Games to Disk");
		}
		else {
			console.log("Wrote Games to Disk");
		}
	});
}

function authUser(username,password) {
	if(users[username] !== undefined && users[username]["password"] === password)
		return true;
	else
		return false;
}

initServer();
app.listen("3000");
console.log("Listening at 3000");