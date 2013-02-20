var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;

canvas.addEventListener('mousedown', onMouseDown, false); 
canvas.addEventListener('mouseup', onMouseUp, false); 
canvas.addEventListener('mousemove', onMouseMove, false); 
canvas.addEventListener ("mouseout", onMouseOut, false);



function draw_line(start_x, start_y, end_x, end_y) {

	ctx.strokeStyle = "#0000FF";
	ctx.beginPath();
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(end_x, end_y);
	ctx.stroke();
	ctx.moveTo(end_x, end_y);

}

function onMouseDown(event){
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	ctx.moveTo(x, y);
	drawing = true;

	
}

function onMouseMove(event){
	if (drawing) {
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;

		ctx.lineTo(x,y);
		ctx.stroke();
		ctx.moveTo(x,y);
		
	}
}

function onMouseUp(event){
	drawing = false;
}


function onMouseOut(event){
	drawing = false;
}

