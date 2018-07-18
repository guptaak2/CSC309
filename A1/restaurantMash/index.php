<?php
	ini_set('display_errors', 'Off');
	
	
	require_once "model/Compete.php";
	require_once "src/Rating/Rating.php";
	use Rating\Rating;

	session_save_path("sess");
	session_start(); 

	/* set variables */
	$uName = $_REQUEST['user'];
	$pwd = $_REQUEST['password'];
	$fName = $_REQUEST['firstName'];
	$lName = $_REQUEST['lastName'];
	$email = $_REQUEST['email'];

	$address = $_REQUEST['address'];
	$city = $_REQUEST['city'];
	$State = $_REQUEST['State'];
	$postalCode = $_REQUEST['postalCode'];
	$phone = $_REQUEST['phone'];
	
	$_SESSION['userInfo'] = new userInfo();
	$_SESSION['ratings'] = new Compete();
	if (empty($_SESSION['num_choices'])){
        $_SESSION['num_choices'] = 0;
    }

	$errors=array();
	$view="";

	/* controller code */
	function headerTrim(){
		$host = $_SERVER['HTTP_HOST'];
		$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
		header("Location: http://$host$uri/");
	}
	
	/* Switching between POST operation requests */
	if(isset($_REQUEST['operation'])){
		switch($_REQUEST['operation']){
			case "profile":
				call_user_func('headerTrim', '');
				$_SESSION['state']='profile';
				$view="profile.php";
				break;

			case "logout":
				session_destroy();
				session_unset();
				call_user_func('headerTrim', '');
				break;

			case "compete":
				call_user_func('headerTrim', '');
				$_SESSION['state']='compete';
				$view="compete.php";
				break;

			case "results":
				call_user_func('headerTrim', '');
				if ($_SESSION['num_choices'] >= 10) {
					$_SESSION['state']='results';
					$view="results.php";
				} else {
					$errors[] = "You need to make atleast 10 choices before you can see results. Current number of choices: " . $_SESSION['num_choices'];
				}
				break;
				
			case "goBack":
				call_user_func('headerTrim', '');
				$_SESSION['state']='login';
				$view="login.php";
				break;
		}
	}
	
	if(!isset($_SESSION['state'])){
		$_SESSION['state']='login';
	}

	switch($_SESSION['state']){
		case "unavailable":
			/* default view */
			$view="unavailable.php";

			break;

		case "login":
			/* default view */
			$view="login.php";

			if(isset($_REQUEST['operation'])){
				switch($_REQUEST['operation']){
					case "register":
						call_user_func('headerTrim', '');
						$_SESSION['state']='register';
						$view="register.php";
						break;	
				}
			}
			/* check if we submit or not */
			if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="Login"){
				break;
			}

			/* validate and set errors */
			if(empty($uName) && empty($pwd)) {
				$errors[]='username/password is required';
				break;
			}
			if(empty($uName)){
				$errors[]='username is required';
				break;
			}
			if(empty($pwd)){
				$errors[]='password is required';
				break;
			}
			if(!empty($errors))
				break;

			/* perform operation, switching state and view if necessary */
			$validUser = $_SESSION['userInfo']->valid_User($uName, $pwd);

			if($validUser){
				$_SESSION['userInfo']->getInfo($uName);
				$_SESSION['state']='compete';
				$view="compete.php";
			} else {
				$errors[]="invalid login, please try again.";
			}
	
			break;

		case "register":
			/* default view */
			$view="register.php";

			/* check if submit or not */
			if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="Register"){
				break;
			} 

			/* validate and set errors */
			if(empty($uName) || empty($pwd) || empty($fName) || empty($lName) || empty($email)){
				$errors[]='Missing Required Information';
			}

			if(!empty($errors))
				break;

			/* send user entered information to postgresql */
			$registeredUser = $_SESSION['userInfo']->new_User($uName, $pwd, $fName, $lName, $email);

			if ($registeredUser) {
				$_SESSION['userInfo']->getInfo($uName);
				$_SESSION['state'] = 'profile';
				$view = "profile.php";
			}

			if(isset($_SESSION['existUser'])) {
				$errors[] = "This user already exists, please try again.";
				unset($_SESSION['existUser']);
				break;
			} 
		
			break;
			
		case "compete":
			/* default view */
			$view="compete.php";
			/* prevents old submission */
			if (isset($_POST['page_token']) && isset($_SESSION['page_token']) && $_POST['page_token'] == $_SESSION['page_token']) {
				$_SESSION['page_token'] = '';
				/* process form */
				if(isset($_POST['choose'])) {
					$_SESSION['num_choices']++;			

					/* get current ratings for restaurants displayed */
					$rating_a = $_SESSION['ratings']->get_rating($_REQUEST['choose_one']);
					$rating_b = $_SESSION['ratings']->get_rating($_REQUEST['choose_two']);

					/* if user chooses restaurant on the left */
					if($_POST['choose'] == 1) {
						$rating = new Rating($rating_a, $rating_b, Rating::WIN, Rating::LOST);
						$results = $rating->getNewRatings();
						/* add elo chess rating to database */
						$_SESSION['ratings']->add_rating($_REQUEST['choose_one'], $results['a']);
						$_SESSION['ratings']->add_rating($_REQUEST['choose_two'], $results['b']);
						$_SESSION['ratings']->update_wins($_REQUEST['choose_one']);
						$_SESSION['ratings']->update_losses($_REQUEST['choose_one']);

					/* if user chooses restaurant on the right */
					} else if($_POST['choose'] == 2) {
						$rating = new Rating($rating_a, $rating_b, Rating::LOST, Rating::WIN);
						$results = $rating->getNewRatings();
						/* add elo chess rating to database */
						$_SESSION['ratings']->add_rating($_REQUEST['choose_two'], $results['b']);
						$_SESSION['ratings']->add_rating($_REQUEST['choose_one'], $results['a']);
						$_SESSION['ratings']->update_wins($_REQUEST['choose_two']);
						$_SESSION['ratings']->update_losses($_REQUEST['choose_two']);

					/* if user chooses "I don't know" option */
					} else if($_POST['choose'] == 3) {
						/* do nothing, just show 2 new pairs */

					/* if user chooses "Tie" option */
					} else if($_POST['choose'] == 4) {
						$rating = new Rating($rating_a, $rating_b, Rating::DRAW, Rating::DRAW);
						$results = $rating->getNewRatings();
						/* add elo chess rating to database */
						$_SESSION['ratings']->add_rating($_REQUEST['choose_two'], $results['b']);
						$_SESSION['ratings']->add_rating($_REQUEST['choose_one'], $results['a']);
					}
				}
			} else {
				$_SESSION['page_token'] = md5(rand(0,9999999));
			}

			/* prevents user from viewing results before 10 submissions */
			if ($_SESSION['num_choices'] <= 10) {
				if(isset($_POST['choose'])) {
					$errors[] = "Current number of choices: " . $_SESSION['num_choices'];
				} else {
					$errors[] = "You need to make atleast 10 choices before you can see results. Current number of choices: " . $_SESSION['num_choices'];
				}
			}
			
			break;		

		case "results":
			/* default view */
			$view="results.php";

			break;

		case "profile":
			/* default view */
			$view="profile.php";
			
			$errors[] = "You need to make atleast 10 choices before you can see results. Current number of choices: " . $_SESSION['num_choices'];
			
			/* check if submit or not */
			if(empty($_REQUEST['submit']) || $_REQUEST['submit']!="Update Profile"){
				break;
			}

			/* validate and set errors */
			if(empty($uName) || empty($pwd) || empty($fName) || empty($lName) || empty($email)){
				$errors[]='Missing Account Information';
				break;
			}
			
			/* creates array of user account and contact information to send to postgresql database */
			$info = array(
				'password' => $pwd,
				'firstname' => $fName,
				'lastname' => $lName,
				'email' => $email
			    );

			$other_info = array(
				'address' => $address,
				'city' => $city,
				'sate' => $State,
				'postalcode' => $postalCode,
				'phone' => $phone
			    );
			
			/* send user entered information to postgresql */
			$_SESSION['userInfo']->edit_Profile($info, $other_info);

			/* validate and set errors */
			if(empty($address) || empty($city) || empty($State) || empty($postalCode) || empty($phone)){
				$errors[]='Missing Contact Information';
				
			} else {
				$errors[]='Updated!';
				
			}

			if(!empty($errors))
				break;
			    
			break;
	}
	require_once "view/$view";
?>
