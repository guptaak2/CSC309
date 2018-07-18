<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="refresh" content="5">
		<link rel="stylesheet" type="text/css" href="style.css" />
		<title>RestaurantMash</title>
	</head>
	<body>
		<header><h1>RestaurantMash</h1></header>
		<nav>
			<ul>
				<li> <a href="?operation=profile">Profile</a>
				<li> <a href="?operation=compete">Compete</a>
				<li class="selected"> <a href="?operation=results">Results</a>
				<li> <a href="?operation=logout">Logout</a>
			</ul>
		</nav>
		<main>
			<h1>Results</h1>
			<form method="post">
				<table>
					<!-- Show restaurants table along with their respective ratings, wins and losses -->
					<tr> 
						<th>Restaurant</th>
						<th>Rating</th> 
						<th>Wins</th>
						<th>Losses</th>
					</tr>
					<?php
						$all_names = $_SESSION['ratings']->get_restaurants_table();
						for ($y = 0; $y < count($all_names[0]); $y++) { ?>
							<tr>
								<td><?php echo $all_names[0][$y];?></td><td><?php echo $all_names[1][$y];?></td><td><?php echo $all_names[2][$y];?></td><td><?php echo $all_names[3][$y];?></td>
							</tr> 
					<?php } ?>
				</table>
			</form>
		</main>
		<footer>
		</footer>
	</body>
</html>