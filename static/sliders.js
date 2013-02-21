/*
var slider1 = document.getElementById("slider1");
var ctx1=slider1.getContext("2d");


var slider2 = document.getElementById("slider2");
var ctx2=slider2.getContext("2d");

//var dragging = false;

var color_1 = "#00ff00";
var color_2 = "#ff0000";
*/
function draw_triangles(selector_top, context, selector_height, slider) {
	var tri_top_y = selector_top + (selector_height * (3/8));
	var tri_top_x = 0;
	var tri_middle_y = selector_top + (selector_height/2);
	var tri_middle_x = slider.width/2;
	var tri_bottom_x = 0
	var tri_bottom_y = tri_top_y + (1/4);	
	context.moveTo(tri_top_x, tri_top_y);
	context.lineTo(tri_middle_x, tri_middle_y);
	context.moveTo(tri_middle_x, tri_middle_y);
	context.lineTo(tri_bottom_x, tri_bottom_y);
	context.moveTo(tri_bottom_x, tri_bottom_y);
	context.lineTo(tri_top_x, tri_top_y);
	context.moveTo(tri_top_x, tri_top_y);
	context.fillStyle = "#fff";
	context.fill();
}

function make_slider(slider, context, color) {
	slider.dragging = false;
	slider.color = color;
	slider.color_val = 0;
	//TODO: Make cursor_position 0 be bottom of slider rather than top
	slider.selector = 	function(cursor_position) {
							var selector_height = 45;
							var top = cursor_position - (selector_height/2);
							var bottom = top + selector_height;
							if (bottom >= (slider.height)){
								bottom = slider.height;
								top = bottom - selector_height;
							}
							else if (top <= 0){
								top = 0;
								bottom = selector_height;
								
							}
							context.beginPath();
							context.strokeStyle = "#ffffff";
							context.moveTo(0,top);
							
							context.lineTo(25, top); //top line
							context.moveTo(25, top);
							
							context.lineTo(25, bottom); //right line
							context.moveTo(25, bottom);
							
							context.lineTo(0, bottom); //bottom line
							context.moveTo(0, bottom);	
							
							context.lineTo(0,top);	//left line
							context.lineWidth=5;
							context.stroke();
							draw_triangles(top, context, selector_height, slider);
							slider.color_val = Math.floor(255 - top);
							//console.log(top);
						}		
	slider.draw_gradient = 	function(){
								var grd= context.createLinearGradient(0,0,0,300);
								grd.addColorStop(1,"black");
								grd.addColorStop(0,color);
								context.fillStyle=grd;
								context.fillRect(0,0,25,300);
							}	
	slider.onMouseDown = 	function(event) {
								//console.log(slider);
								var x = event.pageX - slider.offsetLeft;
								var y = event.pageY - slider.offsetTop;
								slider.draw_gradient(color);
								slider.selector(y);
								slider.dragging = true;
							}							
	slider.onMouseUp = 	function(event){
							slider.dragging = false;
						}
	slider.onMouseMove = function(event){
								if (slider.dragging) {
									var x = event.pageX - slider.offsetLeft;
									var y = event.pageY - slider.offsetTop;
									slider.draw_gradient(color);
									slider.selector(y);
								}
							}
	slider.onMouseOut = function(event) {
							slider.dragging = false;
						}
	slider.events = function() {
						slider.addEventListener('mousedown', slider.onMouseDown, false);
						slider.addEventListener('mouseup', slider.onMouseUp, false); 
						slider.addEventListener('mousemove', slider.onMouseMove, false);
						slider.addEventListener ("mouseout", slider.onMouseOut, false);
					}
	slider.init = 	function() {
						slider.draw_gradient(color);
						slider.events();
						slider.selector(255 + 22.5);
					}
	slider.init();
}

function init_sliders() {
	var slider1 = document.getElementById("slider1");
	var ctx1=slider1.getContext("2d");
	var slider2 = document.getElementById("slider2");
	var ctx2=slider2.getContext("2d");
	var slider3 = document.getElementById("slider3");
	var ctx3 =slider3.getContext("2d");
	var color1 = "#ff0000";
	var color2 = "#00ff00";
	var color3 = "#0000ff";
	make_slider(slider1, ctx1, color1);
	make_slider(slider2, ctx2, color2);
	make_slider(slider3, ctx3, color3);
	
	//slider1.draw_gradient();
	//slider2.draw_gradient();
	//slider3.draw_gradient();
	// slider1.selector(0);
	// slider2.selector(0);
	// slider3.selector(0);
}



init_sliders();
canvas.mixed_color = "rgb(" + slider1.color_val + "," + slider2.color_val + "," + slider3.color_val + ")";