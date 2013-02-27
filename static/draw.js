var canvas;
var ctx;
var drawing = false;
var saved_commands = [];
var colorPallete;
var palleteCtx;
var images;
var recordedMovements = [];
var session;
var user;
var gameId;
var this_game;

$(document).ready(function() {
	canvas = $("#myCanvas")[0];
	ctx = canvas.getContext("2d");

	colorPallete = $("#colorPallete")[0];
	palleteCtx = colorPallete.getContext("2d");

	canvas.addEventListener('mousedown', onMouseDown, false); 
	canvas.addEventListener('mouseup', onMouseUp, false); 
	canvas.addEventListener('mousemove', onMouseMove, false); 
	canvas.addEventListener ("mouseout", onMouseOut, false);
});

/*
function get() {
    $.ajax({
      type: "get",
      url: "/images",
      success: function(data) {
        images = images;
      }
    });
}*/


function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recordedMovements = [];
  //get();
}


// function getUser(session){
// 	$.ajax({
// 		type:"get",
// 		data:{"session": session},
// 		url:"/user",
// 		success: function(data){
// 			var this_user = data.user;
// 			end_turn(this_user, this_game);
// 		}
// 	})
// }

// function add(this_game){
// 	//console.log("images");
// 	if (recordedMovements === []) return;
// 	//console.log(this_game);
// 	//this_game["imageList"] = [1];
// 	//console.log(this_game["imageList"]);
// 	//console.log("JSON:");
// 	//console.log(JSON.stringify(this_game));
// 	console.log(this_game);
// 	$.ajax({
// 		type: "post",
// 		data: {"recordedMovements": recordedMovements,
// 				"this_game" : this_game},
// 		url: "/images",
// 		success: function(data) { 
// 			//console.log('check');
// 			this_game = data.this_game;
// 			switch_turn(this_game);
// 			//save_to_game(recordedMovements, this_game);
// 			console.log("end:");
// 			console.log(this_game);
// 			end_turn(user, this_game);
// 			//console.log("?");
// 			//getUser(session);
// 			//end_turn(this_user, this_game); //need correct user
// 			}
// 	});
// }

// function end_turn(user, game){
// 	console.log(game);
// 	$.ajax({
// 		type: "post",
// 		data: {"user" : user,
// 				"game" : game,
// 				"gameId": gameId},
// 		url: "/end_turn",
// 		success: function(data){
// 			window.location.href = "/games?session="+session;
// 		}
// 	})
// }
/*
function saveImage() {
	add();
	get();
}*/

function onMouseDown(event){
	console.log("test");
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	ctx.moveTo(x, y);
	drawing = true;	
	var firstClickInfo = new Object();
	firstClickInfo["x"] = x;
	firstClickInfo["y"] = y;
	firstClickInfo["event"] = "MouseDown";
	recordedMovements.push(firstClickInfo);
}

function onMouseMove(event){
	
	if (drawing) {
		saved_commands = [];
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		canvas.mixed_color = "rgb(" + slider1.color_val + "," + slider2.color_val + "," + slider3.color_val + ")";
		ctx.lineTo(x,y);
		////console.log(ctx.strokeStyle);
		ctx.lineCap = 'round';
		ctx.lineWidth = strokeSizeSlider.stroke_val;
		ctx.strokeStyle = canvas.mixed_color;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x,y);
		
		var drawingRecord = new Object();
		drawingRecord["x"] = x;
		drawingRecord["y"] = y; 
		drawingRecord["color"] = canvas.mixed_color;
		drawingRecord["lineWidth"] = strokeSizeSlider.stroke_val;
		drawingRecord["event"] = "MouseMove";
		recordedMovements.push(drawingRecord);
	}
}

function onMouseUp(event){
	drawing = false;
}


function onMouseOut(event){
	drawing = false;
}

// function final_merge(){
// 	//var userID = "ben";
// 	parseUrlInfo();
// 	console.log(gameId);
// 	var gameID_url = String(gameId); //placeholder variables
// 	console.log("trace2");
// 	window.location = "/share/" + "user" + session + "/" + "gameId" + gameID_url;
// 	console.log("?");
	
// 	//merge_images(this_game);
	
// 	/*for (var i = 0; i < 500000; i++){
// 		console.log("stalling..");
// 	}*/
// }

// function submit_image(){
// 	console.log("submitting");
// 	parseUrlInfo();
// 	/*
// 	var url = window.location.href;
// 	var indexOfId = url.indexOf("/play/");
// 	var indexOfSession = url.indexOf("?session=");
// 	gameId = url.substring(indexOfId+6, indexOfSession);
// 	session = url.substring(indexOfSession+9);
// 	console.log("session: " + session);
// 	console.log("gameId: " + gameId);
// 	*/
// 	//console.log("got here!");
// 	$.ajax({
// 		type : "get",
// 		url : "/user/games/",
// 		data : {
// 			"session" : session
// 				},
// 		success : function(data) {
// 			console.log(session);
// 			user = data.user;
// 			var games = data.games;
// 			var this_game = games[gameId];
// 			console.log(games);
// 			//console.log("q");
// 			//console.log("start:");
// 			//console.log(this_game);
// 			console.log(this_game);
// 			add(this_game);
			
// 			/*switch_turn(this_game);
// 			save_to_game(recordedMovements, this_game);
// 			console.log("?");
// 			*/
// 			//window.location.href = "/games?session="+session;
			
// 			//console.log(data.games);
// 			//loadGames(user,data.games,session);
// 		},
// 		//fail : function(data) {
// 		//	console.log("failed :( : " + data);
// 	});	
// }

// 	//var current_user = get_user(session);
// 	//return 

// function parseUrlInfo(){
// 	var url = window.location.href;
// 	var indexOfId = url.indexOf("/play/");
// 	var indexOfSession = url.indexOf("?session=");
// 	gameId = url.substring(indexOfId+6, indexOfSession);
// 	session = url.substring(indexOfSession+9);
// 	console.log("session: " + session);
// 	console.log("gameId: " + gameId);
// }

// function switch_turn(game){
// 	var current_turn = game["turn"];
// 	var players = game["users"];
// 	if (current_turn === players[0]){
// 		game["turn"] = players[1];
// 	}
// 	else{
// 		game["turn"] = players[0];
// 	}
	
// }

// function save_to_game(recordedMovements, game){
// 	//console.log("WHAT?");
// 	game["imageList"].push(recordedMovements);
// 	//console.log(game);
// }
/*				
$(document).ready(function() {
    //get();
  });*/
