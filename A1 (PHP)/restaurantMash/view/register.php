<?php
$_REQUEST['user']=!empty($_REQUEST['user']) ? $_REQUEST['user'] : '';
$_REQUEST['password']=!empty($_REQUEST['password']) ? $_REQUEST['password'] : '';
$_REQUEST['firstName']=!empty($_REQUEST['firstName']) ? $_REQUEST['firstName'] : '';
$_REQUEST['lastName']=!empty($_REQUEST['lastName']) ? $_REQUEST['lastName'] : '';
$_REQUEST['email']=!empty($_REQUEST['email']) ? $_REQUEST['email'] : '';
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="style.css" />
		<meta HTTP-EQUIV="Pragma" CONTENT="no-cache"> 
		<meta HTTP-EQUIV="Expires" CONTENT="-1">

		<title>RestaurantMash</title>
	</head>
	<body>
		<header><h1>RestaurantMash</h1></header>
		<main>
			<h2>Registration</h2>
			<form action="index.php" method="post">
				<fieldset>
				<legend>Register</legend>
				<table>
					<!-- Register new user with HTML validation -->
					<tr><th><label for="user">Username: </label></th><td><input type="text" name="user" pattern="[A-Za-z0-9]{4,}" title="(alpha-numeric, Must contain at least 4 characters)" required value="<?php echo($_REQUEST['user']); ?>" /></td></tr>
					<tr><th><label for="password">Password: </label></th><td> <input type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}" title="Must contain at least one number, one uppercase and lowercase letter, and at least 4 or more characters" name="password" required value="<?php echo($_REQUEST['password']); ?>"/></td></tr>
					<tr><th><label for="firstName">First Name: </label></th><td> <input type="text" name="firstName" pattern="[A-Za-z]{1,}" required value="<?php echo($_REQUEST['firstName']); ?>"/></td></tr>
					<tr><th><label for="lastName">Last Name: </label></th><td> <input type="text" name="lastName" pattern="[A-Za-z]{1,}" required value="<?php echo($_REQUEST['lastName']); ?>"/></td></tr>
					<tr><th><label for="email">Email: </label></th><td> <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" name="email" required value="<?php echo($_REQUEST['email']); ?>" /></td></tr>

					<tr><th>&nbsp;</th><td><input type="submit" name="submit" value="Register" /></td></tr>
					<tr><th>&nbsp;</th><td><a href="?operation=goBack"/>Go Back</a></td></tr>
					<tr><th>&nbsp;</th><td><?php echo(view_errors($errors)); ?></td></tr>
				</table>
				</fieldset>
			</form>
		</main>
		<footer>
		</footer>
	</body>
</html>