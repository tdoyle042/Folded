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
	var indexOfUser = url.indexOf("user");
	var indexOfGameId = url.indexOf("gameId");
	var user = url.substring(indexOfUser+4, indexOfGameId-1);
	console.log(user);
	var gameId = url.substring(indexOfGameId+6);
	$.ajax({
		type: "get",
		data: {"session" : user},
		url : "/user/games/",
		success : function(data){
					console.log("working");
					var this_game = data.games[gameId];
					user = data.user;
					merge_images(this_game);
					}
	//var session = Number(givenSession);
	//get array of all games, use URL for info
	})
}


function merge_images(this_game) {
	game = this_game;
	console.log("this_game:" + this_game);
	var game_images = this_game["imageList"];
	console.log("game_images:" + game_images);
	var canvas_height = 300; //height of the canvases from each player turn
	console.log("game_images_length:" + game_images.length);
	for (var i = 0; i < game_images.length; i++) {
		
		var current_image = game_images[i]["recordedMovements"];
		console.log("current_images:" + current_image);
		for (var j = 0; j < current_image.length; j++){
			var this_move = current_image[j];
			var y_offset = i * canvas_height;
			this_move["y"] = String(parseInt(this_move["y"]) + y_offset);
		}
	}
	for (var image_index = 0; image_index < 4; image_index++){
		loadRecordedDrawings(image_index, final_ctx, game_images);
	}
}


function loadRecordedDrawings(image_index, context, game_images) {
  //if (images === undefined) return ;
  //console.log("images: " + images);
  if ((image_index >= 0) && (image_index < (game_images.length))){
	var this_image = game_images[image_index];
  }
  else{
	console.log("index: " + image_index);	
	console.log("invalid image");
	return;
  }
  recordedMovements = this_image["recordedMovements"];
  for (var i = 0; i < recordedMovements.length; i++) { 
	var movement = recordedMovements[i];
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
