/*
var get_user(session){
	$.ajax({
		type : "get",
		url : "/user",
		datatype : "json",
		data : {
			"givenSession" : session
		},
		success : function(data) {
			//console.log(data);
			var current_user = data.user;
			return current_user;
		}
	});
}*/

var submit_image(){
	var url = window.location.href;
	var indexOfId = url.indexOf("/play/");
	var indexOfSession = url.indexOf("?session");
	var gameId = url.substring(indexOfId+1, indexOfSession);
	var session = url.substring(indexOfSession);
		//console.log("got here!");
	$.ajax({
		type : "get",
		url : "/user/games/",
		data : {
			"session" : session
				},
		success : function(data) {
			var games = data.games;
			var this_game = games[gameId];
			switch_turn(this_game);
			save_to_game(recordedMovements, this_game);
			window.location.href = "/games?session="+session;
			//console.log(data.games);
			//loadGames(user,data.games,session);
		},
		//fail : function(data) {
		//	console.log("failed :( : " + data);
	}
});	

	//var current_user = get_user(session);
	//return 



function switch_turn(game){
	var current_turn = game["turn"];
	var players = game["users"];
	if (current_turn === players[0]){
		game["turn"] = players[1];
	}
	else{
		game["turn"] = players[0];
	}
	
}

function save_to_game(recordedMovements, game){
	game["image"].push(recordedMovements);
}