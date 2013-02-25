var express = require('express');
var app = express();

var fs = require('fs');
app.use(express.bodyParser());

//Database varibales
var images;
var users;
var games;
var sessions;

//Routes to serve web pages
app.get("/",function(request,response) {
	//response.sendfile("static/home.html");
	response.sendfile("static/welcome.html");
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

//app.get("/share/:id", function (request,response) {
//app.get("/static/final_image/:gameID", function (request,response) {

app.get("/share/:userID/:gameID", function (request,response) {
	//console.log("trace1");
	//console.log(arguments[0]);
	response.sendfile("static/final_image_page.html");
	//window.location = request.params.url;
	
});
	/*var imageID = request.params.id;
	if(imageID >= 0 && imageID < images.length){
		response.send({
						//image: images[imageID],
						success: true
					});
	}
	else {
		response.send({success:false});
	}
});*/

app.post("/saveImage", function (request,response) {
	var gameID = request.game.id;
	var imageID = request.body.id;
	var imageData = request.body.imageData;
	games[gameID][imageID] = imageData;
});

//gets all saved images
app.get("/images", function (request,response) {
	response.send({
		//images: images,
		success: true,
	});
});
/*
//posts the images you're currently saving
app.post("/images",function (request,response) {
	var item = { "recordedMovements": request.body.recordedMovements};
	var successful = (item.recordedMovements !== undefined);
	if (successful) {
		images.imageList.push(item);
		saveImages();
	}
	else {
		//console.log("whoops");
		item = undefined;
	}
	response.send({
		item: item,
		success: successful
	});
});*/

app.post("/images",function (request,response) {
	var item = { "recordedMovements": request.body.recordedMovements};
	//console.log("start");
	//console.log(request.body);
	//console.log("end");
	var this_game = request.body.this_game;
	//console.log("this_game:");
	//console.log(this_game);
	//console.log("then...");
	//var this_game = item.this_game;
	var successful = (item.recordedMovements !== undefined);
	console.log(this_game);
	if (this_game["imageList"] === undefined){
		this_game["imageList"] = [];
	}
	if (successful) {
		//console.log(this_game);
		this_game["imageList"].push(item);		
		saveImages();
	}
	else {
		//console.log("whoops");
		item = undefined;
	}
	response.send({
		//item: item,
		"this_game": this_game,
		success: successful
	});
});

app.post("/login", function (request,response) {
	console.log("got request to login!");
	var recievedUsername = request.body.username;
	var recievedPassword = request.body.password;
	if(authUser(recievedUsername,recievedPassword)) {
		var generatedSession = Math.floor(Math.random()*100000000);
		console.log("generated: " + generatedSession);
		sessions[""+generatedSession] = recievedUsername;
		response.send({"session" : generatedSession, success : true});
		saveSessions();
	}
	else {
		response.statusCode = 300;
		response.send({success : false});
	} 
});

app.get("/register", function (request,response) {
	response.sendfile("static/register.html");
});

app.post("/register", function (request,response) {
	//console.log("Request to register user recieved!");

	var recievedUsername = request.body.username;
	var recievedPassword = request.body.password;
	var recievedName = request.body.realName;

	if(users[recievedUsername] === undefined) {
		newUser = new Object();
		newUser["username"] = recievedUsername;
		newUser["password"] = recievedPassword;
		newUser["name"] = recievedName;
		newUser["games"] = new Array();
		users[recievedUsername] = newUser;
		saveUsers();
		//console.log("Created the user!");
		response.send({success : true});
	}
	else {
		//console.log("Username taken!");
		response.statusCode = 300;
		response.send("Error: Username Taken!");
	}
});

app.get("/users", function (request,response) {
	response.send({data : users, success : true});
});

app.get("/game_users", function (request,response) {
	//response.send({data : users, success : true});
	var game_users = [];
	var givenSessions = request.query.givenSessions;
	//console.log(givenSessions);
	for (var i = 0; i < givenSessions.length; i++){
		var username = sessions[""+givenSessions[i]];
		var user = users[""+username];
		//console.log(user);
		game_users.push(user);
		//console.log(game_users);		
	}
	response.send({"users" : game_users, success : true});
});

app.get("/user", function (request,response) {
	var givenSession = request.query.givenSession;
	var username = sessions[""+givenSession];
	var user = users[""+username];

	if(user === undefined) {
		console.log("Invalid session key, user undef!");
		response.statusCode = 300;
		response.send({success : false});
	} 
	else {
		response.statusCode = 200;
		response.send({"user" : user, success : true});
	}
});

app.get("/user/games/", function (request,response) {
	//console.log("well?");
	var session = request.query.session;	
	console.log(session);
	var username = sessions[""+session];
	console.log(username);
	var user = users[username];
	console.log(user);
	//console.log(user);
	// console.log(session);
	// console.log(username);
	// console.log(user);

	if(user === undefined) {
		//console.log(session);
		console.log("Session key invalid");
		response.statusCode = 301;
		response.send({success : false});
	}
	else {
		var allGames = [];
		//console.log("trace4");
		//console.log(user["games"][0]);
		console.log(user["games"].length);
		for(var i = 0; i < user["games"].length; i++) {
			console.log("games:");
			console.log(user["games"]);
			allGames.push(games[user["games"][i]]);
		}
		console.log("start");
		console.log(allGames);

		response.send({
			"games" : allGames,
			"user" : user,
			success : true
		});
	}
});

app.post("/end_turn", function (request, response){
	var user = request.body.user;
	console.log("ending...");
	console.log(user);
	var game = request.body.game;
	var gameId = request.body.gameId;
	console.log(game);
	games[gameId] = game;
	response.send({success: true});
});

/*
//app.get("/invite/:inviterSession/:gameID", function (request, response) {
app.get("/invite/:params1/:params2", function (request, response) {
	console.log("foo");
	//go to proper file
	//send success, variable to show who invited by
	
	//response.send({success : true, test: false});
	response.sendfile("static/invite.html");
	
});*/

app.get("/invite/:inviterSession/:gameId", function (request, response) {
	console.log("foo");
	//go to proper file
	//send success, variable to show who invited by
	
	//response.send({success : true, test: false});
	response.sendfile("static/invite.html");
	
})

app.post("/acceptInvite", function (request, response) {
	console.log("trace1");
	var gameId = request.body.gameId;
	var inviter = request.body.inviter;
	var invitee = request.body.invitee;
	
	console.log(inviter["games"]);
	console.log(gameId);	
	//var this_game = games[inviter["games"][gameId]];
	var this_game = games[gameId];
	console.log("game:");
	console.log(this_game);
	this_game["users"][1] = invitee;
	
	games[gameId]["users"][1] = invitee["username"];
	users[invitee["username"]]["games"].push(gameId);
	//console.log(users[invitee["username"]]["games"].length);
	response.send({success: true});
	//invitee["games"].push(this_game); //need to fix ID?
	//response.send({"game" : newGame, success : true});
})
	

app.get("/games", function (request,response) {
	response.sendfile("static/games.html");
});

app.get("/play/:params", function (request,response) {
	response.sendfile("static/home.html");
});

app.post("/addGame", function (request,response) {
	var newGame = new Object();
	newGame["turn"] = request.body.turn;
	//newGame["imageList"] = request.body.imageID;
	newGame["imageList"] = [];
	newGame["users"] = request.body.users;
	newGame["gameID"] = games.length;
	var updated_user = users[newGame["users"][0]];
	updated_user["games"].push(newGame["gameID"]);
	console.log("new game:");
	console.log(newGame);
	games.push(newGame);
	saveGames();
	saveUsers();
	response.send({"updated_user" : updated_user, "game" : newGame, success : true});
});

function initServer() {
	readData();
}

function readData() {
	////console.log('getting users...');
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
	////console.log('getting images...');
	fs.readFile("images.txt",function(err,data) {
		if(err) {
			console.log("Error Reading Images");
			images = new Object();
			images.imageList = [];
			saveImages();
		}
		else {
			images = JSON.parse(data);
		}
	});
	////console.log('getting games...');
	fs.readFile("games.txt",function(err,data) {
		if(err || data == undefined) {
			console.log("Error Reading Games");
			games = [];
			saveGames();
		}
		else {
			games = JSON.parse(data);
		}
	});

	fs.readFile("sessions.txt",function(err,data) {
		if(err) {
			console.log("Error sessions Sessions");
			sessions = new Object();
			saveSessions();
		}
		else {
			sessions = JSON.parse(data);
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
			console.log("Wrote Images to Disk");
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

function saveSessions() {
	var sessionsString = JSON.stringify(sessions);
	fs.writeFile("sessions.txt",sessionsString,function(err){
		if(err) {
			console.log("Error writing Sessions to Disk");
		}
		else {
			console.log("Wrote Sessions to Disk");
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
