var canvas2 = document.getElementById("final_image");
var final_ctx = canvas2.getContext("2d");
var images = [];


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
}

function merge_images() {
	//get();
	var canvas_height = 300; //height of the canvases from each player turn
	for (var i = 0; i < images.imageList.length; i++) {
		var current_image = images.imageList[i]["recordedMovements"];
		for (var j = 0; j < current_image.length; j++){
			var this_move = current_image[j];
			var y_offset = i * canvas_height;
			this_move["y"] = String(parseInt(this_move["y"]) + y_offset);
		}
	}
	for (var image_index = 0; image_index < 4; image_index++){
		loadRecordedDrawings(image_index, final_ctx);
	}
}


function loadRecordedDrawings(image_index, context) {
  if (images === undefined) return ;
  //console.log("trace10");
  console.log("images: " + images);
  if ((image_index >= 0) && (image_index < (images.imageList.length))){
	var this_image = images.imageList[image_index];
  }
  else{
	console.log("index: " + image_index);	
	console.log("invalid image");
	return;
  }
  recordedMovements = this_image["recordedMovements"];
  //console.log("attempt: " + recordedMovements.length);
  for (var i = 0; i < recordedMovements.length; i++) { 
    ////console.log(i);
	var movement = recordedMovements[i];
    var x = movement["x"];
    var y = movement["y"];
    if (movement["event"] === "MouseDown") {
      context.moveTo(x, y);
    }
    else {
      var color = movement["color"];
      context.lineTo(x,y);
      context.strokeStyle = color;
      context.stroke();
      context.beginPath();
      context.moveTo(x,y);
    }
  }
}

get();