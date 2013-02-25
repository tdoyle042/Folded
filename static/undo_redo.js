function undo() {
	if (recordedMovements.length === 0) return;
	var index = recordedMovements.length-1;
	var undone_commands = [];;
	while (index >= 0){		
		var this_command = recordedMovements[index];
		if (this_command["event"] === "MouseDown"){
			undone_commands.push(this_command);
			undone_commands.reverse();
			saved_commands = saved_commands.concat(undone_commands);
			recordedMovements.pop();
			redraw();
			return;
		}
		else{
			undone_commands.push(this_command);
			recordedMovements.pop();
			index--;
		}
	}
}

function redo() {
	if (saved_commands.length === 0) return;
	saved_commands.reverse();
	for (var i = 0; i < saved_commands.length; i++){
		var command = saved_commands[i];
		if (command["event"] === "MouseDown"){
			var redone_commands = saved_commands.splice(0, i+1);			
			redone_commands = redone_commands.reverse();
			recordedMovements = recordedMovements.concat(redone_commands);
			saved_commands.reverse();
			redraw();
			return;
		}
	}
}

//clears canvas, then draws again with current recordedMovements
function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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