import '../constants';
import React, { Component } from 'react';
import north_west from './static_files/icons/north_west.svg';
import north from './static_files/icons/north.svg';
import north_east from './static_files/icons/north_east.svg';
import west from './static_files/icons/west.svg';
import east from './static_files/icons/east.svg';
import south_west from './static_files/icons/south_west.svg';
import south from './static_files/icons/south.svg';
import south_east from './static_files/icons/south_east.svg';
import blank from './static_files/icons/blank.gif';
import face_devil from './static_files/icons/face-devil-grin-24.png';
import jumping from './static_files/icons/jumping.png';
import emblem from './static_files/icons/emblem-package-2-24.png';
import box from './static_files/icons/box.png';
import wall from './static_files/icons/wall.jpeg';
import player_1 from './static_files/icons/1.png';
import player_2 from './static_files/icons/2.png';
import player_3 from './static_files/icons/4.png';  
import player_4 from './static_files/icons/7.png';
import player_5 from './static_files/icons/8.png';
import player_6 from './static_files/icons/9.png';
import $ from 'jquery';
var api_url = '/api/score/';

class Play extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let comp = this;
        let runGame = function (){
            var url = global.wwWsURL;
            var person_game = false;
            var score = 0;
            var intervalForScore = setInterval(intervalScore, 1000);
            var socket = new WebSocket(url);

            runClient();
            
            function intervalScore() {
                document.getElementById('score').innerHTML = ("Score: " + score);
                score++;
            }
            
            function player_movement(place) {
                var message = {
                    socketMessage: 'step',
                    direction: place
                };
                message = JSON.stringify(message);
                socket.send(message);
            }
            
            function update_board(oldPos, newPos, type, pID) {
                var oldID = oldPos[0] + "," + oldPos[1];
                document.getElementById(oldID).src = blank;
                var newID = newPos[0] + "," + newPos[1];
                if (type === 'JumpingMonster') {
                    document.getElementById(newID).src = blank;
                }
                if (type === 'RegularMonsters') {
                    document.getElementById(newID).src = face_devil;
                }
                if (type === 'Box') {
                    document.getElementById(newID).src = box;
                }
                if (type === 'Player') {
                    var playerID = 'p' + String(pID)
                    document.getElementById(newID).src = document.getElementById(playerID).src;
                }
            }
            
            function keysCheck(keyboardEvent) {
                var keyInput = String.fromCharCode(keyboardEvent.keyCode).toLowerCase();
                if (person_game) {
                    if (keyInput === 'w') {
                        player_movement('w');
                    } else if (keyInput === 'e') {
                        player_movement('e');
                    } else if (keyInput === 'd') {
                        player_movement('d');
                    } else if (keyInput === 'x') {
                        player_movement('x');
                    } else if (keyInput === 's') {
                        player_movement('s');
                    } else if (keyInput === 'a') {
                        player_movement('a');
                    } else if (keyInput === 'd') {
                        player_movement('d');
                    } else if (keyInput === 'q') {
                        player_movement('q');
                    } else if (keyInput === 'z') {
                        player_movement('z');
                    }
                }
            }
            
            function tableGenerate() {
                var table = '<table border=1>';
                for (var i = 0; i < 15; i++) {
                    table += '<tr">';
                    for (var j = 0; j < 15; j++) {
                        table += '<td> <img src='+ blank +' id="' + i + ',' + j + '" height = 24, width = 24/> </td>';
                    }
                    table += '</tr>';
                }
                table += '</table>';
                document.getElementById('stage').innerHTML = table;
            }

            function handleOrientation(event) {
                //https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
                var x = event.beta; // In degree in the range [-180,180]
                var y = event.gamma; // In degree in the range [-90,90]
                var orientation = window.msOrientation || (window.orientation || window.mozOrientation || {}).type;
                if (person_game) {
                    if (!(orientation === "portrait-primary")) {
                        if (y <= -75) {
                            player_movement('s');
                        } else if (y >= -20) {
                            player_movement('w');
                        } else if (x <= -15) {
                            player_movement('a');
                        } else if (x >= 20) {
                            player_movement('d');
                        }
                    } else {
                        if (y >= 30) {
                            player_movement('d');
                        } else if (y <= -30) {
                            player_movement('a');
                        } else if (x <= 15) {
                            player_movement('w');
                        } else if (x >= 80) {
                            player_movement('s');
                        }

                    }
                }
            }

            function submitScore() {
                console.log("submitting score");
                var payload = {
                    "score": score
                }
        
                var xhr = $.ajax({
                    type: 'POST',
                    url: api_url + comp.props.userName + "/",
                    headers: {"Authorization": comp.props.userToken},
                    data: payload,
                    success: function (data) {
                        alert("Score updated!!");
                    },
                    error: function (xhr, err) {
                        alert("score update failed.");
                    }
                });
        
                xhr.done(data => {
                    console.log("Score updated successfully!");
                    socket.close();
                    comp.props.submitScoreFunc();
                });
        
                xhr.fail(err => console.log(err));
            }
            
            function runClient() {
                document.onkeydown = keysCheck;
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', handleOrientation);
                }

                if (typeof window.DeviceMotionEvent !== 'undefined') {
                    var phoneSensitivity = 25;
                    var x1 = 0,
                        y1 = 0,
                        z1 = 0,
                        x2 = 0,
                        y2 = 0,
                        z2 = 0;

                    window.addEventListener('devicemotion', function (e) {
                        x1 = e.accelerationIncludingGravity.x;
                        y1 = e.accelerationIncludingGravity.y;
                        z1 = e.accelerationIncludingGravity.z;
                    }, false);

                    var mobileInterval = setInterval(mobileIntervalFunction, 200);
                }

                function mobileIntervalFunction() {
                    var changePosition = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);
                    if (person_game) {
                        if (changePosition > phoneSensitivity) {
                            var message = {
                                socketMessage: 'user_dead'
                            };
                            message = JSON.stringify(message);
                            socket.send(message);
                        }
                    }
                    x2 = x1;
                    y2 = y1;
                    z2 = z1;
                }

                socket.onopen = function (event) {
                    var message = {
                        socketMessage: 'loadStage',
                        userName: comp.props.userName
                    }
                    message = JSON.stringify(message);
                    socket.send(message);
                    console.log("connected");
                };

                socket.onclose = function (event) {
                    console.log("socket is closing!!!");
                };
            
                socket.onmessage = function (event) {
                    var json = JSON.parse(event.data);
                    if (json.socketMessage === 'delete_from_board') {
                        var id = json.pos[0] + ',' + json.pos[1];
                        document.getElementById(id).src = blank;
                    }
            
                    if (json.socketMessage === 'loadStage') {
                        var globalUsers = json.listOfUsers;
                        document.getElementById('list_users').innerHTML = ("Current players: " + globalUsers);
                        score = 0;
                        person_game = true;
            
                        tableGenerate();
            
                        for (var i = 0; i < (json.wallsList).length; i++) {
                            id = (json.wallsList)[i][0] + "," + (json.wallsList)[i][1]
                            document.getElementById(id).src = wall;
                        }
            
                        for (var a = 0; a < (json.monsterList).length; a++) {
                            id = (json.monsterList)[a][0] + "," + (json.monsterList)[a][1]
                            document.getElementById(id).src = face_devil;
                        }
            
                        //jumping Monster
                        for (var b = 0; b < (json.jumpingMonsters).length; b++) {
                            id = (json.jumpingMonsters)[b][0] + "," + (json.jumpingMonsters)[b][1]
                            document.getElementById(id).src = blank;
                        }
            
                        for (var c = 0; c < (json.boxList).length; c++) {
                            id = (json.boxList)[c][0] + "," + (json.boxList)[c][1]
                            document.getElementById(id).src = emblem;
                        }
            
                        for (var d = 0; d < (json.playersList).length; d++) {
                            id = (json.playersList)[d][0] + "," + (json.playersList)[d][1]
                            var pID = 'p' + String((json.playersList)[d][2]);
                            document.getElementById(id).src = document.getElementById(pID).src;
                        }
                    }
            
                    if (json.socketMessage === 'board_update') {
                        update_board(json.oldPos, json.newPos, json.pType, json.pID);
                    }

                    if (json.socketMessage === 'user_win') {
                        person_game = false;
                        var message = {
                            socketMessage: 'user_win'
                        };
                        message = JSON.stringify(message);
                        socket.send(message);
                        globalUsers = json.listOfUsers;
                        document.getElementById('list_users').innerHTML = ("Current players: " + globalUsers);
                        alert("You win bro!");
                        clearInterval(mobileInterval);
                        clearInterval(intervalForScore);
                        submitScore();
                    }
            
                    if (json.socketMessage === 'user_dead') {
                        person_game = false;
                        var message = {
                            socketMessage: 'user_dead'
                        };
                        message = JSON.stringify(message);
                        socket.send(message);
                        globalUsers = json.listOfUsers;
                        document.getElementById('list_users').innerHTML = ("Current players: " + globalUsers);
                        alert("You died bro!");
                        clearInterval(mobileInterval);
                        clearInterval(intervalForScore);
                        submitScore();
                    }
                }
            };
        }
        runGame();
    }

    render() {
        return (
            <div>
                <div>
                    <meta charSet="UTF-8" />
                        <div id="errors"> </div>
                        <br />
                        <br />
                        <h1 style={{color: 'white'}}> Game Rooms </h1>
                        <div id="messages" />
                            <center>
                            <div id="stage"> </div>
                            <center>
                                <p id="time" />
                                <input type="text" id="timeInSec" defaultValue={0} style={{display: 'none'}} />
                                <input type="text" id="scored" defaultValue={0} style={{display: 'none'}} />
                                <p id="status" />
                                <h2 id="ctrl">Controls</h2>
                                <table className="controls">
                                    <tbody><tr>
                                        <td>
                                            <img src={north_west} alt="north_west" id={113} className="btn" />
                                        </td>
                                        <td>
                                            <img src={north} alt="north" id={119} className="btn" />
                                        </td>
                                        <td>
                                            <img src={north_east} alt="north_east" id={101} className="btn" />
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <img src={west} alt="west" id={97} className="btn" />
                                        </td>
                                        <td>&nbsp;</td>
                                        <td>
                                            <img src={east} alt="east" id={100} className="btn" />
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <img src={south_west} alt="south_west" id={122} className="btn" />
                                        </td>
                                        <td>
                                            <img src={south} alt="south" id={120} className="btn" />
                                        </td>
                                        <td>
                                            <img src={south_east} alt="south_east" className="btn" id={99}/>
                                        </td>
                                        </tr>
                                    </tbody></table>
                            </center>
                            <table className="legend " cellPadding={7}>
                                <tbody><tr>
                                    <td>
                                    <img src={player_1} alt="player_1" id="p0" style={{display: 'none'}} height={35} width={35} /> </td>
                                </tr>
                                <tr>
                                    <td>
                                    <img src={player_2} alt="player_2" id="p1" style={{display: 'none'}} height={35} width={35} /> </td>
                                </tr>
                                <tr>
                                    <td>
                                    <img src={player_3} alt="player_3" id="p2" height={35 } style={{display: 'none'}} width={35} /> </td>
                                </tr>
                                <tr>
                                    <td>
                                    <img src={player_4} alt="player_4" id="p3" height={35 } style={{display: 'none'}} width={35} /> </td>
                                </tr>
                                <tr>
                                    <td>
                                    <img src={player_5} alt="player_5" id="p4" height={35 } style={{display: 'none'}} width={35} /> </td>
                                </tr>
                                <tr>
                                    <td>
                                    <img src={player_6} alt="player_6" id="p5" height={35 } style={{display: 'none'}} width={35} /> </td>
                                </tr>
                            </tbody></table>
                        <button id="btnQuit " type="submit " className="btn-game " onclick="quit(); ">Quit</button>
                        <p id="score">Score: 0</p>
                        <p id="list_users">Current players: 0</p>
                    </center>
                </div>
            </div>
        )
    }
}

export default Play;