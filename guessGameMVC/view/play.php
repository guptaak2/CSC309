<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Guess Game</title>
	</head>
	<body>
		<h1>Welcome to GuessGame</h1>
		<?php if($_SESSION["is_correct"]!="correct"){ ?>
			<form method="post">
				<input type="text" name="guess" value="<?php echo($_REQUEST['guess']); ?>" /> <input type="submit" name="submit" value="guess" />
				<!-- above should be a dropdown, but then you won't see how errors are handled -->
			</form>
		<?php } ?>
		
		<?php echo(view_errors($errors)); ?>
		<?php 
			foreach($_SESSION['history'] as $key=>$value){
				echo("<br/> $value");
			}
		?>
		<?php if($_SESSION["is_correct"]=="correct"){ ?>
			<form method="post">
				<input type="submit" name="submit" value="start again" />
			</form>
		<?php } ?>
	</body>
</html>

