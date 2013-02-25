/* Javascript for the client home page */
$(window).ready(function(){
	console.log("ready!");
});


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

