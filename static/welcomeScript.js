$(document).ready(function() {
	$("#login").click(function(){
		var inputUsername = $("#username").value();
		var inputPassword = $("#password").value();
		login(inputUsername,inputPassword);
	});
});

function login(username,password) {
	$.ajax({
		type : "get",
		url : "/login",
		data : {"username" : username,
				"password" : password},
		sucess : function(data) {
			alert("success!");
		},
		fail : function(data) {
			alert("fail!!");
		}
	});
}