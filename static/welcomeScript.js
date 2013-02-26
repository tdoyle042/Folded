var inviterSession;
var invited = false;
var invitedGameId;
var users;
var current_user;
var current_session;
var inviter_user;

$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").val();
		var inputPassword = $("#password").val();
		login(inputUsername,inputPassword);
	});
	var inviteInfo = parseInviteInfo();
	if (inviteInfo !== null){
		console.log("trace3");
		invited = true;
		inviterSession = inviteInfo[0];
		invitedGameId = inviteInfo[1];		
	}	
});

function login(username,password) {
	$.ajax({
		type : "post",
		url : "/login",
		data : {"username" : username,
				"password" : password},
		success : function(data) {
			console.log("got in!");
			current_session = data.session;
			if (invited === true){
				console.log('trace');
				getUsers([current_session, inviterSession]);
				//var current_user = users[0];
				//var inviter_user = users[1];
				//console.log("testing...");
				
				//acceptInvite(invitedGameId, inviter_user, current_user);
				
				//make_games(inviter, session);
			}
			else{
				console.log("wat");
				window.location.href = "/games?session="+current_session;
			}
		},
		fail : function(data) {
			console.log("failed to login :(");
		}
	});
}

function parseInviteInfo(){
	var url = window.location.href;
	//var indexOfSession = url.indexOf("?inviterSession="); 
	var indexOfSession = url.indexOf("69696969"); 
	//var indexOfGameId = url.indexOf("?gameID=");
	var indexOfGameId = url.indexOf("42424242");
	if(indexOfSession === -1){
		console.log("trace2");
		return null;
	}
	if(indexOfGameId === -1) 
		return null;
	//var inviterSession = Number(url.substring(indexOfSession+16, indexOfGameId-1));
	var inviterSession = Number(url.substring(indexOfSession+8, indexOfGameId-1));
	console.log(inviterSession);
	var gameId = url.substring(indexOfGameId + 8);
	return [inviterSession, gameId];
	//TODO: return some null value if either of these imply that this isn't an invited session
}

//TODO: function that takes session, gets inviter
function getUsers(sessions) {
	$.ajax({
		type : "get",
		url : "/game_users",
		//datatype : "json",
		data : {
			"givenSessions" : sessions
		},
		success : function(data) {
			//console.log(data);
			//console.log(data);
			//console.log("users");
			console.log(data.users);
			users = data.users;
			console.log("users:");
			console.log(users);
			current_user = users[0];
			inviter_user = users[1];
			acceptInvite(invitedGameId, inviter_user, current_user);
			//update_inviter_game(inviter_user, gameId, this_user);
		}
	});
}


//adds a game from inviter to games of invitee
function acceptInvite(gameId, inviter, invitee){
	console.log("accepting...");
	$.ajax({
		type : "post",
		url : "/acceptInvite",
		data : {
			"gameId" : gameId,
			"inviter" : inviter,
			"invitee" : invitee
		},
		success : function(data) {
			console.log("accepted");
			//console.log(data);
			window.location.href = "/games?session="+current_session;
		}
	});
}
	