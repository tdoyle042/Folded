var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;
var saved_commands = [];

canvas.addEventListener('mousedown', onMouseDown, false); 
canvas.addEventListener('mouseup', onMouseUp, false); 
canvas.addEventListener('mousemove', onMouseMove, false); 
canvas.addEventListener ("mouseout", onMouseOut, false);

var images;
var recordedMovements = [];

function get() {
    $.ajax({
      type: "get",
      url: "/images",
      success: function(data) {
        images = images;
      }
    });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recordedMovements = [];
  get();
}

function add(){
	console.log(images);
	if (recordedMovements === []) return;
	$.ajax({
		type: "post",
		data: {"recordedMovements": recordedMovements},
		url: "/images",
		success: function(data) { }
	});
}

function saveImage() {
	add();
	get();
}

function onMouseDown(event){
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
		ctx.strokeStyle = canvas.mixed_color;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x,y);
		
		var drawingRecord = new Object();
		drawingRecord["x"] = x;
		drawingRecord["y"] = y; 
		drawingRecord["color"] = canvas.mixed_color;
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

function final_merge(){
	var userID = "ben";
	var gameID = "0"; //placeholder variables
	console.log("trace2");
	window.location = "/share/" + userID + "/" + gameID;
	merge_images();
}
				
$(document).ready(function() {
    get();
  });
