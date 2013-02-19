/* Javascript for the client home page */


$(window).ready(function(){
	console.log("ready!");
	var canvas = $("#myCanvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.fillRect(10,10,50,50);
})

function saveCanvas() {
	var canvas = $("#myCanvas")[0];
	var ctx = canvas.getContext("2d");
	canvasImage = canvas.toDataURL("image/jpeg");
	
	// $.ajax({
	// 	type: "post",
	// 	url: "/saveImage",
	// 	data: {
	// 		"poop": "dollar"
	// 		// id: 0,
	// 		// image: canvasImage
	// 	},
	// 	// processData:false,
	// 	sucess: function(data) {
	// 		console.log("Attempted to send data");
	// 	},
	// 	error: function (err) {
	// 		console.log("fuck this", err);
	// 	}
	// });
	
	$.post("/saveImage", {id: 0, image: canvasImage}, function (data) {
		console.log(data);
	});

	$.get("/getImage", function(data) {
		console.log(data.image);
	});


	


}
