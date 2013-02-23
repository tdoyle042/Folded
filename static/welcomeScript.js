$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").val();
		var inputPassword = $("#password").val();
		login(inputUsername,inputPassword);
	});
});

function login(username,password) {
	////console.log('hey evan');
	$.ajax({
		type : "post",
		url : "/login",
		data : {"username" : username,
				"password" : password},
		success : function(data) {
			window.location = "static/home.html";
			//console.log(window.location);
		},
		/*beforeSend : function(data) {
				for (var i = 0; i < 100; i++) {
					//console.log(data);
				}
		},*/
		
		/*fail : function(data) {
			alert("fail!!");
		}*/
		
	});
}