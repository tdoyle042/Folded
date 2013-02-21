var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;

canvas.addEventListener('mousedown', onMouseDown, false); 
canvas.addEventListener('mouseup', onMouseUp, false); 
canvas.addEventListener('mousemove', onMouseMove, false); 
canvas.addEventListener ("mouseout", onMouseOut, false);


/*
function draw_line(start_x, start_y, end_x, end_y) {

	ctx.strokeStyle = "#0000FF";
	ctx.beginPath();
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(end_x, end_y);
	ctx.stroke();
	ctx.moveTo(end_x, end_y);

}*/

function onMouseDown(event){
	//console.log("trace2");
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	ctx.moveTo(x, y);
	drawing = true;	
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
