$(document).ready(function() {
	getPageData();
});

function getPageData() {
	var session = parseSession();
	console.log(session);

	if(session === null) {
		$("#gamesTitle").html("Error!");
		$("#errorMessage").html("Invalid Session, Please ").append("<a href='/login'>Login</a> Again!");
	}

	else {
		getUser(session);
	}


}

//Given a user, returns all the games associated
//with that user
function getGames(user,session) {
	console.log("got here!");
	$.ajax({
		type : "get",
		url : "/user/games/",
		data : {
			"session" : session
		},
		success : function(data) {
			console.log(data.games);
			loadGames(user,data.games,session);
		},
		fail : function(data) {
			console.log("failed :( : " + data);
		}
	});	
}

function getUser(session) {
	$.ajax({
		type : "get",
		url : "/user",
		datatype : "json",
		data : {
			"givenSession" : session
		},
		success : function(data) {
			console.log(data);
			$("#gamesTitle").html("" + data.user["name"]+ "'s Games:");
			getGames(data.user,session);
		}
	});
}

//Given the current games, adds them to the DOM
function loadGames(user,games,session) {

	for(var i = 0; i < games.length; i++) {
		var currentGame = games[i];

		var gameItem = $("<li>");
		var title = $("<h2>").html(currentGame["users"][0] + " and " + currentGame["users"][1]);
		gameItem.append(title);
		console.log(currentGame["turn"]);
		console.log(user);
		var isTurn = (user["username"] === currentGame["turn"]);
		var turn = $("<p>");
		if(isTurn) {
			turn.html("Your Turn!");
			var drawButton = $("<button>");
			drawButton.html("Draw!");
			drawButton.click(function(){
				var gameID = currentGame["gameID"];
				var mySession = session;

				window.location.href = encodeURI("/play?session=" + mySession + "&game=" + gameID);
			});
			turn.appendTo(gameItem);
			drawButton.appendTo(gameItem);
		}
		else {
			turn.html("Your Friend's Turn!");
			turn.appendTo(gameItem);
		}

		$("#content > ul").append(gameItem);
	}

}

function addGame(id,turn,image,users) {
	$.ajax({
		type : "post",
		url : "/addGame",
		data : {
			"id" : id,
			"turn" : turn,
			"imageID" : image,
			"users" : users
		},
		success : function(data) {
			console.log(data);
		}
	});
}

//Parses the session key from the url
function parseSession() {
	var url = window.location.href;
	var indexOfSession = url.indexOf("?session=");

	//If no session param, malformed request
	if(indexOfSession === -1) 
		return null;

	var givenSession = url.substring(indexOfSession+9);
	var session = Number(givenSession);

	//Malformed session value;
	if(session === NaN)
		return null;

	return session;
}