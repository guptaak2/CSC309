require('./constants');
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');

var wwPort = global.wwPort;
var UTORID = global.UTORID;
var PASSSORD = global.PASSWORD;

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// https://expressjs.com/en/starter/static-files.html
app.use('/',express.static('/src/components/static_files'));
// app.use(express.static('./build'));

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
const path = require('path');

// Database Name
const dbName = UTORID + '_309';
console.log(dbName);

const url = 'mongodb://' + UTORID + ':' + PASSWORD + '@mcsdb.utm.utoronto.ca:27017/' + dbName;
console.log(url);

function connect() {
	MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
		if (!err) {
            console.log("Successfully connected to MongoDB");
            users = db.collection('users');
            users.ensureIndex({username: 1}, {unique: true});
		} else {
            console.log(err);
            console.log("Couldn't connect to MongoDB");
        }
	});
}

connect();

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Welcome to Warehouse Wars.' });
});

app.get('/api/users', (req, res) => {
    var result = {};
    try {
        users.find({}, {fields: {password: false, gender: false}}).toArray(function (err, data) {
            if (!err) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(data));
            } else {
                result["status"] = "Error occured while fetching users";
                res.status(403).json(result);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(403).json(result);
    };
});

app.put('/api/register/', (req, res) => {
	var user = req.body.username;
	var password = req.body.password;
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var email = req.body.email;
    var gender = req.body.gender;
    var province = req.body.province;
    var result = {};

    if (!validateUserInput(user, password, firstname, lastname, email, gender, province)) {
        result["status"] = "Incomplete form";
        res.status(404).json(result);
        return;
    }

    try {
        users.insertOne({
            "username": user,
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "gender": gender,
            "province": province,
            "score": 0
        }, function(err, row) {
            if (!err) {
                result["status"] = "Successfully registered user!";
                result["username"] = user;
                result["password"] = password;
                res.status(200);
                jwt.sign({
                    result: result
                }, 'secretkey', {
                    expiresIn: 60 * 60 * 3
                }, (err, token) => {

                    res.json({
                        username: user,
                        token: token
                    });
                });
            } else {
                result["status"] = "User already exists!";
                res.status(403).json(result);
            }
        });
    } catch (e) {
        console.log(e);
    };
});

app.post('/api/login', function (req, res) {
    var user = req.body.username;
    var password = req.body.password;
    var result = {};

    if (user == "" || password == "" || password.length < 6) {
        result["status"] = "Invalid login";
        res.status(404).json(result);
        return;
    }

    try {
        users.findOne({
            "username": user,
            "password": password
        }, function (err, row) {
            if (!err && row) {
                res.status(200);
                result["status"] = "Logged in!";
                result["username"] = user;
                result["password"] = password;
                jwt.sign({
                    result: result
                }, 'secretkey', {
                    expiresIn: 60 * 60 * 3
                }, (err, token) => {

                    res.json({
                        username: user,
                        token: token
                    });
                });
            } else {
                result["status"] = "invalid username or password. please try again";
                res.status(404).json(result);
            }
        });
    } catch (e) {
        console.log(e);
    };
});


app.get('/api/scores', (req, res) => {
    var result = {};
    try {
        users.find({}, {
            fields: {
                username: false,
                password: false,
                firstname: false,
                lastname: false,
                email: false,
                gender: false,
                province: false
            }
        }).toArray(function (err, data) {
            if (!err) {
                sorted = sortScores(data);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(sorted));
            } else {
                result["status"] = "Error occured while fetching scores";
                res.status(403).json(result);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(403).json(result);
    };
});

function sortScores(data) {
    top_scores = [];
    for (i = 0; i < Object.keys(data).length; i++) {
        eachUserScore = (data[i])['score'];
        for (j = 0; j < Object.keys(eachUserScore).length; j++) {
            top_scores.push(eachUserScore[j]);
        }
    }
    top_scores.sort(function (a, b) {
        return b - a
    });
    top_scores.slice(9);
    return top_scores;
}

app.post('/api/score/:username/', function (req, res) {
    var result = {};
    var user = req.params.username;
    var score = req.body.score;
    jwt.verify(req.get('Authorization'), 'secretkey', (err, authData) => {
        if (err) {
            res.status(401);
            result["error"] = "Token is invalid";
            res.json(result);
        } else {
            var tokenUserId = authData["result"]["username"];
            if (user !== tokenUserId) {
                res.status(403);
                result["error"] = "Access Denied";
                res.json(result);
            } else {
                try {
                    users.updateOne({
                        "username": user
                    }, {
                        $push: {
                            "score": score,
                        }
                    }, function (err, row) {
                        if (!err) {
                            result["status"] = "Successfully updated user!";
                            res.status(200).json(result);
                        } else {
                            result["status"] = "Update failed";
                            res.status(403).json(result);
                        }
                    });
                } catch (e) {
                    console.log(e);
                };
            }
        };
    });
});

app.get('/api/profile/:username', jwt_verify, function (req, res) {
    var user = req.params.username;
    var result = {};

    jwt.verify(req.get('Authorization'), 'secretkey', (err, authData) => { 
        if (err) {
			result["error"] = "Token is invalid";
            res.status(401).json(result);
        } else {
            var tokenUserId = authData["result"]["username"];
            if (user !== tokenUserId) {
				result["error"] = "Access Denied";
                res.status(403).json(result);
			} else {
                var tokenPassword = authData["result"]["password"];
                try {
                    users.findOne({
                        "username": tokenUserId,
                        "password": tokenPassword
                    }, (function (err, data) {
                        if (!err) {
                            result['gender'] = data['gender'];
                            result['firstname'] = data['firstname'];
                            result['lastname'] = data['lastname'];
                            result['email'] = data['email'];
                            result['province'] = data['province'];
                            result['user'] = user;
                            result['password'] = data['password'];
                            res.writeHead(200, {"Content-Type": "application/json"});
                            res.end(JSON.stringify(result));
                        } else {
                            result["status"] = "Error occured while fetching users";
                            res.status(403).json(result);
                        }
                    }));
                } catch (e) {
                    console.log(e);
                    res.status(403).json(result);
                };
            }
        }
    });
});

app.post('/api/profile/:username', jwt_verify, function (req, res) {
    var user = req.params.username;
    var password = req.body.password;
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var email = req.body.email;
    var gender = req.body.gender;
    var province = req.body.province;
    var result = {};

    if (!validateUserInput(user, password, firstname, lastname, email, gender, province)) {
        result["status"] = "Incomplete form";
        res.status(404).json(result);
        return;
    }

    jwt.verify(req.get('Authorization'), 'secretkey', (err, authData) => {
        if (err) {
            result["error"] = "Token is invalid";
            res.status(401).json(result);
        } else {
            var tokenUserId = authData["result"]["username"];
            if (user !== tokenUserId) {
                result["error"] = "Access Denied";
                res.status(403).json(result);
            } else {
                var tokenPassword = authData["result"]["password"];
                try {
                    users.updateOne({
                        "username": user
                    }, {
                        $set: {
                            "password": password,
                            "firstname": firstname,
                            "lastname": lastname,
                            "email": email,
                            "gender": gender,
                            "province": province
                        }
                    }, function (err, row) {
                        if (!err) {
                            res.status(200);
                            result["status"] = "Successfully updated user!";
                            result["username"] = user;
                            result["password"] = password;
                            jwt.sign({
                                result: result
                            }, 'secretkey', {
                                expiresIn: 60 * 60 * 3
                            }, (err, token) => {
                                res.json({
                                    username: user,
                                    token: token
                                });
                            });
                        } else {
                            result["status"] = "Update failed";
                            res.status(403).json(result);
                        }
                    });
                } catch (e) {
                    console.log(e);
                };
            }
        }
    });
});

app.delete('/api/delete/:username', jwt_verify, function (req, res) {
    var user = req.params.username;
    var result = {};

    if (user == "") {
        result["status"] = "Incomplete form";
        res.status(404).json(result);
        return;
    }

    jwt.verify(req.get('Authorization'), 'secretkey', (err, authData) => {
        if (err) {
            result["error"] = "Invalid token";
            res.status(401).json(result);
        } else {
            var tokenUserId = authData["result"]["username"];
            if (user !== tokenUserId) {
                result["error"] = "Access Denied";
                res.status(403).json(result);
            } else {
                var tokenPassword = authData["result"]["password"];
                try {
                    users.deleteOne({
                        "username": tokenUserId
                    }, function (err, row) {
                        if (!err) {
                            result["status"] = "Successfully deleted user!";
                            res.status(200).json(result);
                        } else {
                            result["status"] = "Delete failed";
                            res.status(403).json(result);
                        }
                    });
                } catch (e) {
                    console.log(e);
                };
            }
        }
    });
});

function validateUserInput(user, password, firstname, lastname, email, gender, province) {
    if (user == "" || password == "" || firstname == "" || lastname == "" || email == "" || gender == "" || province == "") {
        return false;
    } else if (password.length < 6 || !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        return false;
    } else {
        return true;
    }
};

//On every request to restricted endpoints, we use this 
//helper function to check if the Json Web Token (jwt) in 
//headers request is actually a valid one, else 403 status for
//forbidden
function jwt_verify(req, res, next) {
	//Get request headers specifically for authorization
	const authorization_req_header = req.headers['authorization'];

	//requests are of the form 'Bearer [jwt]' and we are sending
	//as json content type
	if (typeof authorization_req_header !== 'undefined') {
		//gives us just the token by itself
		const jwt_token = (authorization_req_header.split(' '))[1];
		//set the token in request
		req.token = jwt_token;
		next();
	} else {
		res.status(403);
    }
};

app.listen(wwPort, function () {
	console.log('App listening on port ' + wwPort);
});