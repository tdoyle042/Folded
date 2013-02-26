$(window).ready(function() {
	$("#register").click(function(){createAccount();});
	return false;
});

function createAccount() {
	var name = $("#realName").val();
	var username = $("#username").val();
	var password = $("#password").val();

	$.ajax({
		type : "post",
		url : "/register",
		data : {
			"username" : username,
			"password" : password,
			"realName" : name
		},
		error : function (error) {
			//console.log(error);
			$("#errors").html("" + error.responseText);
		},
		success : function (data) {
			window.location.href = "/games?session=" + data.session;
		},
	});
}