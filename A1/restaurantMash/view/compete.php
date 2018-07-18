<?php
$_REQUEST['first']=!empty($_REQUEST['first']) ? $_REQUEST['first'] : '';
$_REQUEST['second']=!empty($_REQUEST['second']) ? $_REQUEST['second'] : '';

$lines = file('dev/restaurants.txt');
$number_of_restaurants = count($lines);

?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="style.css" />
		<title>Restaurant Mash</title>
	</head>
	<body>
		<header><h1>Restaurant Mash</h1></header>
		<!-- Welcomes user with fullname -->
		<h2><center>Welcome, <?php echo ($_SESSION['fName'] . " " . $_SESSION['lName'] . "!");?></center></h2>
		<nav>
			<ul>
				<li> <a href="?operation=profile">Profile</a>
				<li class="selected"> <a href="?operation=compete">Compete</a>
				<li> <a href="?operation=results">Results</a>
				<li> <a href="?operation=logout">Logout</a>
			</ul>
		</nav>
		<main>
			<h1>Compete</h1>
			<h2>Which restaurant would you rather go to?</h2>
			<form action="index.php" method="post">
				<?php
				$random_1 = rand() % $number_of_restaurants;
				$random_2 = ($random_1 + 1) % $number_of_restaurants;
				$_REQUEST['first'] = preg_replace("/\''/", "'", $lines[$random_1]); /* remove double quotes */
				$_REQUEST['second'] = preg_replace("/\''/", "'", $lines[$random_2]); /* remove double quotes */
				?>
				<table><tbody>
					<!-- Buttons that show restaurant names including page_token to prevent re-submission -->
					<tr>
						<input type="hidden" name="page_token" value="<?php echo htmlspecialchars($_SESSION['page_token']); ?>" />
						<th class="choice"><button type="submit" name="choose" value="1"><?php echo($_REQUEST['first']);?></button></th>
						<input type="hidden" name="choose_one" value="<?php echo($_REQUEST['first']);?>"/>
						<th>or</th>
						<th class="choice"><button type="submit" name="choose" value="2"><?php echo($_REQUEST['second']);?></button></th>
						<input type="hidden" name="choose_two" value="<?php echo($_REQUEST['second']);?>"/>
						<th>or</th>
						<th class="choice"><button type="submit" name="choose" value="3"><?php echo("I don't know");?></button></th>
						<input type="hidden" name="choose_three" value="<?php echo($_REQUEST['second']);?>"/>
						<th>or</th>
						<th class="choice"><button type="submit" name="choose" value="4"><?php echo("Tie!");?></button></th>
						<input type="hidden" name="choose_four" value="<?php echo("Tie!");?>"/>
					</tr>
				</tbody></table>
				<?php echo(view_errors($errors)); ?>
			</form>			 
		</main>
		<footer>
		</footer>
	</body>
</html>
