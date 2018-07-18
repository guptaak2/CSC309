require('./constants');
var port = global.wwWsPort;

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		port: port
	});

var messages = [];
var stageContainer = [];
var globalUsers = [];
intervalSet = true;

wss.on('close', function () {
	console.log('disconnected');
});

wss.broadcast = function (message) {
	for (let ws of this.clients) {
		ws.send(message);
	}
}

wss.on('connection', function (ws) {
	console.log("welcome new client");
	ws.userID = -1;
	ws.personStructure = -1;
	var i;
	for (i = 0; i < messages.length; i++) {
		ws.send(messages[i]);
	}

	id = 1;

	stage = new Stage();
	stageContainer.push(stage);
	stage.setupStage();
	if (intervalSet) {
		interval_step = setInterval(step, 1000);
		intervalSet = 0;
	}


	wss.on('disconnect', function () {
		console.log("dc");
		stage.removeStructure(ws.personStructure);
		personIndex = stage.clients.indexOf(ws);

		if (personIndex > -1) {
			stage.clients.splice(personIndex, 1);
		}
		ws.userID = -1;
		ws.personStructure = -1;
	});

	ws.on('message', function (message) {
		json = JSON.parse(message);

		if (json.socketMessage == 'user_dead') {
			stage.removeStructure(ws.personStructure);
			personIndex = stage.clients.indexOf(ws);

			if (personIndex > -1) {
				stage.clients.splice(personIndex, 1);
			}
			ws.userID = -1;
			ws.personStructure = -1;

		}

		if (json.socketMessage == 'loadStage') {
			globalUsers.push(json.userName + " ");
			stage = stageContainer[0];
			stage.clients.push(ws);
			ws.userID = stage.availableUsers[0];
			stage.availableUsers.shift();
			ws.personStructure = stage.addPlayer(ws.userID);

			boxesList = [];

			for (var j = 0; j < stage.actors.length; j++) {
				stageActor = stage.actors[j];
				if (stageActor instanceof Box) {
					boxesList.push([stageActor.x, stageActor.y]);
				}
			};

			monsterList = [];
			for (var j = 0; j < stage.actors.length; j++) {
				stageActor = stage.actors[j];
				if (stageActor instanceof RegularMonsters) {
					monsterList.push([stageActor.x, stageActor.y]);
				}
			};

			jumpingMonstersList = [];
			for (var j = 0; j < stage.actors.length; j++) {
				stageActor = stage.actors[j];
				if ((stageActor instanceof JumpingMonster)) {
					jumpingMonstersList.push([stageActor.x, stageActor.y]);
				}
			};

			msg = {
				socketMessage: 'loadStage',
				boxList: boxesList,
				monsterList: monsterList,
				jumpingMonsters: jumpingMonstersList,
				wallsList: stage.walls,
				playersList: stage.players,
				pID: ws.userID,
				listOfUsers: globalUsers
			};

			msg = JSON.stringify(msg);

			ws.send(msg);
		}

		if (json.socketMessage == 'step') {
			stage = stageContainer[0];
			for (j = 0; j < stage.players.length; j++) {
				if (stage.players[j][2] == ws.userID) {
					xCoordinate = stage.players[j][0];
					yCoordinate = stage.players[j][1];
					actor = stage.getStructure(xCoordinate, yCoordinate);
					actor.step(json.direction, j);
				}
			}
		}

	});
});

function randomGenerator(number) {
	return Math.floor((Math.random() * (number - 2)) + 1);
}

function step() {
	stageContainer[0].step();
}

Stage.prototype.addPlayer = function (id) {
	lengthRandom = randomGenerator(this.windowLength);
	widthRandom = randomGenerator(this.windowHeight);

	while (this.getStructure(widthRandom, lengthRandom) != null) {
		lengthRandom = randomGenerator(this.windowLength);
		widthRandom = randomGenerator(this.windowHeight);
	}

	player = new Player(this, lengthRandom, widthRandom, id);
	this.addStructure(player);

	this.players.push([lengthRandom, widthRandom, id]);
	return player;
}


function Stage() {
	this.actors = [];
	this.walls = [];
	this.players = [];
	this.clients = [];
	this.availableUsers = [0, 1, 2, 3, 4, 5, 6];

	this.windowLength = 15;
	this.windowHeight = 15;

	this.boxesList = 27;
	this.RegularMonsters = 6;
	this.jumpingMonsters = 1;
}

Stage.prototype.setupStage = function () {
	for (x = 0; x < this.windowLength; x++) {
		this.addStructure(new WallObject(this, x, 0));
		this.addStructure(new WallObject(this, x, (this.windowHeight - 1)));
		this.walls.push([x, 0]);
		this.walls.push([x, (this.windowHeight - 1)]);
	}
	for (y = 0; y < this.windowHeight; y++) {
		this.addStructure(new WallObject(this, 0, y));
		this.addStructure(new WallObject(this, (this.windowLength - 1), y));
		this.walls.push([0, y]);
		this.walls.push([(this.windowLength - 1), y]);
	}


	//add jumpingMonster code here
	var numJumpingMonsters = 0;
	var constructorJumping = this.jumpingMonsters;

	for (var j = 0; j < constructorJumping; j++) {
		var lengthRandom = randomGenerator(this.windowLength);
		var widthRandom = randomGenerator(this.windowHeight);
		if (this.getStructure(lengthRandom, widthRandom) == null) {
			this.addStructure(new JumpingMonster(this, lengthRandom, widthRandom));
		}
	}

	var numboxesList = 0;
	while (numboxesList < this.boxesList) {
		var lengthRandom = randomGenerator(this.windowLength);
		var widthRandom = randomGenerator(this.windowHeight);
		if (this.getStructure(lengthRandom, widthRandom) == null) {
			this.addStructure(new Box(this, lengthRandom, widthRandom));
			numboxesList++;
		}
	}

	numMonsters = 0;
	while (numMonsters < this.RegularMonsters) {
		var lengthRandom = randomGenerator(this.windowLength);
		var widthRandom = randomGenerator(this.windowHeight);
		if (this.getStructure(lengthRandom, widthRandom) == null) {
			this.addStructure(new RegularMonsters(this, lengthRandom, widthRandom));
			numMonsters++;
		}
	}


}

Stage.prototype.step = function () {

	for (var i = 0; i < this.actors.length; i++) {
		this.actors[i].step();
	}
}

Stage.prototype.removeStructure = function (actor) {
	personIndex = this.actors.indexOf(actor);
	if (personIndex > -1) {
		this.actors.splice(personIndex, 1);
	}

	if (actor instanceof Player) {
		this.availableUsers.push(actor.ID);
		this.availableUsers.sort();

		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i][2] == actor.ID) {
				this.players.splice(i, 1)
				break;
			}
		}
	}

	jsonSocketMessage = {
		socketMessage: 'delete_from_board',
		pos: [actor.x, actor.y]
	};

	if (actor instanceof RegularMonsters) {
		this.RegularMonsters--;
		if (this.RegularMonsters == 0 && this.JumpingMonsters == 0) {
			for (i = 0; i < messages.length; i++) {
				messages.splice(i, 1);
			}
			//if all monsters gone, this is a Win, send that back through socket HERE
			jsonSocketMessage = {socketMessage: "user_win"};

		}
	}

	if (actor instanceof JumpingMonster) {
		this.JumpingMonsters--;
		if (this.JumpingMonsters == 0 && this.JumpingMonsters == 0) {
			for (i = 0; i < messages.length; i++) {
				messages.splice(i, 1);
			}
			//if all monsters gone, this is a Win, send that back through socket HERE
			jsonSocketMessage = {socketMessage: "user_win"};
		}
	}

	jsonSocketMessage = JSON.stringify(jsonSocketMessage);
	wss.clients.forEach(function each(client) {
		client.send(jsonSocketMessage);
	});
}

Stage.prototype.addStructure = function (actor) {
	this.actors.push(actor);
}

Stage.prototype.getStructure = function (x, y) {
	for (var i = 0; i < this.actors.length; i++) {
		if ((this.actors[i].x == x) && this.actors[i].y == y) {
			return this.actors[i];
		}
	}
	return null;
}

function Structure(stage, x, y) {
	this.x = x;
	this.y = y;
	this.stage = stage;
};

Structure.prototype.move = function (actor, dx, dy) {

	oldx = actor.x;
	oldy = actor.y;
	type = "";

	actor.x += dx;
	actor.y += dy;

	if (actor instanceof Box) {
		type = "Box";
	} else if (actor instanceof RegularMonsters) {
		type = "RegularMonsters";
	} else if (actor instanceof JumpingMonster) {
		type = "JumpingMonster";
	} else {
		type = "Player";
	}
	var playersList = stage.players;


	jsonSocketMessage = {
		socketMessage: 'board_update',
		playersList: playersList.length,
		oldPos: [oldx, oldy],
		newPos: [actor.x, actor.y],
		pType: type,
		pID: actor.ID
	};
	jsonSocketMessage = JSON.stringify(jsonSocketMessage);

	wss.clients.forEach(function each(socketClient) {
		socketClient.send(jsonSocketMessage);
	});
};

Structure.prototype.step = function () {};

Player.prototype = new Structure();

function Player(stage, x, y, ID) {
	Structure.call(this, stage, x, y);
	this.ID = ID;
}

Player.prototype.step = function (keyPress, index) {
	coordinateFieldX = 5;
	coordinateFieldY = 5;

	if (keyPress == 'w') {
		coordinateFieldX = -1;
		coordinateFieldY = 0;
	}
	if (keyPress == 'e') {
		coordinateFieldX = -1;
		coordinateFieldY = 1;
	}
	if (keyPress == 'd') {
		coordinateFieldX = 0;
		coordinateFieldY = 1;
	}
	if (keyPress == 'x') {
		coordinateFieldX = 1;
		coordinateFieldY = 1;
	}
	if (keyPress == 's') {
		coordinateFieldX = 1;
		coordinateFieldY = 0;
	}
	if (keyPress == 'z') {
		coordinateFieldX = 1;
		coordinateFieldY = -1;
	}
	if (keyPress == 'a') {
		coordinateFieldX = 0;
		coordinateFieldY = -1;
	}
	if (keyPress == 'q') {
		coordinateFieldX = -1;
		coordinateFieldY = -1;
	}

	if ((coordinateFieldX != 5) && (coordinateFieldX != 5)) {
		if (this.move(coordinateFieldX, coordinateFieldY)) {
			this.stage.players[index][0] += coordinateFieldX;
			this.stage.players[index][1] += coordinateFieldY;
		}
	}
};

Player.prototype.move = function (dx, dy) {

	newX = this.x + dx;
	newY = this.y + dy;
	actor = this.stage.getStructure(newX, newY);

	if (actor instanceof RegularMonsters) {
		var pid = this.ID;
		globalUsers.splice(-1, 1);
		jsonSocketMessage = {
			socketMessage: 'user_dead',
			listOfUsers: globalUsers
		}
		jsonSocketMessage = JSON.stringify(jsonSocketMessage);
		wss.clients.forEach(function each(socketClient) {
			if (socketClient.userID == pid) {
				socketClient.send(jsonSocketMessage);
			}
		});

	}

	if (actor instanceof JumpingMonster) {
		var pid = this.ID;
		globalUsers.splice(-1, 1);
		jsonSocketMessage = {
			socketMessage: 'user_dead',
			listOfUsers: globalUsers
		}
		jsonSocketMessage = JSON.stringify(jsonSocketMessage);
		wss.clients.forEach(function each(socketClient) {
			if (socketClient.userID == pid) {
				socketClient.send(jsonSocketMessage);
			}
		});

	}

	if (actor instanceof Player) {
		return false;
	};

	if (actor != null) {
		if (!actor.move(dx, dy)) {
			return false;
		}
	}
	Structure.prototype.move(this, dx, dy);
	return true;
};

WallObject.prototype = new Structure();

function WallObject(stage, x, y) {
	Structure.call(this, stage, x, y);
};

WallObject.prototype.move = function () {
	return false;
};

Box.prototype = new Structure();

function Box(stage, x, y) {
	Structure.call(this, stage, x, y);
};

Box.prototype.move = function (dx, dy) {
	newX = this.x + dx;
	newY = this.y + dy;
	actor = this.stage.getStructure(newX, newY);

	if (actor instanceof Player) {
		return false;
	};

	if (actor != null) {
		if (!actor.move(dx, dy)) {
			return false;
		}
	}

	Structure.prototype.move(this, dx, dy);
	return true;
};

RegularMonsters.prototype = new Structure();

function RegularMonsters(stage, x, y) {
	Structure.call(this, stage, x, y);
	this.dx = Math.round(Math.random()) * 2 - 1;
	this.dy = Math.round(Math.random()) * 2 - 1;
};

RegularMonsters.prototype.step = function (i) {
	this.move(this, this.dx, this.dy);
	var monsterDead = true;

	for (x = this.x - 1; x <= this.x + 1; x++) {
		for (y = this.y - 1; y <= this.y + 1; y++) {
			actor = this.stage.getStructure(x, y);
			if ((actor == null) || (actor instanceof Player)) {
				monsterDead = false;
			}
		}
	}

	if (monsterDead) {
		this.stage.removeStructure(this);
	};
};

RegularMonsters.prototype.move = function (other, dx, dy) {
	if (other != this) {
		return false;
	};

	newX = this.x + this.dx;
	newY = this.y + this.dy;
	actor = this.stage.getStructure(newX, newY);

	if (actor instanceof Player) {
		jsonSocketMessage = {
			socketMessage: 'user_dead'
		}
		jsonSocketMessage = JSON.stringify(jsonSocketMessage);
		var aid = actor.ID;

		wss.clients.forEach(function each(socketClient) {
			if (socketClient.userID == aid) {
				socketClient.send(jsonSocketMessage);
			}
		});
	}

	if ((actor != null) && !(actor instanceof Player)) {
		this.dx = -this.dx;
		this.dy = -this.dy;
		return false;
	}

	Structure.prototype.move.call(this, this, dx, dy);
	return true;
};

//JUMPING MONSTER HERE

function JumpingMonster(stage, x, y) {
	Structure.call(this, stage, x, y);

	this.dx = Math.round(Math.random()) * 2 - 1;
	this.dy = Math.round(Math.random()) * 2 - 1;
	console.log("the variables are");
	console.log(this.dx);
	console.log(this.dy);
};

JumpingMonster.prototype = new Structure();

JumpingMonster.prototype.step = function (i) {
	this.move(this, this.dx, this.dy);
	var monsterDead = true;

	for (x = this.x - 1; x <= this.x + 1; x++) {
		for (y = this.y - 1; y <= this.y + 1; y++) {
			actor = this.stage.getStructure(x, y);
			if ((actor == null) || (actor instanceof Player)) {
				monsterDead = false;
			}
		}
	}

	if (monsterDead) {
		this.stage.removeStructure(this);
	};
};

JumpingMonster.prototype.move = function (other, dx, dy) {
	if (other != this) {
		return false;
	};
	console.log("another interation");
	console.log('existing values of x & y  are');
	console.log(this.x);
	console.log(this.y);
	console.log("this is what's in dx & dy");
	console.log(this.dx);
	console.log(this.dy);
	newX = this.x + this.dx;
	console.log('the sums are');
	console.log(newX);
	if ((newX > 14) || (newX < 0)) {
		console.log('its greater than 14, or negative, so it resets');
		newX = this.dx;
	}
	console.log("new x after reset is " + newX);
	console.log(newX);
	newY = this.y + this.dy;
	if ((newY > 14) || (newY < 0)) {
		console.log('its greater than 14, or negative, so it resets');
		newY = this.dy;
	}
	console.log("new y after reset is " + newY);
	console.log(newY);
	temporaryNewX = newX;
	temporaryNewY = newY;
	actor = this.stage.getStructure(temporaryNewX, temporaryNewY);

	if (actor instanceof Player) {
		jsonSocketMessage = {
			socketMessage: 'user_dead'
		}
		jsonSocketMessage = JSON.stringify(jsonSocketMessage);
		var aid = actor.ID;

		wss.clients.forEach(function each(socketClient) {
			if (socketClient.userID == aid) {
				socketClient.send(jsonSocketMessage);
			}
		});
	}

	if ((actor != null) && !(actor instanceof Player) && !(actor instanceof RegularMonsters)) {
		this.dx = -this.dx;
		this.dy = -this.dy;
		return false;
	}

	Structure.prototype.move.call(this, this, dx, dy);
	return true;
};
