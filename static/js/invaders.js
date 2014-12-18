//initialise canvas variables
var canvas;
var canvas_cxt;
var game = 0;
var gamepause = 0;
var gameloop;
var level = 1;
var victory = 0;

var player;
var enemies = [];
var objects = [];
var messages = [];
var playershots = [];
var enemyshots = [];

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//generic collision checking function between any given object and the player
function checkPlayerCollision(obj,tp){
    //rule out any possible collisions, remembering that all y numbers are inverted on canvas
    //player bottom edge is higher than object top edge
    if(tp.ypos + tp.actorheight < obj.ypos)
        return(0);
    //player top edge is lower than obj bottom edge
    if(tp.ypos > obj.ypos + obj.actorheight)
        return(0);
    //player left edge is to the right of obj right edge
    if(tp.xpos > obj.xpos + obj.actorwidth)
        return(0);
    //player right edge is to the left of obj left edge
    if(tp.xpos + tp.actorwidth < obj.xpos)
        return(0);

    return(1); //collision
}


(function( window, undefined ) {
var lenny = {
    general: {
        //set up function, starts it off
        initialise: function(){
            canvas = document.getElementById('canvas');
            this.initCanvasSize();
            canvas_cxt = lenny.general.initCanvas(canvas,canvas_cxt);
            this.initGame();
            lenny.game.gameLoop();
        },
        initCanvasSize: function(){
            //ideal size for canvas
            var destwidth = 600;
            var destheight = 800;
            var aspect = Math.floor(($(window).height() / destheight) * destwidth);

            var cwidth = Math.min(destwidth, $(window).width());
            var cheight = Math.min(destheight, $(window).height());

            //resize the canvas to maintain aspect ratio depending on screen size
            canvas.width = Math.min($(window).width(),aspect);
            canvas.height = (canvas.width / destwidth) * destheight;
        },
        //initialise the canvas and return the canvas context
        initCanvas: function(canvas, cxt){
            if(canvas.getContext){
                cxt = canvas.getContext('2d');
            }
            else {
                $('#' + canvas).html("Your browser does not support canvas. Sorry.");
            }
            return cxt;
        },
        initGame: function(){
            game = 1;
            player = 0;
            enemies = [];
            objects = [];

            lenny.people.setupPlayer();
            lenny.people.setupEnemies();
            //lenny.people.setupObjects();
        },
        //pause the game for a few milliseconds
        pauseGame: function(){
            gamepause = 1;
            clearTimeout(gameloop);
            setTimeout(lenny.general.resumeGame,140);
        },
        //resume the game
        resumeGame: function(){
            gamepause = 0;
            gameloop = setTimeout(lenny.game.gameLoop,15);
        },
        endGame: function(){
            canvas_cxt.font = "30px Arial";
            canvas_cxt.fillStyle = "#000000";
            canvas_cxt.textAlign = "center";
            game = 0;
            player.score = player.score * level;
        },
        //draw some object on the canvas
        drawOnCanvas: function(object, cxt){
            cxt.drawImage(object.sprite, object.spritex, object.spritey, object.spritewidth, object.spriteheight, object.xpos, object.ypos, object.actorwidth, object.actorheight);
        },
        //completely clear the canvas
        clearCanvas: function(canvas, cxt){
            cxt.clearRect(0, 0, canvas.width, canvas.height);//clear the canvas
            var w = canvas.width;
            canvas.width = 1;
            canvas.width = w;
        }
    },
    people: {
        //initialise data for the player object
        setupPlayer: function(){
            player = new playerObj("Player 1","player",playerimages[0],20,20,canvas.width / 20,canvas.width / 20);
            player.info();
            player.xpos = (canvas.width / 2) - (player.actorwidth / 2);
            player.ypos = canvas.height - (player.actorheight * 2);
        },
        //initialise data for the enemies
        setupEnemies: function(){
            var enemyinfo = enemydata(canvas);
            var enemycount = 50;
            var enemytmp;

            for(var i = 0; i < enemyinfo.length; i++){ //loop through the enemy data
                for(var j = 0; j < enemyinfo[i]['levelcount'][level - 1]; j++){ //show as many enemies per level as the data states
                    enemyx = getRandomArbitrary(0,canvas.width); //randomly position x FIXME
                    enemyy = getRandomArbitrary(enemyinfo[i]['vertposmin'],enemyinfo[i]['vertposmax']); //FIXME

                    enemytmp = new enemyobj();
                    enemytmp.sprite = enemyinfo[i]['img'];
                    enemytmp.expiredimage = enemyinfo[i]['expired'];
                    enemytmp.spritewidth = enemyinfo[i]['spritewidth'];
                    enemytmp.spriteheight = enemyinfo[i]['spriteheight'];
                    enemytmp.actorwidth = enemyinfo[i]['width'];
                    enemytmp.actorheight = enemyinfo[i]['height'];
                    if(!enemyinfo[i]['xpos'] && !enemyinfo[i]['ypos']){
                        enemytmp.xpos = getRandomArbitrary(0,canvas.width); //randomly position x
                        enemytmp.ypos = getRandomArbitrary(enemyinfo[i]['vertposmin'],enemyinfo[i]['vertposmax']);
                    }
                    else {
                        enemytmp.xpos = enemyinfo[i]['xpos']
                        enemytmp.ypos = enemyinfo[i]['ypos']
                    }
                    enemytmp.etype = enemyinfo[i]['type'];
                    enemytmp.range = getRandomArbitrary(50,canvas.width / 4); //distance the enemy will move
                    enemytmp.direction = getRandomArbitrary(0,1);
                    enemytmp.startpos = enemytmp.xpos;
                    enemytmp.xp = enemyinfo[i]['xp'];
                    enemytmp.level = enemyinfo[i]['level'];
                    enemytmp.moveby = enemyinfo[i]['speed'];
                    enemies.push(enemytmp);
                }
            }
        },
        //initialise data for power ups
        /*
        setupObjects: function(){
            var objectinfo = objdata(canvas);
            var objcount = 5;
            var objtmp;

            for(i = 0; i < objcount; i++){
                thisobj = Math.floor(getRandomArbitrary(0,objectinfo.length));
                objtmp = new objectobj();
                objtmp.sprite = objectinfo[thisobj]['img'];
                objtmp.actorwidth = objectinfo[thisobj]['width'];
                objtmp.actorheight = objectinfo[thisobj]['height'];
                objtmp.xpos = getRandomArbitrary(canvas.width / 10,canvas.width - canvas.width / 10); //randomly position x
                objtmp.ypos = getRandomArbitrary(objectinfo[thisobj]['vertposmin'],objectinfo[thisobj]['vertposmax']);
                objtmp.actiontype = objectinfo[thisobj]['action'];
                objects.push(objtmp);
            }
        }
        */
    },
    game: {
        gameLoop: function(){ //put code in here that needs to run for the game to work
            if(game){
                lenny.general.clearCanvas(canvas,canvas_cxt); //clear canvas, seems to be causing massive horrible flickering in firefox
                //canvas_cxt.drawImage(levelimages[level - 1],0,0,levelimages[0].width,levelimages[0].height,0,0,canvas.width,canvas.height); //draw level
                for(var i = 0; i < objects.length; i++){ //draw objects
                    objects[i].runActions();
                    if(objects[i].checkCollision(player))
                        objects.splice(i, 1);
                }
                for(var i = 0; i < enemies.length; i++){ //draw enemies
                    //if(enemies[i].checkCollision(player))
                        //enemies.splice(i, 1);
                    enemies[i].runActions();
                    enemies[i].move();
                }
                player.runActions(); //draw player
                for(var i = 0; i < messages.length; i++){ //draw messages
                    if(messages[i].checkLifeSpan()){
                        messages.splice(i,1);
                    }
                    else {
                        messages[i].drawMessage();
                    }
                }
                for(var i = 0; i < playershots.length; i++){
                    var ishit = playershots[i].checkCollision();
                    if(ishit){
                        console.log('hit!');
                        playershots.splice(i,1);
                        enemies.splice(ishit-1, 1);
                    }
                    else {
                        playershots[i].move();
                        playershots[i].draw();
                    }
                }

                if(victory){
                    lenny.general.endGame();
                }
                if(!gamepause){
                    gameloop = setTimeout(lenny.game.gameLoop,15); //repeat
                }
                else {
                    clearTimeout(gameloop);
                }
            }
            else {
                if(victory){
                    canvas_cxt.fillText("CONGRATULATIONS", canvas.width / 2, canvas.height - 60);
                }
                else {
                    canvas_cxt.fillText("GAME OVER", canvas.width / 2, canvas.height - 60);
                }
                canvas_cxt.fillText("Score: " + player.score, canvas.width / 2, canvas.height - 30);
                canvas_cxt.font = "14px Arial";
                canvas_cxt.fillText("Click to play again", canvas.width / 2, canvas.height - 10);
            }
        }
    }
};
window.lenny = lenny;
})(window);

//do stuff
window.onload = function(){
    lenny.general.initialise();

    $(window).on('resize',function(){
        resetAndResize();
    });

    $('#canvas').mousemove(function(e){
        if(!player.active){
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            player.xpos = parseInt(relX);
            //allow mouse to move player vertically as well for collision detection testing
            //var relY = e.pageY - parentOffset.top;
            //player.ypos = parseInt(relY);

        }
    });

    $('#canvas').on('click',function(e){
        player.fire();
    });

    function resetAndResize(){
        game = 0;
        level = 1;
        victory = 0;
        clearTimeout(gameloop);
        lenny.general.initCanvasSize();
        lenny.general.initGame();
        lenny.game.gameLoop();
    }

};