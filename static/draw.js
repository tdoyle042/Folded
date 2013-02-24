var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var drawing = false;

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
	//get();
	if (recordedMovements === []) return;
	//console.log("trace6");
	$.ajax({
		type: "post",
		data: {"recordedMovements": recordedMovements},
		url: "/images",
		success: function(data) { }
	});
	////console.log("trace9");
}

function saveImage() {
	add();
	get();
}

function onMouseDown(event){
	////console.log("trace2");
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
		////console.log("trace3");
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		//ctx.fillStyle = "#000000";
		canvas.mixed_color = "rgb(" + slider1.color_val + "," + slider2.color_val + "," + slider3.color_val + ")";

		ctx.lineTo(x,y);
		////console.log(ctx.strokeStyle);
		ctx.strokeStyle = canvas.mixed_color;
		////console.log(canvas.mixed_color);
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
		  //console.log(i_x, i_y, i_color);
		}*/    
	}
}

function onMouseUp(event){
	drawing = false;
}


function onMouseOut(event){
	drawing = false;
}

function final_merge(){
	var user = "ben";
	var gameID = "0"; //placeholder variables
	//window.location = "/static/final_image/" + gameID;
	console.log("trace2");
	window.location = "/static/final_image_page.html";
	console.log("almost...");
	merge_images();
	/*var url_foo = "/static/finalImage";
	$.ajax({
		type: "get",
		url: url_foo,
		//data: { "id" : 1},
		success: function(url) {
					console.log("trace3");
					window.location = url;
					merge_images();
		}, 
		error: function(){
			console.log("url: " + url_foo);
		}
	});*/
}
				
	//window.location = "/share/final_image/" + gameID;
	

$(document).ready(function() {
    get();
  });
