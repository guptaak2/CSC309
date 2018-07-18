require('../../constants');
// var url = global.wwWsURL;
var url = "ws://localhost:10881";

person_game = false;
stage = null;
var score = 0;

setInterval(intervalScore, 1000);

function intervalScore() {
    $('#score').html("Score: " + score);
    score++;
}

function player_movement(place) {
    message = {
        lType: 'step',
        direction: place
    };
    message = JSON.stringify(message);
    socket.send(message);
}

function update_board(oldPos, newPos, type, pID) {
    oldID = oldPos[0] + "," + oldPos[1];
    document.getElementById(oldID).src = "icons/blank.gif";
    newID = newPos[0] + "," + newPos[1];
    if (type == 'JumpingMonster') {
        document.getElementById(newID).src = "icons/jumping.png";
    }
    if (type == 'Monster') {
        document.getElementById(newID).src = "icons/face-devil-grin-24.png";
    }
    if (type == 'Box') {
        document.getElementById(newID).src = "icons/emblem-package-2-24.png";
    }
    if (type == 'Player') {
        playerID = 'p' + String(pID)
        document.getElementById(newID).src = document.getElementById(playerID).src;
    }
}

function keysCheck(keyboardEvent) {
    keyInput = String.fromCharCode(keyboardEvent.keyCode).toLowerCase();
    if (person_game) {
        if (keyInput == 'w') {
            player_movement('w');
        } else if (keyInput == 'e') {
            player_movement('e');
        } else if (keyInput == 'd') {
            player_movement('d');
        } else if (keyInput == 'x') {
            player_movement('x');
        } else if (keyInput == 's') {
            player_movement('s');
        } else if (keyInput == 'a') {
            player_movement('a');
        } else if (keyInput == 'd') {
            player_movement('d');
        } else if (keyInput == 'q') {
            player_movement('q');
        } else if (keyInput == 'z') {
            player_movement('z');
        }
    }
}

function tableGenerate() {
    table = '<table border=1>';
    for (i = 0; i < 15; i++) {
        table += '<tr">';
        for (j = 0; j < 15; j++) {
            table += '<td> <img src=icons/blank.gif id="' + i + ',' + j + '" height = 24, width = 24/> </td>';
        }
        table += '</tr>';
    }
    table += '</table>';
    document.getElementById('stage').innerHTML = table;
}

export function runClient() {
    document.onkeydown = keysCheck;
    socket = new WebSocket(url);
    socket.onopen = function (event) {
        message = {
            lType: 'load'
        }
        message = JSON.stringify(message);
        socket.send(message);
        console.log("connected");
    };
    socket.onclose = function (event) {
        console.log("socket is closing!!!");
    };

    socket.onmessage = function (event) {
        json = JSON.parse(event.data);
        if (json.lType == 'delete_from_board') {
            id = json.pos[0] + ',' + json.pos[1];
            document.getElementById(id).src = "icons/blank.gif";
        }

        if (json.lType == 'load') {
            score = 0;
            person_game = true;

            tableGenerate();

            for (var i = 0; i < (json.walls).length; i++) {
                id = (json.walls)[i][0] + "," + (json.walls)[i][1]
                document.getElementById(id).src = "icons/wall.jpeg";
            }

            for (var i = 0; i < (json.monster).length; i++) {
                id = (json.monster)[i][0] + "," + (json.monster)[i][1]
                document.getElementById(id).src = "icons/face-devil-grin-24.png";
            }

            //jumping Monster
            for (var i = 0; i < (json.jumpingMonsters).length; i++) {
                id = (json.jumpingMonsters)[i][0] + "," + (json.jumpingMonsters)[i][1]
                document.getElementById(id).src = "icons/jumping.png";
            }

            for (var i = 0; i < (json.box).length; i++) {
                id = (json.box)[i][0] + "," + (json.box)[i][1]
                document.getElementById(id).src = "icons/emblem-package-2-24.png";
            }

            for (var i = 0; i < (json.players).length; i++) {
                id = (json.players)[i][0] + "," + (json.players)[i][1]
                pID = 'p' + String((json.players)[i][2]);
                document.getElementById(id).src = document.getElementById(pID).src;
            }

        }

        if (json.lType == 'board_update') {
            update_board(json.oldPos, json.newPos, json.pType, json.pID);
        }

        if (json.lType == 'user_dead') {
            person_game = false;
            message = {
                lType: 'user_dead'
            };
            message = JSON.stringify(message);
            socket.send(message);
        }
    }
};
