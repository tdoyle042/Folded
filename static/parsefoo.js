var inviter_user;

function parseInviteInfo(){
	var url = window.location.href;
	var indexOfSession = url.indexOf("?inviterSession="); 
	var indexOfGameId = url.indexOf("?gameID=");
	if(indexOfSession === -1) 
		return null;
	if(indexOfGameId === -1) 
		return null;
	var inviterSession = Number(url.substring(indexOfSession+16, indexOfGameId-1));
	var gameId = url.substring(indexOfGameId + 8);
	return [inviterSession, gameId];
	//TODO: return some null value if either of these imply that this isn't an invited session
}

//TODO: function that takes session, gets inviter
function getUsers(sessions) {
	$.ajax({
		type : "get",
		url : "/game_users",
		datatype : "json",
		data : {
			"givenSessions" : sessions
		},
		success : function(data) {
			//console.log(data);
			users = data.users;
			//update_inviter_game(inviter_user, gameId, this_user);
		}
	});
}
	
function update_inviter_game(inviter_user, gameId, this_user){
	var inviter_game = inviter_user["games"][gameId];
	inviter_game["users"][1] = this_user;
	this_user["games"].push(inviter_game);
	var num_games = this_user["games"].length;
	this_user["games"][num_games - 1]["id"] = num_games - 1;
}

//adds a game from inviter to games of invitee
function acceptInvite(gameId, inviter, invitee){
	$.ajax({
		type : "post",
		url : "/acceptInvite",
		data : {
			"gameId" : gameId,
			"inviter" : inviter,
			"invitee" : invitee
		},
		success : function(data) {
			
			//console.log(data);
		}
	});
}