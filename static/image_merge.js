var canvas2 = document.getElementById("final_image");
var final_ctx = canvas2.getContext("2d");

//var images = [];
var game;

/*
function get() {
    $.ajax({
      type: "get",
      url: "/images",
      success: function(data) {
        images = data.images;
		console.log(images);
		merge_images();
      }
    });
}*/

function get_game(){
	var url = window.location.href;
	var indexOfUser = url.indexOf("?user=");
	var indexOfGameId = url.indexOf("&gameId=");
	var user = url.substring(indexOfUser+6,indexOfGameId);
	console.log(user);
	var gameId = url.substring(indexOfGameId+8);
	$.ajax({
		type: "get",
		data: {"session" : user},
		url : "/user/games/",
		success : function(data){
			console.log("working");
			var this_game = data.games[gameId];
			user = data.user;
			merge_images(this_game);
		},
		error : function(data) {
			$("#final_image").hide();
			var errormessage = $("<h1>").html("Error!");
			errormessage.append($("<h3>").html("Invalid Request. Please <a href='/'>Login</a> again."));
			$("#content").append(errormessage);
		}

	//var session = Number(givenSession);
	//get array of all games, use URL for info
	})
}


function merge_images(this_game) {
	game = this_game;
	console.log("this_game:" + this_game);
	var game_images = this_game["imageList"];
	//console.log("game_images: " + game_images);
	//console.log("first image: " + game_images[0]);
	console.log(game_images[0]);
	var canvas_height = 300; //height of the canvases from each player turn
	console.log("game_images_length:" + game_images.length);
	for (var imageNum = 0; imageNum < game_images.length; imageNum++) {
		var current_image = game_images[imageNum];
		console.log("current_images:" + current_image);
		for (var commandNum = 0; commandNum < current_image.length; commandNum++){
			var this_command = current_image[commandNum];
			var y_offset = imageNum * canvas_height;
			this_command["y"] = String(parseInt(this_command["y"]) + y_offset);
		}
	}
	for (var imageNum = 0; imageNum < game_images.length ; imageNum++){
		loadRecordedDrawings(imageNum, final_ctx, game_images);
	}
}


function loadRecordedDrawings(imageNum, context, game_images) {
  //if (images === undefined) return ;
  //console.log("images: " + images);
  if ((imageNum >= 0) && (imageNum < (game_images.length))){
	var this_image = game_images[imageNum];
  }
  else{
	console.log("index: " + imageNum);	
	console.log("invalid image");
	return;
  }
  recordedMovements = this_image;
  for (var commandNum = 0; commandNum < recordedMovements.length; commandNum++) { 
	var movement = recordedMovements[commandNum];
    var x = movement["x"];
    var y = movement["y"];
    if (movement["event"] === "MouseDown") {
      context.moveTo(x, y);
    }
    else {
      var color = movement["color"];
      var lineWidth = movement["lineWidth"];
      context.lineTo(x,y);
      context.lineCap = 'round';
      context.lineWidth = lineWidth;
      context.strokeStyle = color;
      context.stroke();
      context.beginPath();
      context.moveTo(x,y);
    }
  }
}

console.log("this is a test");
get_game();
//get();
