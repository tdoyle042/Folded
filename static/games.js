$(document).ready(function() {
	getPageData();
});
var current_user;
function getPageData() {
	var session = parseSession();
	//console.log(session);

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
			//console.log(data);
			current_user = data.user;
			console.log(current_user["games"]);
			$("#gamesTitle").html("" + data.user["name"]+ "'s Games:");
			getGames(data.user,session);
		}
	});
}

//Given the current games, adds them to the DOM
function loadGames(user,games,session) {
	console.log("here I am!");
	console.log("total games: " + games.length);
	for(var i = 0; i < games.length; i++) {
		loadGame(i, user, games, session);
	}
}
		
function loadGame(i, user, games, session) {
	console.log("i: " + i);
	var currentGame = games[i];
	//console.log("currentGame: " + currentGame);
	var gameItem = $("<li>");
	gameItem.addClass("gameEntry");
	/////
	// console.log(currentGame);
	// currentGame["users"][0] = user;
	// currentGame["users"][1] = "pending...";
	////
	var title = $("<h2>").html(currentGame["users"][0] + " and " + currentGame["users"][1]);
	gameItem.append(title);
	//console.log(currentGame["turn"]);
	//console.log(user);
	var isTurn = (user["username"] === currentGame["turn"]);
	var turn = $("<p>");
	if(isTurn) {
		turn.html("Your Turn!");
		var drawButton = $("<button>");
		drawButton.html("Draw!");
		drawButton.click(function(){
			var gameID = currentGame["gameID"];
			var mySession = parseSession();

			window.location.href = "/play/" + gameID + "?session=" + mySession;
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


//function addGame(id,turn,image,users) {
function addGame(turn,imageID,users) {
	$.ajax({
		type : "post",
		url : "/addGame",
		data : {
			//"id" : id,
			"turn" : turn,
			"imageID" : imageID,
			"users" : users
		},
		success : function(data) {
			current_user = data.updated_user;
			
			//console.log(data);
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

function invite_url(){
	//console.log("Hmm?");
	make_pending_game();
	var session = parseSession();
	var name = current_user["name"];
	var new_game_id = current_user["games"].length;
	//var sessionQuery = "?inviterSession=" + session;
	var sessionQuery = "69696969" + session;
	//var idQuery = "?gameID=" + new_game_id;
	var idQuery = "42424242" + new_game_id;
	var inviteUrl = "/invite/" + sessionQuery + "/" + idQuery;
	$("#inviteUrl").val(window.location.origin + inviteUrl); //possibly make the textbox interactable now?
}

function make_pending_game(){
	var turn = current_user["username"];
	var imageID = [];
	var users = [current_user["username"], "pending..."];
	$(".gameEntry").remove();
	addGame(turn, imageID, users);
	getGames(current_user, parseSession());
	/*
	console.log("loading...");
	//loadGames(current_user,current_user["games"],parseSession());
	var game_list_len = current_user["games"].length;
	loadGame(game_list_len-1, current_user, current_user["games"], parseSession())
	//var new_game = current_student["games"][game_list_len-1];*/
}
