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
    var description;
    $.ajax({
      type : "get",
      url : "/user/games/",
      data : {
        "session" : session
      },
      success : function(data) {
        var allGames = data.games;
        var this_game = allGames[gameid];
        var descriptionArray = this_game["descriptions"];
        description = descriptionArray[descriptionArray.length - 1];
        console.log("description " + description);
        if (description !== undefined) {
        	var title = $("<h3>").html("Your Friend Drew: ");
          var divContent = $("<h2>").html(description);
          $("#description").append(title).append(divContent);
        }
      } 
    });
		console.log("no initial null errors!");
		$("#endTurnBtn").click(function() {
			console.log("beginning to submit");
      
			endTurn();
		});

		$("#colorChooser").hide();
		$("#brushSizeChooser").hide();

		$("#brush").click(function(){
			console.log("Clicked brush!");
			$("#brushSizeChooser").show();
			$("#colorChooser").hide();
		});

		$("#brushSizeChooser").on("mouseup",function(slider){
			$("#brushSizeChooser").hide();
		});

		$("#colorPallete").click(function(){
			$("#colorChooser").show();
			$("#brushSizeChooser").hide();
		})

		$("#closeBtn").click(function() {
			$("#colorChooser").hide();
		})

		$("#red").click(function() {
			$("#slider1")[0].selector(300-0xff);
			$("#slider2")[0].selector(300-0x31);
			$("#slider3")[0].selector(300-0x28);
		});

		$("#blue").click(function() {
			$("#slider1")[0].selector(300-0x58);
			$("#slider2")[0].selector(300-0x70);
			$("#slider3")[0].selector(300-0xff);
		});

		$("#green").click(function() {
			$("#slider1")[0].selector(300-0x4b);
			$("#slider2")[0].selector(300-0xce);
			$("#slider3")[0].selector(300-0x5b);
		});

		$("#purple").click(function() {
			$("#slider1")[0].selector(300-0x84);
			$("#slider2")[0].selector(300-0x42);
			$("#slider3")[0].selector(300-0xce);
		});

		$("#orange").click(function() {
			$("#slider1")[0].selector(300-0xff);
			$("#slider2")[0].selector(300-0x97);
			$("#slider3")[0].selector(300-0x00);
		});

		$("#pink").click(function() {
			$("#slider1")[0].selector(300-0xff);
			$("#slider2")[0].selector(300-0x6e);
			$("#slider3")[0].selector(300-0xe9);
		});

		$("#black").click(function() {
			$("#slider1")[0].selector(300-0);
			$("#slider2")[0].selector(300-0);
			$("#slider3")[0].selector(300-0);
		});

		$("#redoButton").click(function() {
			redo();
		});

		$("#undoButton").click(function() {
			undo();
		});

		$("#clearButon").click(function() {
			clearCanvas();
		});
	}
});

function endTurn() {
	console.log(gameid);
	console.log("image: " + recordedMovements);
  var description = $("#yourDesc").val();
  console.log(description);
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
