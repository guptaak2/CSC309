<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="style.css" />
		<title>RestaurantMash</title>
	</head>
	<body>
		<header><h1>RestaurantMash</h1></header>
		<nav>
			<ul>
				<li class="selected"> <a href="?operation=profile">Profile</a>
				<li> <a href="?operation=compete">Compete</a>
				<li> <a href="?operation=results">Results</a>
				<li> <a href="?operation=logout">Logout</a>
			</ul>
		</nav>
		<main>
			<h1>Profile</h1>
			<form action="index.php" method="post">
				<h2>Edit Profile</h2>
				<fieldset>
				<legend>Account Information</legend>
					<table>
						<!-- User account information fields with HTML validation -->
						<tr><th><label for="user">Username: </label></th><td><input type="text" name="user" title="(alpha-numeric, Must contain at least 4 characters)" pattern="[A-Za-z0-9]{4,}" required value="<?php echo($_SESSION['user']); ?>" readonly /></td></tr>
						<tr><th><label for="password">Password: </label></th><td> <input type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}" title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters" required name="password" value="<?php echo($_SESSION['password']); ?>" /></td></tr>
						<tr><th><label for="firstName">First Name: </label></th><td> <input type="text" pattern="[A-Za-z]{1,}" required name="firstName" value="<?php echo($_SESSION['fName']); ?>" /></td></tr>
						<tr><th><label for="lastName">Last Name: </label></th><td> <input type="text" pattern="[A-Za-z]{1,}" required name="lastName" value="<?php echo($_SESSION['lName']); ?>" /></td></tr>
						<tr><th><label for="email">Email: </label></th><td> <input type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required value="<?php echo($_SESSION['email']); ?>" /></td></tr>
					</table>
				</fieldset>
				<br>
				<fieldset>
				<legend>Contact Information</legend>
					<table>
						<!-- User contact information fields with HTML validation -->
						<tr><th><label for="address">Address: </label></th><td><input type="text" name="address" pattern="[A-Za-z0-9\s]{1,}" value="<?php echo($_SESSION['address']); ?>" /></td></tr>
						<tr><th><label for="city">City: </label></th><td> <input type="text" pattern="[A-Za-z]{1,}" name="city" title="Must not contain any numbers or special characters" value="<?php echo($_SESSION['city']); ?>" /></td></tr>
						<tr><th><label for="State">Province: </label></th><td> <input type="text" pattern="[A-Za-z]{1,}" name="State" title="Must not contain any numbers or special characters" value="<?php echo($_SESSION['State']); ?>" /></td></tr>
						<tr><th><label for="postalCode">Postal Code: </label></th><td> <input type="text" pattern="[A-Za-z0-9]{1,}" name="postalCode" value="<?php echo($_SESSION['postalCode']); ?>" /></td></tr>
						<tr><th><label for="phone">Phone Number: </label></th><td> <input type="text" pattern="[0-9]{1,}" name="phone" title="Must only contain numbers" value="<?php echo($_SESSION['phone']); ?>" /></td></tr>
					</table>
				</fieldset><br>
				<tr><th>&nbsp;</th><td><input type="submit" name="submit" value="Update Profile" /></td></tr><br>
				<tr><th>&nbsp;</th><td><?php echo(view_errors($errors)); ?></td></tr>
			</form>
		</main>
		<footer>
		</footer>
	</body>
</html>

