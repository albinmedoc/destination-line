$(document).ready(function() {
	$('#register').on('submit', function(event) {
		$.ajax({
			data : {
                firstname : $('#firstname').val(),
                lastname : $('#lastname').val(),
                username : $('#username').val(),
                email : $('#email').val(),
                password1 : $('#password1').val(),
                password2 : $('#password2').val()
			},
			type : 'POST',
			url : '/register'
		})
		.done(function(data) {
			if (data.result == true) {
                window.location.href = "#login";
                alert("Welcome to Destination Line!");
            }
            else if (data.result == "password_no_valid"){
                alert("Passwords didn't match");
            }
			else {
				alert("Username or email already taken.");
			}
		});
		event.preventDefault();
    });
    $('#login').on('submit', function(event) {
		$.ajax({
			data : {
                username : $('#login_username').val(),
                password : $('#login_password').val()
			},
			type : 'POST',
			url : '/login'
		})
		.done(function(data) {
			if (data.result == true) {
                window.location.href = "/";
                alert("You are now logged in!");
			}
			else if (data.result == false) {
				alert("Wrong username or password");
			}
		});
		event.preventDefault();
	});
});