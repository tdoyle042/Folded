var current_user;

$(document).ready(function() {
	$("#inviteBtn").click(function() {
		newGame(3);
	});

	getPageData();
});


function getPageData() {
	var session = parseSession();

	if(session === null) {
		$("#gamesTitle").html("Error!");
		$("#errorMessage").html("Invalid Session, Please ").append("<a href='/'>Login</a> Again!");
		$("#inviteBtn").hide();
		$("#inviteUrl").hide();
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
			console.log(data.userGames);
			loadGames(data.userGames,session);
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
			current_user = data.user;
			console.log("current_user: ",current_user);
			console.log("current_user[games]: ",current_user["games"]);
			$("#gamesTitle").html("" + current_user["name"]+ "'s Games:");
			$.ajax({
				type : "get",
				data : { "this_user" : current_user},
				url : "/send_invitation",
				success : function(data){
					var invite_url = data.invitation_url;
					if (invite_url === "No Pending Invites"){
						$("#inviteUrl").val("");
						$("#inviteUrl").val(invite_url);
					}
					else{
						$("#inviteUrl").val("");
						//$("#inviteUrl").val(window.location.origin + invite_url);
						$("#inviteUrl").val(invite_url);
					}
					getGames(data.user,session);
				}			
			});
		},
		error : function(data) {
			$("#gamesTitle").html("Error!");
			$("#errorMessage").html("Invalid Session, Please ").append("<a href='/'>Login</a> Again!");
			$("#inviteBtn").hide();
			$("#inviteUrl").hide();
		}
	});
}

function loadGames(games, session) {
	$("#games").html("");
	console.log(games.length);
	var buttons = new Object();
	for(var i = 0; i < games.length; i++) {
		var currentGame = games[i];
		console.log("game number " + i + " :");
		console.log(currentGame);
		//console.log("currentGame: " + currentGame);
		var gameItem = $("<li>");
		gameItem.addClass("gameEntry");
		var title = $("<h2>").html(currentGame["users"][0] + " and " + currentGame["users"][1]);
		gameItem.append(title);
		//console.log(currentGame["turn"]);
		//console.log(user);
		var isTurn = (current_user["username"] === currentGame["turn"]);
		var turn = $("<p>");
		if(isTurn) {
			turn.html("Your Turn!");
			var drawButton = $("<button>");
			drawButton.html("Draw!");
			//buttons[i] = $("<button>");
			//buttons[i].html("Draw!");
			console.log(currentGame["users"]);
			//drawButton.click(function(){
			console.log("index: " + i);
			console.log("gameID: " + currentGame["gameID"]);			
			//buttons[i].click(function(){
			drawButton.attr("id", i);
			drawButton.click(function(){
				//console.log(buttons[i]);
				//var drawButton.gameID = currentGame["gameID"];
				//var mySession = parseSession();
				var id = $(this).attr("id");
				var currentGame = games[id];
				var gameID = currentGame["gameID"];
				console.log("currentGame users:");
				console.log(currentGame["users"]);
				console.log("gameID: " + gameID);
				window.location.href = "/play/" + gameID + "?session=" + session;
			});
			turn.appendTo(gameItem);
			//buttons[i].appendTo(gameItem);
			drawButton.appendTo(gameItem);
		}
		else {
			turn.html("Your Friend's Turn!");
			turn.appendTo(gameItem);
		}

		$("#content > ul").append(gameItem);

	}
}


//function addGame(id,turn,image,users) {
function newGame(turns) {
	$.ajax({
		type : "post",
		url : "/newGame",
		data : {
			"numTurns" : turns,			
			"username" : current_user["username"]
		},
		success : function(data) {
			console.log("Created a new game!");
			
			//window.location = window.location;
			var invite_url = "" + window.location.origin + "/?invite="+data.invite;
			console.log(window.location);
			$("#inviteUrl").val("");
			console.log("old url cleared!");
			$("#inviteUrl").val(invite_url);
			$.ajax({
				type: "post",
				data: {"invite_url" : invite_url,
						"this_user" : current_user["username"]},
				url: "/send_invitation",
				success: function(data){
					getPageData();
				}
			});
			//getPageData();
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

// function invite_url(){
// 	//console.log("Hmm?");
// 	make_pending_game();
// 	var session = parseSession();
// 	var name = current_user["name"];
// 	var new_game_id = current_user["games"].length;
// 	//var sessionQuery = "?inviterSession=" + session;
// 	var sessionQuery = "69696969" + session;
// 	//var idQuery = "?gameID=" + new_game_id;
// 	var idQuery = "42424242" + new_game_id;
// 	var inviteUrl = "/invite/" + sessionQuery + "/" + idQuery;
// 	$("#inviteUrl").val(window.location.origin + inviteUrl); //possibly make the textbox interactable now?
// }

// function make_pending_game(){
// 	var turn = current_user["username"];
// 	var imageID = [];
// 	var users = [current_user["username"], "pending..."];
// 	$(".gameEntry").remove();
// 	addGame(turn, imageID, users);
// 	getGames(current_user, parseSession());
// 	/*
// 	console.log("loading...");
// 	//loadGames(current_user,current_user["games"],parseSession());
// 	var game_list_len = current_user["games"].length;
// 	loadGame(game_list_len-1, current_user, current_user["games"], parseSession())
// 	//var new_game = current_student["games"][game_list_len-1];*/
// }
