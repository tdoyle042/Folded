$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").val();
		var inputPassword = $("#password").val();
		login(inputUsername,inputPassword);
	});

	$("#register").click(function(){
		window.location.href="/register";
	})
});

function login(username,password) {
	$.ajax({
		type : "post",
		url : "/login",
		data : {"username" : username,
				"password" : password},
		success : function(data) {
			console.log("got in!");
			var session = data.session;
			window.location.href = "/games?session="+session;
		},
		fail : function(data) {
			console.log("failed to login :(");
		}
	});
}