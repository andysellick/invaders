
//generic object
var genericObj = function(objname,objtype,sprite,spritewidth,spriteheight,actorwidth,actorheight){
    this.objname = objname;
    this.objtype = objtype;
    this.sprite = sprite;
    this.spritexy;
    this.spritewidth = spritewidth;
    this.spriteheight = spriteheight;

    this.xpos;
    this.ypos;
    this.actorwidth = actorwidth;
    this.actorheight = actorheight;
    
    this.info = function(){
        console.log(objname,objtype,sprite,spritewidth,spriteheight,actorwidth,actorheight);
    };

    this.draw = function(){
        lenny.general.drawOnCanvas(this,canvas_cxt);
    };
}

//extends generic object for character objects e.g. player, enemies
var characterObj = function(objname,objtype){
    genericObj.apply(this,arguments);
}

characterObj.prototype = genericObj.prototype;
characterObj.prototype.constructor = characterObj;


//var playerObj = function(objname,objtype){
//}

//specific object for the player
var playerObj = function(){
    characterObj.apply(this,arguments);

    this.points = 0;
    this.level = 1;
    this.xp = 1;
    this.score = 1;
    this.active = 0;
    this.shotexists = 0;

    this.fire = function(){
        if(!this.shotexists){
            //this.shotexists = 1;
            shot = new shotObj;
            shot.xpos = this.xpos;
            shot.ypos = this.ypos;
            shot.direction = 1;
            playershots.push(shot);
        }
    };

    //if the player has levelled up
    this.levelUp = function(levelup){
        if(this.xp > 2 || levelup){
            this.level += 1;
            this.xp = 0;
            //FIXME now create a new message and append it to the message stack
            message = new messageObj();
            message.xpos = this.xpos;
            message.ypos = this.ypos - message.actorheight;
            messages.push(message);
        }
        //console.log("xp: %d, score: %d, level: %d.",player.xp,player.score,player.level);
    };
    this.expire = function(){
        //change the player image to represent defeat
        this.sprite = allimages[2];
        return(0);
    };
}

playerObj.prototype = characterObj.prototype;
playerObj.prototype.constructor = playerObj;




//laser object
function shotObj(){
    this.sprite = shotimages[0];
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 30;
    this.spriteheight = 30;
    this.actorwidth = canvas.width / 20; //30
    this.actorheight = canvas.width / 20; //30
    this.xpos;
    this.ypos;
    this.speed = canvas.height / 200;
    this.direction;

    this.draw = function(){
        lenny.general.drawOnCanvas(this,canvas_cxt);
    };

    this.move = function(){
        if(this.direction){ //shot fired by player, goes up
            this.ypos -= this.speed;
        }
        else { //shot fired by enemy, goes down
            this.ypos += this.speed;
        }
    };
    this.checkCollision = function(){
        for(var i = 1; i <= enemies.length; i++){
            if(checkPlayerCollision(enemies[i-1],this)){
                enemies[i-1].moveby = 0;
                return(i);
            }
        }
        return(0);
    };
}

function messageObj(){
    this.sprite = allimages[3];
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 30;
    this.spriteheight = 30;
    this.actorwidth = canvas.width / 20; //30
    this.actorheight = canvas.width / 20; //30
    this.xpos;
    this.ypos;
    this.lifespan = 40;

    //check to see if this message is due to disappear
    this.checkLifeSpan = function(){
        if(this.lifespan > 0){
            this.lifespan--;
            return(0);
        }
        else {
            return(1);
        }
    }
    this.drawMessage = function(){
        //console.log(this.sprite);
        lenny.general.drawOnCanvas(this,canvas_cxt);
    }
}



//general object for enemy
function enemyobj(){
    this.sprite;
    this.expiredimage;
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 0;
    this.spriteheight = 0;
    this.actorwidth;
    this.actorheight;
    this.xpos;
    this.ypos;

    this.etype;
    this.range = 0;
    this.direction = 0;
    this.startpos = 0;
    this.moveby = 0; //speed
    this.xp = 1;
    this.level = 1;

    this.runActions = function(){
        lenny.general.drawOnCanvas(this,canvas_cxt);
    };
    //move character left or right
    this.move = function(){
        if(this.moveby){
            if(this.direction){
                if(this.xpos > (this.startpos - (this.range / 2)))
                    this.xpos -= this.moveby;
                else
                    this.direction = 0;
            }
            else {
                if(this.xpos < (this.startpos + (this.range / 2)))
                    this.xpos += this.moveby;
                else
                    this.direction = 1;
            }
        }
    };
    //check to see if this enemy has hit the player
    this.checkCollision = function(theplayer){
        if(this.moveby || this.etype == 'boss'){
            if(checkPlayerCollision(this,theplayer)){
                //if we can kill this monster
                if(theplayer.level >= this.level){
                    //console.log("Pre collision - player xp: %d, score: %d, level: %d. Enemy xp: %d, level: %d",theplayer.xp,theplayer.score,theplayer.level,this.xp,this.level);
                    theplayer.xp += this.xp;
                    theplayer.score += this.xp;
                    theplayer.ypos += 10;
                    this.moveby = 0;
                    theplayer.levelUp(0);
                    //console.log("post collision - player xp: %d, score: %d, level: %d.",theplayer.xp,theplayer.score,theplayer.level);

                    //perform death of this enemy
                    this.spritewidth = 20; //reset this in case the enemy uses a larger sprite than the 'explosion' sprite
                    this.spriteheight = 20;
                    //switch to expired image for enemy, or use default
                    if(this.expiredimage){
                        this.sprite = this.expiredimage;
                    }
                    else {
                        this.sprite = expiredimages[0];
                    }
                    if(this.etype == 'boss'){
                        victory = 1;
                    }
                    else {
                        lenny.general.pauseGame();
                    }
                }
                else {
                    //theplayer.score = theplayer.level * theplayer.score;
                    theplayer.expire();
                    lenny.general.endGame();
                }
            }
        }
        return(0);
    };
}

//general object for object
function objectobj(){
    this.sprite;
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 20;
    this.spriteheight = 20;
    this.actorwidth;
    this.actorheight;
    this.xpos;
    this.ypos;

    this.active = 1;
    this.actiontype = 0;

    this.runActions = function(){
        lenny.general.drawOnCanvas(this,canvas_cxt);
    };
    //perform the action that happens when the player touches this object
    this.performTrigger = function(theplayer){
        this.active = 0;
        theplayer.points += 2;
        switch(this.actiontype){
            case 0: //teleport
                theplayer.ypos = Math.min(theplayer.ypos + canvas.height / 10, canvas.height - theplayer.actorheight);
                theplayer.xpos = getRandomArbitrary(canvas.width / 10, canvas.width - canvas.width / 10);
                break;
            case 1: //sword, nothing yet
                break;
            case 2: //increase party size
                //player width is width of canvas / 20, maximum width is 3x, i.e. 3 party companions
                theplayer.partysize += 1;
                theplayer.actorwidth = Math.min(theplayer.actorwidth + (canvas.width / 20), (canvas.width / 20) * 3);
                theplayer.spritewidth = Math.min(theplayer.spritewidth + 20, 60); //these numbers are hard coded to reflect the actual size of the sprite, i.e. 60x20
                if(theplayer.partysize < 4){
                    theplayer.xpos -= theplayer.actorwidth / 4;
                }
                break;
        }
    }
    //check to see if this object has hit the player
    this.checkCollision = function(theplayer){
        if(this.active){
            if(checkPlayerCollision(this,theplayer)){
                this.performTrigger(theplayer);
                theplayer.levelUp(1);
                return(1);
            }
        }
        return(0);
    };
}