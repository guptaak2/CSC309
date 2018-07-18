$(document).ready(function() {	
	//Goes to Game View and hides the appropiate views
    $('#gameNavButton').click(function() {
        $('#registerView').hide();
        $('#mainView').hide();
        $('#profileView').hide();
		$('#gameView').show();
    });
	
	//Goes to the Edit Profile View, and pause the game
	$('#profileNavButton').click(function() {
		autoFillProfile();
        $('#registerView').hide();
        $('#mainView').hide();
        $('#profileView').show();
		$('#gameView').hide();
    });
	
	//Logs out the User, and reloads the page
	$('#logoutNavButton').click(function() {
        location.reload();
    });

	//Goes to Register View from Login View
    $('#registerButton').click(function() {
        $('#registerView').show();
        $("#topTenView").hide();
        $('#mainView').hide();
    });

	//Goes back to Login view from Register View
    $('#goBackLogin').click(function() {
        $('#registerView').hide();
        $("#topTenView").show();
        $('#mainView').show();
    });
});

function topTen(){
	var request = $.ajax({
		url: "/api/topTen/",
		method: "GET",
		contentType: "application/json; charset=UTF-8",
	});

	request.done(function(data, text_status, jqXHR) {
		console.log(text_status);
		console.log(jqXHR.status);
		var obj = JSON.parse(data);
		for (i = 0; i < 10; i++) {
			document.getElementById("row" + (i+1) + "").value = obj[i].id + ": " + obj[i].score;
		}
	});

		request.fail(function(err) { 
			debugger;
			alert(JSON.stringify(err.responseJSON));
			console.log(err.status);
			console.log(JSON.stringify(err.responseJSON));
	});	
}

function topThree(){
	var username = document.getElementById('usernameDisplay').value.toLowerCase();	
	var request = $.ajax({
		url: "/api/topThree/"+username,
		method: "GET",
		contentType: "application/json; charset=UTF-8",
	});

	request.done(function(data, text_status, jqXHR) {
		console.log(text_status);
		console.log(jqXHR.status);
		var obj = JSON.parse(data);
		for (i = 0; i < 3; i++) {
			document.getElementById("topThree" + (i+1) + "").value = obj[i].score;
		}
	});

		request.fail(function(err) {
		alert(JSON.stringify(err.responseJSON));
		console.log(err.status);
		console.log(JSON.stringify(err.responseJSON));
	});
}

function saveScore(score){
	var username = document.getElementById('usernameDisplay').value.toLowerCase();
	var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
    if (username == "") {
        alert("Missing Required Information");
    } else {
        if (!pattern.test(username)) {
            alert("alpha-numeric only");
        } else {
			var request = $.ajax({
				url: "/api/saveScore/",
				method: "PUT",
				data: JSON.stringify({
					username: username,
					score: score
				}),
				contentType: "application/json; charset=UTF-8",
			});
			
			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
			});

			request.fail(function(err) {
				if (err.responseJSON.status){
					alert("Failed to Update Score");
				}
				alert(JSON.stringify(err.responseJSON));
				console.log(err.status);
				console.log(JSON.stringify(err.responseJSON));
			});
		}
	}
}

function autoFillProfile(){
	var username = document.getElementById('usernameDisplay').value.toLowerCase();
	var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
    if (username == "") {
        alert("Missing Required Information");
    } else {
        if (!pattern.test(username)) {
            alert("alpha-numeric only");
        } else {

            var request = $.ajax({
				url: "/api/autoFill/"+username,
				method: "GET",
				contentType: "application/json; charset=UTF-8",
			});

			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
				document.getElementById("passwordProfile").value = data["password"];
				document.getElementById("firstNameProfile").value = data["firstName"];
				document.getElementById("lastNameProfile").value = data["lastName"];
				document.getElementById("emailProfile").value = data["email"];
			});

			request.fail(function(err) {
				if (err.responseJSON.status){
					alert("Failed Autofill");
				}
				alert(JSON.stringify(err.responseJSON));
				console.log(err.status);
				console.log(JSON.stringify(err.responseJSON));
			});
        }
	}
}

function login() {
	
    var username = document.getElementById('usernameLogin').value.toLowerCase();
    var password = document.getElementById('passwordLogin').value;
	
    var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
	
    if (username == "") {
		$('#usernameLogin').css({"outline":"solid red", "color":"yellow"})
		alert("Missing username field");
	} else if (password == ""){
		$('#passwordLogin').css({"outline":"solid red", "color":"yellow"})
		alert("Missing password field")
    } else {
        if (!pattern.test(username)) {
            alert("alpha-numeric only");
        } else {
            var request = $.ajax({
				url: "/api/login",
				method: "POST",
				data: JSON.stringify({
					username: username,
					password: password
				}),
				contentType: "application/json; charset=UTF-8",

			});

			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
				alert("Login was Successful");
				setupGame();
				$('#usernameDisplay').html(username);
				$("#navBar").show();
				$("#mainView").hide();
				$("#gameView").show();
				$("#topTenHighScores").hide();
				topThree();
				document.getElementById("headerImg").style.width = '20%';
				
			});

			request.fail(function(err) {
				if (err.responseJSON.status){
					alert(err.responseJSON.status);
				}
				console.log(err.status);
				alert(JSON.stringify(err.responseJSON));
				console.log(JSON.stringify(err.responseJSON));
				$('#usernameLogin').css({"outline":"solid red"})
				$('#usernameLogin').css({"color":"yellow"})

			});
        }
    }
}

function editProfile(){
	var username = document.getElementById("usernameProfile").value;
	var password = document.getElementById("passwordProfile").value;
	var firstName = document.getElementById("firstNameProfile").value;
	var lastName = document.getElementById("lastNameProfile").value;
	var email = document.getElementById("emailProfile").value;
	
	
	var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
	var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/);

	
	if (username == "" || password == "" || firstName == "" || lastName == "" || email == "") {
		alert("Missing Required Information");
		if (username == "") {
			$('#usernameProfile').css({"outline":"solid red", "color":"yellow"});
		}else if (password == ""){
			$('#passwordProfile').css({"outline":"solid red", "color":"yellow"});
		}else if (firstName == "" || !pattern.test(firstName)){
			$('#firstNameProfile').css({"outline":"solid red", "color":"yellow"});
		}else if (lastName == "" || !pattern.test(lastName)){
			$('#lastNameProfile').css({"outline":"solid red", "color":"yellow"});
		}else if (email == "" || !emailPattern.test(email)){
			$('#emailProfile').css({"outline":"solid red", "color":"yellow"});
		}
	} else {
		if (!pattern.test(firstName) || !pattern.test(lastName)) {
			alert("alpha-numeric only");
		} else if (!emailPattern.test(email)) {
			$('#emailProfile').css({"outline":"solid red", "color":"yellow"});
			alert("please enter a valid email address");
		} else {
			var request = $.ajax({
				url: "/api/profile",
				method: "POST",
				data: JSON.stringify({
					username: username,
					password: password,
					firstName: firstName,
					lastName: lastName,
					email: email
				}),
				contentType: "application/json; charset=UTF-8",

			});

			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
				alert("profile successfully updated");
			});

			request.fail(function(err) {
				alert("profile update failed");
				console.log(err.status);
				console.log(JSON.stringify(err.responseJSON));
			});
		}
	}
}

function deleteProfile(){
	var username = document.getElementById("usernameDisplay").value;
	var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
			
    if (username == "") {
        alert("Missing Required Information");
    } else {
        if (!pattern.test(username)) {
            alert("alpha-numeric only");
        } else {
            var request = $.ajax({
				url: "/api/deleteAccount/"+username,
				method: "DELETE",
				data: JSON.stringify({
					username: username
				}),
				contentType: "application/json; charset=UTF-8",
			});

			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
				alert("Your account has been deleted");
				location.reload();
				
			});

			request.fail(function(err) {
				console.log(err.status);
				alert(JSON.stringify(err.responseJSON));
				console.log(JSON.stringify(err.responseJSON));
			});
        }
    }
}

function register(){
	
	//Initialize the variables and fetch the values from index.html
	var username = document.getElementById("usernameRegister").value;
	var password = document.getElementById("passwordRegister").value;
	var firstName = document.getElementById("firstNameRegister").value;
	var lastName = document.getElementById("lastNameRegister").value;
	var email = document.getElementById("emailRegister").value;
	
	document.getElementById("usernameDisplay").value = username;
	document.getElementById("usernameProfile").value = username;

	var pattern = new RegExp(/^[a-zA-Z0-9]{0,20}$/);
	var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/);
	
	if (username == "" || password == "" || firstName == "" || lastName == "" || email == "") {
		alert("Missing Required Information");
		if (username == "" || !pattern.test(username)) {
			$('#usernameRegister').css({"outline":"solid red", "color":"yellow"});
		}else if (password == ""){
			$('#passwordRegister').css({"outline":"solid red", "color":"yellow"});
		}else if (firstName == "" || !pattern.test(firstName)){
			$('#firstNameRegister').css({"outline":"solid red", "color":"yellow"});
		}else if (lastName == "" || !pattern.test(lastName)){
			$('#lastNameRegister').css({"outline":"solid red", "color":"yellow"});
		}else if (email == "" || !emailPattern.test(email)){
			$('#emailRegister').css({"outline":"solid red", "color":"yellow"});
		}
	} else {
		if (!pattern.test(username) || !pattern.test(lastName) || !pattern.test(firstName)) {
			alert("alpha-numeric only");
		} else if (!emailPattern.test(email)) {
			alert("please enter a valid email address");
		} else {
			var request = $.ajax({
				url: "/api/register",
				method: "PUT",
				data: JSON.stringify({
					username: username,
					password: password,
					firstName: firstName,
					lastName: lastName,
					email: email
				}),
				contentType: "application/json; charset=UTF-8",
			});

			request.done(function(data, text_status, jqXHR) {
				console.log(text_status);
				console.log(jqXHR.status);
				var returned = JSON.stringify(data);
				alert("Registration was Successful");
				setupGame();
				$('#usernameDisplay').html(username);
				$("#navBar").show();
				$("#mainView").hide();
				$("#gameView").show();
				$("#topTenHighScores").hide();
				$("#registerView").hide();
				topThree();
				document.getElementById("headerImg").style.width = '20%';
			});

			request.fail(function(err) {
				alert("username already exists");
				usernameColour.style.backgroundColor = 'red';
				usernameColour.style.color = 'yellow';
				console.log(err.status);
				console.log(JSON.stringify(err.responseJSON));
			});
		}
	}
}