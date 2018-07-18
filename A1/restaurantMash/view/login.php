<?php
// So I don't have to deal with unset $_REQUEST['user'] when refilling the form
$_REQUEST['user']=!empty($_REQUEST['user']) ? $_REQUEST['user'] : '';
$_REQUEST['password']=!empty($_REQUEST['password']) ? $_REQUEST['password'] : '';
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="style.css" />
		<title>RestaurantMash</title>
	</head>
	<body>
		<header><h1>RestaurantMash</h1></header>
		<main>
			<h1>Login</h1>
			<form action="index.php" method="post">
				<fieldset>
				<legend>Login</legend>
				<table>
					<!-- Log in user with HTML validation -->
					<tr><td><input type="text" name="user" required placeholder="Username" title="(alpha-numeric, Must contain at least 4 characters)" pattern="[A-Za-z0-9]{4,}" value="<?php echo($_REQUEST['user']); ?>" /></td></tr>
					<tr><td> <input type="password" required placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" name="password" /></td></tr>
					<tr><td><input type="submit" name="submit" value="Login" /></td></tr>
					<tr><td><?php echo(view_errors($errors)); ?></td></tr>
				</table>
			</form>
			<a href="?operation=register">New Member</a>
		</main>
		<footer>
		</footer>
	</body>
</html>