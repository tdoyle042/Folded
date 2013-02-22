var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;

canvas.addEventListener('mousedown', onMouseDown, false); 
canvas.addEventListener('mouseup', onMouseUp, false); 
canvas.addEventListener('mousemove', onMouseMove, false); 
canvas.addEventListener ("mouseout", onMouseOut, false);

var recordedMovements = [];

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function loadRecordedDrawings() {
  for (var i = 0; i < recordedMovements.length; i++) { 
    var movement = recordedMovements[i];
    var x = movement["x"];
    var y = movement["y"];
    if (movement["event"] === "MouseDown") {
      ctx.moveTo(x, y);
    }
    else {
      var color = movement["color"];
      ctx.lineTo(x,y);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x,y);
    }
  }
}

function onMouseDown(event){
	//console.log("trace2");
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
		//console.log("trace3");
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		//ctx.fillStyle = "#000000";
		canvas.mixed_color = "rgb(" + slider1.color_val + "," + slider2.color_val + "," + slider3.color_val + ")";

    ctx.lineTo(x,y);
		//console.log(ctx.strokeStyle);
		ctx.strokeStyle = canvas.mixed_color;
		console.log(canvas.mixed_color);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x,y);
		
    var drawingRecord = new Object();
    drawingRecord["x"] = x;
    drawingRecord["y"] = y; 
    drawingRecord["color"] = canvas.mixed_color;
    drawingRecord["event"] = "MouseMove";
    recordedMovements.push(drawingRecord);

    /*for (var i = 0; i < recordedMovements.length; i++) {
      var movement = recordedMovements[i];
      var i_x = movement["x"];
      var i_y = movement["y"];
      var i_color = movement["color"];
      console.log(i_x, i_y, i_color);
    }*/    
	}
}

function onMouseUp(event){
	drawing = false;
}


function onMouseOut(event){
	drawing = false;
}

//init_sliders();
//canvas.mixed_color = "rgb(" + slider1.color_val + "," + slider2.color_val + "," + slider3.color_val + ")";

/*
function inside_canvas(x, y){
	var left_bound = canvas.offsetLeft;
	var right_bound = left_bound + canvas.width;
	var top_bound = canvas.offsetTop;
	var bottom_bound = top_bound + canvas.height;
	if ((x > right_bound) || (x < left_bound)){
		return false;
	}
	if ((y > bottom_bound) || (y < top_bound)){
		return false;
	}
	return true;
}
*/
