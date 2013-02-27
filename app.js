var express = require('express');
var app = express();

var fs = require('fs');
app.use(express.bodyParser());

//Database varibales
var images;
var users;
var games;
var sessions;
var invites;

//Routes to serve web pages
app.get("/",function(request,response) {
	//response.sendfile("static/home.html");
	console.log("Welcome!");
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
	var this_game = request.body.this_game;
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

		var generatedSession = Math.floor(Math.random()*100000000);
		console.log("generated: " + generatedSession);
		sessions[""+generatedSession] = recievedUsername;
		saveSessions();
		response.send({"session" : generatedSession, success : true});		
		//console.log("Created the user!");
		//response.send({"session" : session, success : true});
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
	var session = request.query.session;
	// console.log(session);
	var username = sessions[""+session];
	// console.log(username);
	var user = users[username];
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
		// console.log("start");
		// console.log(allGames);

		response.send({
			"games" : allGames,
			"user" : user,
			success : true
		});
	}
});

app.post("/turn", function (request, response){
	console.log("ending turn");
	var session = request.body.session;
	var gameId = request.body.gameId;
	var image = request.body.image;
	console.log("session: " + session);
	console.log("gameId: " + gameId);
	if (image === undefined) {
		image = [];
	}
	//console.log("image: " + image);
	var game = games[gameId];
	var user = sessions[session];
	//console.log("image: " + image);
	//console.log("game: " + game);
	console.log("user: " + user);
	if(game === undefined || user === undefined || image === undefined) {
		response.statusCode = 300;
		response.send({success : false});
		return;
	}

	game["imageList"].push(image);
	var users = game["users"];

	if(game["turn"] === users[0])
		game["turn"] = users[1];
	else
		game["turn"] = users[0];

	//game["turnNum"]++;
	// console.log("turnNum: " + game["turnNum"]);
	// console.log("numTurns: " + game["numTurns"]);
	// console.log("status: " + game["status"]);
	var turnNum = game["turnNum"];
	var numTurns = game["numTurns"];
	console.log("turnNum: " + turnNum);
	console.log("numTurns: " + numTurns);
	if(Number(turnNum) === Number(numTurns)){
		console.log("DONE WITH GAME!");
		game["status"] = "done";
		//final_merge();
		
	}
	else{
		console.log("game not over");
		game["turnNum"]++;
	}
	console.log("status: " + game["status"]);
	console.log("turnNum: " + game["turnNum"] + "\n");
	//console.log("imageList:" + game["imageList"]);
	//console.log(game);
	response.send({"status": game["status"],
					success: true});
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

// app.get("/invite/:inviterSession/:gameId", function (request, response) {
// 	console.log("foo");
// 	//go to proper file
// 	//send success, variable to show who invited by
	
// 	//response.send({success : true, test: false});
// 	response.sendfile("static/invite.html");
	
// })

app.post("/send_invitation", function (request, response) {
	var pending_invitation_url = request.body.invite_url;
	var this_user = request.body.this_user;
	users[this_user]["pending_invitation_url"] = pending_invitation_url;
	response.send({success: true});
});

app.get("/send_invitation", function (request, response) {
	var this_user = request.query.this_user;
	console.log(this_user);
	var invitation_url = users[this_user["username"]]["pending_invitation_url"];
	if (invitation_url === undefined){
		var message = "No Pending Invites";
		response.send({"invitation_url" : message,
						success : true});
	}
	else{
		response.send({"invitation_url" : invitation_url,
						success : true});
	}
});

app.post("/invite", function (request, response) {
	console.log("Invite post seen!");
	var invite = request.body.invite;
	var session = request.body.session;
	var username = sessions[session];
	var user = users[username];
	var gameID = invites[""+invite];


	if(gameID === undefined || user === undefined) {
		console.log("Failed invite accepting :(");
		response.statusCode = 300;
		response.send({success : false});
		return;
	}

	var game = games[gameID];
	game["users"][1] = username;
	game["turn"] = username;
	user["games"].push(gameID);
	
	console.log("successfully joined a game");

	games[gameID] = game;
	users[username] = user;

	saveGames();
	saveUsers();

	response.send({success: true});
});
	

app.get("/games", function (request,response) {
	console.log("Opening user's game page...");
	response.sendfile("static/games.html");
});

app.get("/play/:params", function (request,response) {
	response.sendfile("static/home.html");
});

app.post("/newgame", function (request,response) {
	var newGame = new Object();
	newGame["turn"] = "pending";
	newGame["imageList"] = [];
	var username = request.body.username;
	console.log(username);
	newGame["users"] = [];
	newGame["users"][0] = username;
	newGame["users"][1] = "pending";
	newGame["gameID"] = games.length;
	newGame["numTurns"] = request.body.numTurns;
	newGame["turnNum"] = 0;
	var user1 = users[newGame["users"][0]];
	user1["games"].push(newGame["gameID"]);

	var invite = genInvite(newGame["gameID"]);

	console.log("new game:");
	console.log(newGame);

	games.push(newGame);

	saveGames();
	saveUsers();

	response.send({"invite" : invite, success : true});
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

	fs.readFile("invites.txt",function(err,data) {
		if(err) {
			console.log("Error sessions Sessions");
			invites = new Object();
			saveInivtes();
		}
		else {
			invites = JSON.parse(data);
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

function saveInivtes() {
	var invitesString = JSON.stringify(invites);
	fs.writeFile("invites.txt",invitesString,function(err){
		if(err) {
			console.log("Error Writing Invites to Disk");
		}
		else {
			console.log("Wrote Invites to Disk");
		}
	});	
}

function authUser(username,password) {
	if(users[username] !== undefined && users[username]["password"] === password)
		return true;
	else
		return false;
}

function genInvite(gameID) {
	var invite = undefined;

	//Gen unique invite code
	while(invite === undefined || invites[""+invite] !== undefined)
		invite = Math.floor(Math.random()*100000000);

	invites[""+invite] = gameID;
	saveInivtes();
	return invite;
}

initServer();
app.listen("3000");
console.log("Listening at 3000");
