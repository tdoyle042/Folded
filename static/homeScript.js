/* Javascript for the client home page */
var gameid;
var session;

$(window).ready(function(){
	console.log("ready!");
	gameid = parseGameId();
	session = parseSession();

	if(gameid === null || session === null){
		console.log("error");
	}
	else {
		console.log(gameid,session);
		$("#endTurnBtn").click(function() {
			console.log("pressed");
			endTurn();
		});
	}
});

function endTurn() {
	var description = $("#yourDesc").val();
	console.log("endTurn");
	$.ajax({
		type: "post",
		url: "/turn",
		data: {
			"session" : session,
			"gameid" : gameid,
			"desc" : description,
			"image": recordedMovements
		},
		success: function(data) { 
			console.log("posted image");
			window.location.href = "/games?session=" + session;
		}
	});
}

//Parse the game id from the url
function parseGameId() {
	var url = window.location.href;
	var indexOfGameId = url.indexOf("&game=");

	if(indexOfGameId === -1)
		return null;

	var givenGameId = url.substring(indexOfGameId+6);
	var gameId = Number(givenGameId);

	if(gameId === NaN)
		return null;

	return gameId;
}

//Parses the session key from the url
function parseSession() {
	var url = window.location.href;
	var indexOfSession = url.indexOf("?session=");
	var indexOfGameId = url.indexOf("&game=");

	//If no session param, malformed request
	if(indexOfSession === -1 || indexOfGameId === -1) 
		return null;

	var givenSession = url.substring(indexOfSession+9,indexOfGameId);
	var session = Number(givenSession);

	//Malformed session value;
	if(session === NaN)
		return null;

	return session;
}

