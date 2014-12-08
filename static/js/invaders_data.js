
var skinpath = '';

//load images
var playerimages = ['player.png','player_expired.png'];
var miscimages = ['levelup.png'];
var enemyimages = ['enemy1.png','enemy1_end.png'];
var shotimages = ['shot1.png'];

playerimages = preloadImages(playerimages);
miscimages = preloadImages(miscimages);
enemyimages = preloadImages(enemyimages);
shotimages = preloadImages(shotimages);

//preload images
function preloadImages(array){
    var imagedir = 'static/img/' + skinpath;
    var tempimg;
    for(i in array){
        tempimg = new Image();
        tempimg.src = imagedir + array[i];
        array[i] = tempimg;
    }
    return(array);
}

function playerdata(canvas){
    /*
    FIXME at some point would be good to standardise all this data so we can load it in a single function
    var playerdata = [
        {
            'img': playerimages[0],
            'expired':playerimages[1],
            'level': 1,
            'xp': 1,
            'width': pwidth,
            'height': pheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
        }
    ]
    */
}

//function to return all the enemy information
function enemydata(canvas){
    var enemywidth = canvas.width / 20; //30;
    var enemyheight = canvas.width / 20; //30;
    var spritewidth = 30;
    var spriteheight = 30;

    //all calculations are done on the assumption that the general dimensions are 600x800
    //vertposmin = closest this can be positioned to the top
    //vertposmax = closest this can be positioned to the bottom
    var enemydata = [
        {
            'type': '',
            'img': enemyimages[0],
            'expired':enemyimages[1],
            'speed': 0.4,
            'level': 1,
            'xp': 1,
            'vertposmin': canvas.height / 4,
            'vertposmax': canvas.height - (canvas.height / 8),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
            'levelcount': [10]
        }

    ];
    return(enemydata);
}

//function to return all the powerups information
function objdata(canvas){
    var objwidth = canvas.width / 20; //30px;
    var objheight = canvas.width / 20; //30px;

    var objdata = [
        {
            'type': 'teleport',
            'img': objectimages[0],
            'vertposmin': canvas.height / 10,
            'vertposmax': canvas.height - (canvas.height / 10),
            'action':0,
            'width': objwidth,
            'height': objheight
        }
    ];
    return(objdata);
}
