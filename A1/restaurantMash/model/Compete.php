<?php
require_once "lib/lib.php";
$GLOBALS['dbconn'] = db_connect();

/* create userInfo class */

class userInfo {

	public function __construct() {
		
		$query  = "SELECT * FROM appuser WHERE id = $1 and password = $2;";
        $result = pg_prepare($GLOBALS['dbconn'], "select_query", $query);
		
		$query  = "INSERT INTO appuser(id, password, firstName, lastName, email) VALUES ($1, $2, $3, $4, $5);";
		$result = pg_prepare($GLOBALS['dbconn'], "registerUser", $query);

		$query  = "INSERT INTO appuser_otherinfo(id) VALUES ($1);";
		$result = pg_prepare($GLOBALS['dbconn'], "registerUser_otherinfo", $query);

		$query  = "SELECT * FROM appuser WHERE id = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "existUser", $query);
		
		$query  = "UPDATE appuser SET password = $1, firstName = $2, lastName = $3, email = $4 WHERE id = $5;";
        $result = pg_prepare($GLOBALS['dbconn'], "updateUser", $query);

        $query  = "SELECT * FROM appuser_otherinfo WHERE id = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "existUser_otherinfo", $query);
		
		$query  = "UPDATE appuser_otherinfo SET address = $1, city = $2, state = $3, postalcode = $4, phone = $5 WHERE id = $6;";
        $result = pg_prepare($GLOBALS['dbconn'], "updateUser_otherinfo", $query);

	}
	
	/* function get user info from postgresql database */
	public function getInfo($id){
		$this->user  = $id;
		$query = "SELECT * FROM appuser WHERE id = '$id';";
		$result = pg_query($GLOBALS['dbconn'], $query);
		$res = pg_fetch_array($result);
		$_SESSION['user']  = $res[0];
		$_SESSION['password'] = $res[1];
		$_SESSION['fName'] = $res[2];
		$_SESSION['lName'] = $res[3];
		$_SESSION['email'] = $res[4];

		$query = "SELECT * FROM appuser_otherinfo WHERE id = '$id';";
		$result = pg_query($GLOBALS['dbconn'], $query);
		$res = pg_fetch_array($result);
		$_SESSION['address']  = $res[1];
		$_SESSION['city'] = $res[2];
		$_SESSION['State'] = $res[3];
		$_SESSION['postalCode'] = $res[4];
		$_SESSION['phone'] = $res[5];
	}

	public function validate_profile_input($info, $other_info){
		if (array_search("", $info) || array_search("", $other_info)){
			header('HTTP/1.0 400 Bad Request', true, 400);	
			return false;
		} else {
			
			if (!preg_match('/^[A-Za-z]{1,}$/', $info['firstname']) || !preg_match('/^[A-Za-z]{1,}$/', $info['lastname']) || !preg_match('/^[A-Za-z]{1,}$/', $other_info['city']) || !preg_match('/^[A-Za-z]{1,}$/', $other_info['sate'])){
				header('HTTP/1.0 404 Bad Request', true, 400);	
				return false;
			} else {
				
				return true;
			}
			if (!preg_match('/[a-zA-Z0-9_-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/', $info['email']) || !preg_match('/^[A-Za-z0-9]{1,}$/', $other_info['address']) || !preg_match('/^[A-Za-z0-9]{1,}$/', $other_info['postalcode']) || !preg_match('/^[0-9]{1,}$/', $other_info['phone'])){
				header('HTTP/1.0 404 Bad Request', true, 400);	
				return false;
			} else {
				
				return true;
			}
			
			return true;
		}
		
	}
	/* function to update user edited profile in database */
	public function edit_Profile($info, $other_info){
		
		$check = $this->validate_profile_input($info, $other_info);
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "existUser", array($_SESSION['user']));
			/* Regular User Information Updates */
			if (!empty($result)){
				header($_SERVER["SERVER_PROTOCOL"]." 200");
				$res = pg_fetch_result($result, 0, 0);
				array_push($info, $res);
				$result = pg_execute($GLOBALS['dbconn'], "updateUser", $info);
				if (!empty($result)){
					header($_SERVER["SERVER_PROTOCOL"]." 200");
				}else{
					header('HTTP/1.0 404 Bad Request', true, 404);
				}
			}else{
				header('HTTP/1.0 404 Bad Request', true, 404);
			}
			
			/* Additional User Info updates */
			$result = pg_execute($GLOBALS['dbconn'], "existUser_otherinfo", array($_SESSION['user']));
			if (!empty($result)){
				header($_SERVER["SERVER_PROTOCOL"]." 200");
				$res = pg_fetch_result($result, 0, 0);
				array_push($other_info, $res);
				$result = pg_execute($GLOBALS['dbconn'], "updateUser_otherinfo", $other_info);

				if (!empty($result)){
					header($_SERVER["SERVER_PROTOCOL"]." 200");
				}else{
					header('HTTP/1.0 404 Bad Request', true, 404);
				}
			}else{
				header('HTTP/1.0 404 Bad Request', true, 404);			
			}
		}else{
			header('HTTP/1.0 404 Bad Request', true, 404);
		}
		
		$this->getInfo($_SESSION['user']);
		
	}

	public function validate_valid_User($uName, $pwd){
		if(empty($uName) || empty($pwd)){
			header('HTTP/1.0 400 Bad Request', true, 400);	
			return false;
		}else{
			if(!preg_match('/^[A-Za-z0-9]{4,}$/', $uName) || !preg_match('/^[A-Za-z0-9]{4,}$/', $pwd)){
				header('HTTP/1.0 400 Bad Request', true, 400);	
				return false;
			}else{
				return true;
			}
			return true;
			
		}
	}
	
	/* function to check if user is valid */
	public function valid_User($uName, $pwd){
		$check = $this->validate_valid_User($uName, $pwd);
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "select_query", array($uName, $pwd));
			if (!empty($result)){
				header($_SERVER["SERVER_PROTOCOL"]." 200");
				if($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)){
					header($_SERVER["SERVER_PROTOCOL"]." 200");
					return true;
				} else {
					header('HTTP/1.0 404 Not Found', true, 404);	
					return false;
				}
			} else{
				header('HTTP/1.0 404 Bad Request', true, 404);	
			}
		} else{
			header('HTTP/1.0 404 Bad Request', true, 404);	
		}
	}
	
	public function validate_new_User($uName, $pwd, $fName, $lName, $email){
		
		if (empty($uName) || empty($pwd) || empty($fName) || empty($lName) || empty($email)){
			header('HTTP/1.0 400 Bad Request', true, 400);	
			return false;
		} else {
			if (!preg_match('/^[A-Za-z0-9]{4,}$/', $uName) || !preg_match('/^[A-Za-z]{1,}$/', $fName) || !preg_match('/^[A-Za-z]{1,}$/', $lName)){
				header('HTTP/1.0 404 Bad Request', true, 400);	
				return false;
			} else {
				return true;
			}

			if (!preg_match('/[a-zA-Z0-9_-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/', $email) || !preg_match('/^[A-Za-z0-9]{4,}$/', $pwd)){
				header('HTTP/1.0 404 Bad Request', true, 400);	
				return false;
			} else {
				return true;
			}
			return true;
			
		}
	}
	/* function to register to new user */
	public function new_User($uName, $pwd, $fName, $lName, $email){
		$uName = strtolower($uName);
		
		$check = $this->validate_new_User($uName, $pwd, $fName, $lName, $email);
		if($check){
			$userExist = $this->exist_User($uName);
		}else{
			header('HTTP/1.0 400 Bad Request', true, 400);
		}

        if($userExist) {
            $_SESSION['existUser'] = "This user already exists";
			header('HTTP/1.0 404 Bad Request', true, 404);
        } else {
			$result = pg_execute($GLOBALS['dbconn'], "registerUser", array($uName, $pwd, $fName, $lName, $email));
			$result_otherinfo = pg_execute($GLOBALS['dbconn'], "registerUser_otherinfo", array($uName));
        	if($result){
				$rows_affected = pg_affected_rows($result);
				return true;
			}else{
				header('HTTP/1.0 404 Not Found', true, 404);
			}
		}
	}

	/* function to check if user exists in database */
	public function exist_User($uName){
		$result = pg_execute($GLOBALS['dbconn'], "existUser", array($uName));
        if (!$result) {
			$res = pg_fetch_array($result);
			if (!empty($res)) {
				return true;
			}else{
				header('HTTP/1.0 400 Not Found', true, 400);
				return false;
				
			}
            return true;
        } else {
			header('HTTP/1.0 400 Not Found', true, 400);
            return false;
        }
	}

}

class Compete {

	public function __construct() {

		$query  = "UPDATE restaurants SET rating = $2 WHERE name = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "restaurant_query", $query);

		$query  = "SELECT name, rating FROM restaurants;";
		$result = pg_prepare($GLOBALS['dbconn'], "all_restaurants", $query);

		$query  = "SELECT rating FROM restaurants WHERE name = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "get_rating", $query);

		$query  = "UPDATE restaurants SET wins = wins + 1 WHERE name = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "update_wins", $query);

		$query  = "UPDATE restaurants SET losses = losses + 1 WHERE name = $1;";
		$result = pg_prepare($GLOBALS['dbconn'], "update_losses", $query);

    }

	/* function to add rating to restaurant using elo chess ranking */
    public function add_rating($name, $rating){
		$check=pg_query($GLOBALS['dbconn'], "BEGIN;");
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "restaurant_query", array(rtrim($name), round($rating)));
			if($result) {
				$rows_affected = pg_affected_rows($result);
			}
			
			/* transaction to ensure only 1 user can access table */
			$stat = pg_transaction_status($GLOBALS['dbconn']);
			if ($stat === PGSQL_TRANSACTION_INERROR) {
				echo '<br/>Error in the transaction';
				echo('<br/>' . pg_last_error());
				$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
			} else {
				$result=pg_query($GLOBALS['dbconn'], "COMMIT;");

				if($result){  
					echo(""); 
				} else { 
					echo("<br/>could not commit the transaction"); 
					$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
					echo('<br/>' . pg_last_error());
				}
			}
		}else{
			echo("<br/>could not begin the transaction"); 
		}
	}

	/* function to add +1 to wins if user picks restaurant */
    public function update_wins($name){
		$check=pg_query($GLOBALS['dbconn'], "BEGIN;");
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "update_wins", array(rtrim($name)));
			if($result) {
				$rows_affected = pg_affected_rows($result);
			}
			
			/* transaction to ensure only 1 user can access table */
			$stat = pg_transaction_status($GLOBALS['dbconn']);
			if ($stat === PGSQL_TRANSACTION_INERROR) {
				echo '<br/>Error in the transaction';
				echo('<br/>' . pg_last_error());
				$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
			} else {
				$result=pg_query($GLOBALS['dbconn'], "COMMIT;");

				if($result){
					echo("");  
				} else { 
					echo("<br/>could not commit the transaction"); 
					$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
					echo('<br/>' . pg_last_error());
				}
			}
		}else{
			echo("<br/>could not begin the transaction"); 
		}
	}

	/* function to add +1 to losses if user picks against restaurant */
    public function update_losses($name){
		$check=pg_query($GLOBALS['dbconn'], "BEGIN;");
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "update_losses", array(rtrim($name)));
			if($result) {
				$rows_affected = pg_affected_rows($result);
			}
			
			/* transaction to ensure only 1 user can access table */
			$stat = pg_transaction_status($GLOBALS['dbconn']);
			if ($stat === PGSQL_TRANSACTION_INERROR) {
				echo '<br/>Error in the transaction';
				echo('<br/>' . pg_last_error());
				$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
			} else {
				$result=pg_query($GLOBALS['dbconn'], "COMMIT;");

				if($result){ 
					echo(""); 
				} else { 
					echo("<br/>could not commit the transaction"); 
					$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
					echo('<br/>' . pg_last_error());
				}
			}
		}else{
			echo("<br/>could not begin the transaction"); 
		}
	}

	/* function to get rating */
	public function get_rating($name) {
		$check=pg_query($GLOBALS['dbconn'], "BEGIN;");
		if($check){
			$result = pg_execute($GLOBALS['dbconn'], "get_rating", array(rtrim($name)));
			$res = pg_fetch_array($result);
			return $res[0];

			/* transaction to ensure only 1 user can access table */
			$stat = pg_transaction_status($GLOBALS['dbconn']);
			if ($stat === PGSQL_TRANSACTION_INERROR) {
				echo '<br/>Error in the transaction';
				echo('<br/>' . pg_last_error());
				$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
			} else {
				$result=pg_query($GLOBALS['dbconn'], "COMMIT;");

				if($result){ 
					echo(""); 
				} else { 
					echo("<br/>could not commit the transaction"); 
					$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
					echo('<br/>' . pg_last_error());
				}
			}
		}else{
			echo("<br/>could not begin the transaction"); 
		}
	}

	/* function to get all restaurants to populate results page */
	public function get_restaurants_table(){
		$check=pg_query($GLOBALS['dbconn'], "BEGIN;");
		if($check){
			$query = "SELECT name, rating, wins, losses FROM restaurants ORDER BY rating DESC;";
			$result = pg_query($GLOBALS['dbconn'], $query);
			$res[0] = pg_fetch_all_columns($result, 0);
			$res[1] = pg_fetch_all_columns($result, 1);
			$res[2] = pg_fetch_all_columns($result, 2);
			$res[3] = pg_fetch_all_columns($result, 3);
			return $res;

			/* transaction to ensure only 1 user can access table */
			$stat = pg_transaction_status($GLOBALS['dbconn']);
			if ($stat === PGSQL_TRANSACTION_INERROR) {
				echo '<br/>Error in the transaction';
				echo('<br/>' . pg_last_error());
				$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
			} else {
				$result=pg_query($GLOBALS['dbconn'], "COMMIT;");

				if($result){ 
					echo(""); 
				} else { 
					echo("<br/>could not commit the transaction"); 
					$result=pg_query($GLOBALS['dbconn'], "ROLLBACK;");
					echo('<br/>' . pg_last_error());
				}
			}
		}else{
			echo("<br/>could not begin the transaction"); 
		}
	}
}

?>

