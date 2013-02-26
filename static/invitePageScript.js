var inviter = "ben";

$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").val();
		var inputPassword = $("#password").val();
		login(inputUsername,inputPassword);
	});
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