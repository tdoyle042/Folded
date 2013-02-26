var invite;

$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").val();
		var inputPassword = $("#password").val();
		login(inputUsername,inputPassword);
	});
	
	invite = parseInviteInfo();

	$("#register").click(function() {
		if(invite === null)
			window.location.href = "/register";
		else
			window.location.href = "/register?invite="+invite;
	});
});

function login(username,password) {
	$.ajax({
		type : "post",
		url : "/login",
		data : {"username" : username,
				"password" : password},
		success : function(data) {
			if(invite === null)
				window.location.href = "/games?session="+data.session;
			else {
				var session = data.session;
				console.log("invite not null!");
				$.ajax({
					type : "post",
					url : "/invite",
					data : {
						"invite" : invite,
						"session": data.session
					},
					success : function(data){
						console.log("Accepted invite successfully!");
						window.location.href = "/games?session="+session;
					}
				})
			}
		},
		fail : function(data) {
			console.log("failed to login :(");
		}
	});
}

function parseInviteInfo(){
	var url = window.location.href;
	var indexOfInvite = url.indexOf("?invite="); 

	if(indexOfInvite === -1) 
		return null;

	var invite = Number(url.substring(indexOfInvite+8));
	
	if(invite === NaN)
		return null;
	else
		return invite;
}

// //TODO: function that takes session, gets inviter
// function getUsers(sessions) {
// 	$.ajax({
// 		type : "get",
// 		url : "/game_users",
// 		//datatype : "json",
// 		data : {
// 			"givenSessions" : sessions
// 		},
// 		success : function(data) {
// 			//console.log(data);
// 			//console.log(data);
// 			//console.log("users");
// 			console.log(data.users);
// 			users = data.users;
// 			console.log("users:");
// 			console.log(users);
// 			current_user = users[0];
// 			inviter_user = users[1];
// 			acceptInvite(invitedGameId, inviter_user, current_user);
// 			//update_inviter_game(inviter_user, gameId, this_user);
// 		}
// 	});
//}


// //adds a game from inviter to games of invitee
// function acceptInvite(gameId, inviter, invitee){
// 	console.log("accepting...");
// 	$.ajax({
// 		type : "post",
// 		url : "/acceptInvite",
// 		data : {
// 			"gameId" : gameId,
// 			"inviter" : inviter,
// 			"invitee" : invitee
// 		},
// 		success : function(data) {
// 			console.log("accepted");
// 			//console.log(data);
// 			window.location.href = "/games?session="+current_session;
// 		}
// 	});
// }
	