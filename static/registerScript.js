var invite;

$(window).ready(function() {
	$("#register").click(function(){createAccount();});
	invite = parseInviteInfo();
	
	//return false;
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
			if(invite === null)
				window.location.href = "/games?session="+data.session;
			else {
				var session = data.session;
				console.log("invite not null!");
				$.ajax({
					type : "post",
					url : "/invite",
					data : {
						"invite" : invite,
						"session": session
					},
					success : function(data){
						console.log("Accepted invite successfully!");
						window.location.href = "/games?session="+session;
					}
				})
			
			}
			
		},
		fail : function(data) {
			console.log("failed to login :(");
		}
	});
}


/////////
function parseInviteInfo(){
	var url = window.location.href;
	var indexOfInvite = url.indexOf("?invite="); 

	if(indexOfInvite === -1) 
		return null;
	var invite = Number(url.substring(indexOfInvite+8));	
	if(invite === NaN)
		return null;
	else
		return invite;
}