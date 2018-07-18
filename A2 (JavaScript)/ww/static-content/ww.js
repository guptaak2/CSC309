// Stage
// Note: Yet another way to declare a class, using .prototype.

function Stage(width, height, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player

	// the logical width and height of the stage
	this.width=width;
	this.height=height;
    
    this.delay = 1000;
    this.paused = 0; // 0 is unpaused, 1 is paused
    
    // the element containing the score... duh
    this.score = 0;
    this.alive = 1; // 1 if player is alive, else dead
    
    this.testing = 0; // Take this out at the end

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	var s='<table id="Table1" border ="1">'; //border = "1"
	// YOUR CODE GOES HERE
    for(var i = 0; i < this.height; i++){ //row i
        s+='<tr>';
        for(var j = 0; j < this.width; j++){ //column j
            s+='<td>';
            s+='<div class="board"> <img src="icons/blank.gif" id='+i.toString()+':'+j.toString()+' /> </div>'
            s+='</td>';
        }
        s+='</tr>';
    }
	s+='</table>';
    
	// Put it in the stageElementID (innerHTML)
    this.stageElementID = s;
    document.getElementById("stage1").innerHTML = this.stageElementID;
;    
    // Add the player to the center of the stage
    var px = 10;
    var py = 10;
    if(this.width < 12 || this.height < 12){
        px = 1; py = 1;
    }
    this.setImage(px, py, 'icons/face-cool-24.png');
    this.player = new Actor(px, py, "player")
    this.addActor(this.player);

    // Add walls around the outside of the stage, so actors can't leave the stage
    for(var k = 0; k < this.width; k++){
        this.setImage(0, k, 'icons/wall.jpeg');
        this.setImage(this.height-1, k, 'icons/wall.jpeg');
    }
    for(var m = 0; m < this.height; m++){
        this.setImage(m, 0, 'icons/wall.jpeg');
        this.setImage(m, this.width-1, 'icons/wall.jpeg');
    }

	// Add some Boxes to the stage
    var boxes = ['1:2', '1:5', '1:14', '2:7', '2:17', '3:10', '3:12', '4:2', '4:6', '5:5', 
                '5:15', '5:16', '5:17', '6:1', '6:5', '6:12', '6:18', '7:7', '7:13', '8:5', 
                '8:11', '8:12', '8:16', '9:2', '9:4', '9:7', '9:12', '9:18', '10:2', '10:4', 
                '10:5', '10:8', '10:15', '11:9', '11:12', '12:6', '12:9', '12:12', '12:14',
                '13:2', '14:4', '14:12', '14:15', '15:1', '15:3', '15:7', '15:9', '15:11',
                '16:7', '16:8', '17:2', '17:13', '17:17', '17:18', '18:5', '18:9', '18:16',
                '18:2', '18:3', '18:10'];

    for(var l = 0; l < boxes.length; l++){
        var res = boxes[l].split(":"); // To check if box will fit on stage
        var x = parseInt(res[0]);
        var y = parseInt(res[1]);
        if((x >= 1 && x <=this.height-2) && (y >= 1 && y <= this.width-2)) {
            this.setImage(x, y, 'icons/emblem-package-2-24.png');
            this.addActor(new Actor(x, y, "box"));
        }
    }

    // Add in some Monsters
    var monsters = ['6:2', '5:9', '8:3', '9:16', '12:2', '16:3', '18:7', '18:12', '17:16','11:17'];
    var m_ways = ['ne', 'east', 'west', 'east', 'east', 'ne', 'south', 'east', 'nw', 'south'];
    for(var l = 0; l < monsters.length; l++){
        var res = monsters[l].split(":"); // To check if monster will fit on stage
        var x = parseInt(res[0]);
        var y = parseInt(res[1]);
        if((x >= 1 && x <=this.height-2) && (y >= 1 && y <= this.width-2)) {
            this.setImage(x, y, 'icons/face-devil-grin-24.png');
            this.addActor(new Monster(x, y, m_ways[l], "none"));
        }
    }
    
    // Add in some different monsters (can move in any direction when gets to an obstacle)
    var monsters2 = ['1:4'];
    var m_ways2 = ['ne'];
    for(var l = 0; l < monsters2.length; l++){
        var res = monsters2[l].split(":"); // To check if monster will fit on stage
        var x = parseInt(res[0]);
        var y = parseInt(res[1]);
        if((x >= 1 && x <=this.height-2) && (y >= 1 && y <= this.width-2)) {
            this.setImage(x, y, 'icons/face-devil-grin-24.png');
            this.addActor(new Monster(x, y, m_ways[l], "multi"));
        }
    } 
}

// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){
    return document.getElementById(x+':'+y).src;
}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
    var j = this.actors.indexOf(actor);
    this.actors.splice(j, 1);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
    document.getElementById(x+':'+y).src = src;
}

// Take one step in the animation of the game.  
Stage.prototype.step=function(actors){ //actors
    if(this.paused == 0 && this.alive == 1){
        if(actors != null){ // actors != null
            var num_of_monsters = 0;
            var monsters = [];
            //var monsters_way = [];
            for(var i=0;i<this.actors.length;i++){
                var actor = actors[i]; // TODO: SHOULD MAKE PARSING FUNC
                //var res = actor.split(":");
                //var n = parseInt(res[0]);
                //var o = parseInt(res[1]);
                if(actor.type == "monster"){ //stage.getActor(n, o) res[2]
                    monsters.push(actor);
                    //monsters_way.push(res[2]);
                    num_of_monsters++;
                    //console.log("int i: "+i+": ("+res[0]+":"+res[1]+") :"+res[2]);
                }
            }
            
            if(num_of_monsters == 0){
                alert("You won! Your Score: "+this.score);
                saveScore(this.score);
                topThree();
                this.alive = 0;
            }
            
            for(var j = 0; j < num_of_monsters; j++){
                if(this.checkObstacles(monsters[j]) == "blocked"){
                    //var res1 = monsters[j].split(":");
                    //var n1 = parseInt(res1[0]);
                    //var o1 = parseInt(res1[1]);
                    this.setImage(monsters[j].x, monsters[j].y, 'icons/blank.gif');
                    this.removeActor(monsters[j]);
                    this.score = this.score + 150;
                }
                else this.move(monsters[j], monsters[j].next, "normal");
            }
            //this.testing++;
            //console.log("for loop run: "+this.testing);
            this.score = this.score + 10;
            document.getElementById("score").innerHTML = this.score; // Updates score
        }
    }
}

// Returns "blocked" if actor is blocked from all sides
Stage.prototype.checkObstacles=function(actor){
    var ways = ["nw", "se", "ne", "sw", "west", "east", "north", "south"];
    var num_of_ways = ways.length;
    var blockedPaths = 0;
    var open_paths = [];
    for(var i = 0; i < num_of_ways; i++){
        var status = this.move(actor, ways[i], "check");
        if(status == "blocked"){
            blockedPaths++;
        }
        else open_paths.push(ways[i]);
    }
    
    if(blockedPaths == num_of_ways){
        return "blocked";
    }
    if(actor.quirk == "multi"){
        return open_paths;
    }
    return "clear";
}


// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
    var a = this.getStageId(x, y);
    if(a.includes("face-cool")) return "player";
    else if(a.includes("face-devil")) return "monster";
    else if(a.includes("emblem-package-2-24")) return "box";
    else if(a.includes("wall")) return "wall";
    return "blank";
}

// Moves actor in way specified by way paramter
// Type specifies what element to move
// WILL HAVE TO ADD SOMETHING TO PREVENT OVERRIDDING THE WALL
Stage.prototype.move=function(actor, way, type){
    // Checks for pause and state of player before any movement
    if(this.paused == 0 && this.alive == 1){
    var x = actor.x;
    var y = actor.y;
    var x2 = x; 
    var y2 = y;
    var original = this.getStageId(x, y); //document.getElementById(x+':'+y).src;
    var original_actor = this.getActor(x, y);
    if(way == "north"){
        x--;
    } else if(way == "nw"){
        x--; y--;
    } else if(way == "ne"){
        x--; y++;
    } else if(way == "south"){
        x++;
    } else if(way == "sw"){
        x++; y--;
    } else if(way == "se"){
        x++; y++;
    } else if(way == "west"){
        y--;
    } else if(way == "east"){
        y++;
    }    
    // Check what new location holds before moving
    var next = this.getActor(x, y);

    if(type == "check"){ // helps checkObstacles function
        if(next == "wall" || next == "box" || next == "monster"){
            return "blocked";
        }
        return "clear";
    } else if((actor.type == "box" || actor.type == "player") && next == "wall"){
        return "no move";
    } else if(actor.type == "box" && next == "monster"){
        return "no move";
    } else if(actor.type == "monster" && (next == "box" || next == "wall" || next == "monster")){ // For monster steps
        var new_way;
        
        // Multi-direction monsters
        if(actor.quirk == "multi"){
            var pos_ways = this.checkObstacles(actor);
            new_way = pos_ways[Math.floor(Math.random()*pos_ways.length)];
        } else {
            if(actor.next == "nw") new_way = "se";
            else if(actor.next == "se") new_way = "nw";
            else if(actor.next == "north") new_way = "south";
            else if(actor.next == "south") new_way = "north";
            else if(actor.next == "west") new_way = "east";
            else if(actor.next == "east") new_way = "west";
            else if(actor.next == "ne") new_way = "sw";
            else if(actor.next == "sw") new_way = "ne";
        }
        actor.next = new_way;
        return "no move";
    } else if((next == "monster" && actor.type == "player") || (next == "player" && actor.type == "monster")){
        alert("You lose. Your Score: "+this.score);
        saveScore(this.score);
		topThree();
		this.alive = 0;
        return "no move";
    } else {          //else if(next != "wall"){ // Checks if wall isn't in the way  
        if(next == "box" && (actor.type == "player" || actor.type == "box")){ // Checks if player/box encounters box
            var box_actor;
            for(var i = 0; i < this.actors.length; i++){
                if(this.actors[i].x == x && this.actors[i].y == y){
                    box_actor = this.actors[i];
                }
            }
            var can_move = this.move(box_actor, way, "normal"); // Recursive call to check if next box can move
            if(can_move == "no move"){
                return "no move";
            }
        }
        document.getElementById(x+":"+y).src = original; // Sets new1 location to the actor
        this.setImage(x2, y2, 'icons/blank.gif'); // Sets the original coordinates to blank
        actor.x = x;
        actor.y = y;
    }
    }
}

// End Class Stage

function Actor(x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
}

function Monster(x, y, next, quirk){
    Actor.call(this, x, y, "monster");
    this.next = next;
    this.quirk = quirk;
}