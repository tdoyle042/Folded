/* Javascript for the client home page */
var gameid;
var session;

$(window).ready(function(){
	console.log("ready!");
	gameid = parseGameId();
	session = parseSession();

	if(gameid === null || session === null){
		console.log("id or session is null");
		console.log("id: " + gameid);
		console.log("session: " + session);
		
		//Error
	}
	else {
		console.log("no initial null errors!");
		$("#endTurnBtn").click(function() {
			console.log("beginning to submit");
      
			endTurn();
		});
	}
});

function endTurn() {
	console.log(gameid);
	console.log("image: " + recordedMovements);
  var description = $("#yourDesc").val();
	$.ajax({
		type: "post",
		url: "/turn",
		data: {
			"session" : session,
			"gameId" : gameid,
			"image": recordedMovements,
      "description" : description
		},
		success: function(data) { 
			var status = data.status;
			console.log("status: " + status);
			if (status === "done"){
				console.log("merging...");
				final_merge(gameid, session);
			}
			else{
				console.log("posted image");
				window.location.href = "/games?session=" + session;
			}
		}
	});
}

//Parse the game id from the url
function parseGameId() {
	var url = window.location.href;
	//var indexOfGameId = url.indexOf("&game=");
	indexOfGameId = url.indexOf("/play/");
	var indexOfSession = url.indexOf("?session=");
	if(indexOfGameId === -1)
		return null;

	var givenGameId = url.substring(indexOfGameId+6, indexOfSession);
	console.log(givenGameId);
	var gameId = Number(givenGameId);
	
	if(gameId === NaN)
		return null;
	
	return gameId;
}

//Parses the session key from the url
function parseSession() {
	var url = window.location.href;
	var indexOfSession = url.indexOf("?session=");
	//var indexOfGameId = url.indexOf("&game=");

	//If no session param, malformed request
	if(indexOfSession === -1 || indexOfGameId === -1) 
		return null;

	var givenSession = url.substring(indexOfSession+9);
	var session = Number(givenSession);

	//Malformed session value;
	if(session === NaN)
		return null;

	return session;
}

function final_merge(gameId, session){
	window.location = "/share/" + "user" + session + "/" + "gameId" + gameId;
	//return 42;
}
