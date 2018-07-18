var port = 8000;
var express = require('express');
var app = express();
var history = [];

var secret = Math.floor((Math.random()*10 + 1));
var numGuesses=0;

function newGame(){
	secret = Math.floor((Math.random()*10 + 1));
	numGuesses=0;
	history = [];
}

function checkGuess(guess) {
	numGuesses++;
	if (guess < secret) {
		return { "status": "low", "numGuesses":numGuesses, "guess": guess};
	} else if (guess > secret) {
		return { "status": "high", "numGuesses":numGuesses, "guess": guess};
	} else {
		return { "status": "correct", "numGuesses":numGuesses, "guess": guess};
	}
}

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content')); // this directory has files to be returned

app.get('/play/', function (req, res) {
	// req.query has the URL encoded query params
	// Example: /play/?guess=7 
	// req.query.guess == "7" is True
	var guess = parseInt(req.query.guess);
	if(1<=guess && guess<=10){
		var result = checkGuess(guess);
		history.push(result);
	} else {
		result = { "status" : "error", "message" : "guess must be between 1 and 10 inclusive" }
	}
	res.json(result);
});

app.get('/history/', function (req, res) {
	res.json(history);
});

app.get('/newGame/', function (req, res) {
	newGame();
	var result = { "status": "new game", "numGuesses" : numGuesses };
	res.json(result);
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

