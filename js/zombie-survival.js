var c, ctx;

var butsize = 50;

var base_size = 80;
var base_spawnrate = 500;
var base_stink_dist = 12;

var bullet_size;
var tile_size;

var bullet_velocity;
var player_velocity;
var player_velocity_x;
var player_velocity_y;
var mob_velocity;
var spawn_rate;

var mobskill;//#TODO
var mobszaglas;//#TODO
var stinkd;
var stink_dist;

var trouble_rate = 250;
var current_trouble;
var next_trouble;
var zoom_size = 2;
var zoom_duration = 5;
var explosion_size = 2;
var slow_scale = 8;
var slow_duration = 7;
var fast_active = false;
var fast_scale = 2;
var fast_duration = 4;
var unarmed_active = false;
var unarmed_duration = 5;
var stinky_scale = 2;
var stinky_duration = 10;
var reverse_active = false;
var reverse_duration = 5;
var blackout_active = false;
var blackout_duration = 8;
var blackout_day = 15;
var blackout_night = 35;
var blackout_is_dark = false;

var wall_rate = 35;
var wall_min = 3;
var wall_max = 5;

var map_width = 50;
var map_height = 50;

var tick = 10;
var timer;

var anim_index = 0;
var animation_rate = 2;

var score;
var highscore = -1;

var m;//Map m;
var p_player;//Player p;
var mobs; //List<Mob> mobs = new List<Mob>();
var bullets; //List<Bullet> bullets = new List<Bullet>();

var bullets_trash = [];
var mobs_trash = [];
//var trouble_trash = [];

var pressedKey = []; //HashSet<int> pressedKey = new HashSet<int>();
var buttons = [];

var lose = false;

var directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
var tiles_pos_x; // i*tile_size
var tiles_pos_y; // j*tile_size
var corigate_x;// = 640 / 2 + tile_size/2;
var corigate_y;// = 480 / 2 + tile_size/2;
var corigate_bullet;// tile_size/2 - bullet_size/2

var view_keret = 10;
var view_width, view_height;

var arrows;

var info1;
var info2;
var info3;

//Images

const crateImage = new Image(256, 256);
crateImage.src = './res/crate.png';

const floorImage = new Image(345, 345);
floorImage.src = './res/floor.jpg';

const bulletRightImage = new Image(128, 128);
    bulletRightImage.src = './res/bullet_right.png';
const bulletTopImage = new Image(128, 128);
    bulletTopImage.src = './res/bullet_top.png';
const bulletLeftImage = new Image(128, 128);
    bulletLeftImage.src = './res/bullet_left.png';
const bulletBotImage = new Image(128, 128);
    bulletBotImage.src = './res/bullet_bot.png';

const bulletImages = [bulletTopImage, bulletRightImage, bulletBotImage, bulletLeftImage];

const zombieRightImage1 = new Image(74, 74);
zombieRightImage1.src = './res/zombie_right_1.png';
const zombieRightImage2 = new Image(74, 74);
zombieRightImage2.src = './res/zombie_right_2.png';
const zombieRightImage3 = new Image(74, 74);
zombieRightImage3.src = './res/zombie_right_3.png';

const zombieRightImages = [zombieRightImage1, zombieRightImage2, zombieRightImage3];

const zombieLeftImage1 = new Image(74, 74);
zombieLeftImage1.src = './res/zombie_left_1.png';
const zombieLeftImage2 = new Image(74, 74);
zombieLeftImage2.src = './res/zombie_left_2.png';
const zombieLeftImage3 = new Image(74, 74);
zombieLeftImage3.src = './res/zombie_left_3.png';

const zombieLeftImages = [zombieLeftImage1, zombieLeftImage2, zombieLeftImage3];

const zombieTopImage1 = new Image(74, 74);
zombieTopImage1.src = './res/zombie_top_1.png';
const zombieTopImage2 = new Image(74, 74);
zombieTopImage2.src = './res/zombie_top_2.png';
const zombieTopImage3 = new Image(74, 74);
zombieTopImage3.src = './res/zombie_top_3.png';

const zombieTopImages = [zombieTopImage1, zombieTopImage2, zombieTopImage3];

const zombieBotImage1 = new Image(74, 74);
zombieBotImage1.src = './res/zombie_bot_1.png';
const zombieBotImage2 = new Image(74, 74);
zombieBotImage2.src = './res/zombie_bot_2.png';
const zombieBotImage3 = new Image(74, 74);
zombieBotImage3.src = './res/zombie_bot_3.png';

const zombieBotImages = [zombieBotImage1, zombieBotImage2, zombieBotImage3];

const zombieImages = [zombieTopImages, zombieRightImages, zombieBotImages, zombieLeftImages];

function Point(x, y){
    this.x = x;
    this.y = y;
}

function MyButton(x, y, numb){
    this.x = x;
    this.y = y;
    this.numb = numb;

    this.isInside = function(px, py){
        return this.x <= px && px <= this.x + butsize && this.y <= py && py <= this.y + butsize;
    }
    this.draw = function(){
        if(pressedKey[numb]){
            ctx.fillStyle = "#888888";
        }else{
            ctx.fillStyle = "#444444";
        }
        ctx.fillRect(x,y,butsize,butsize);
    }
}

function Map(w, h){
    this.tiles = [];
    this.width = w;
    this.height = h;

    //Feltöltés 0ákkal
    for (var i = 0; i < this.width; i++){
        this.tiles[i] = [];
        for (var j = 0; j < this.height; j++){
            this.tiles[i][j] = 0;
        }
    }

    //Random map:
    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            //Ha nincs a közelben fal
            if (Math.floor(Math.random()*100) < wall_rate && this.tiles[i][j] == 0 && i + 1 < this.width && this.tiles[i+1][j] == 0
                && i-1 >= 0 && this.tiles[i-1][j] == 0 && this.tiles[i][j] == 0
                && j + 1 < this.height && this.tiles[i][j+1] == 0 && j - 1 >= 0 && this.tiles[i][j-1] == 0
                && this.tiles[i+1][j+1] == 0 && this.tiles[i+1][j-1] == 0
                && this.tiles[i-1][j+1] == 0 && this.tiles[i-1][j-1] == 0)
            {
                var hossz = Math.floor(Math.random()*wall_max) + wall_min;

                //Vizszintes
                if (Math.floor(Math.random()*2) == 0)
                {
                    for (var k = 0; k < hossz && i + k + 1 < this.width && this.tiles[i+k+1][j] != 1
                    && this.tiles[i+k+1][j+1] != 1 && this.tiles[i+k+1][j-1] != 1; k++)
                    {
                        this.tiles[i+k][j] = 1;
                    }
                }
                //Függőleges
                else
                {
                    for (var k = 0; k < hossz && j + k + 1< this.height && this.tiles[i][j+k+1] != 1
                    && this.tiles[i+1][j+k+1] != 1 && this.tiles[i-1][j+k+1] != 1; k++)
                    {
                        this.tiles[i][j+k] = 1;
                    }
                }
            }
        }
    }

    /*this.get = function(i, j){
        return this.tiles[i][j];
    };*/
    this.set = function(i, j, z){
        this.tiles[i][j] = z;
    };
    this.empty = function(x, y){
        return x >= 0 && y >= 0 && x < this.width && y < this.height && this.tiles[x][y] == 0;
    };
    this.draw = function(x, y){
        ctx.fillStyle = "#42240c";
        ctx.fillRect(0, 0, view_width, view_height);

        for (var i = 0; i < this.width; i++){
            for (var j = 0; j < this.height; j++)
            {
                if(this.tiles[i][j] == 1){
                    ctx.drawImage(crateImage, tiles_pos_x[i] - x, tiles_pos_y[j] - y, tile_size, tile_size);
                    // ctx.fillStyle = "#FFFFFF";
                    // ctx.fillRect(tiles_pos_x[i] - x, tiles_pos_y[j] - y, tile_size, tile_size);
                } else {
                    ctx.drawImage(floorImage, tiles_pos_x[i] - x, tiles_pos_y[j] - y, tile_size, tile_size);
                }
            }
        }
    };
    this.getWidth = function(){
        return this.width;
    };
    this.getHeight = function(x, y){
        return this.height;
    };
}
function Player(kx, ky){
    this.kx = kx;
    this.ky = ky;
    this.x = kx * tile_size;
    this.y = ky * tile_size;
    this.x2 = this.x + tile_size;
    this.y2 = this.y + tile_size;
    this.ox = this.x + tile_size/2;
    this.oy = this.y + tile_size/2;
    this.fx = Math.floor((this.x + tile_size/2) / tile_size);
    this.fy = Math.floor((this.y + tile_size/2) / tile_size);

    this.direction = 0;

    this.resize = function(ujmeret){
        this.x = this.x / tile_size * ujmeret;
        this.y = this.y / tile_size * ujmeret;
        this.x2 = this.x + ujmeret;
        this.y2 = this.y + ujmeret;
    };

    this.move = function(vx, vy){
        this.walking = true;
        this.x = this.x + vx;
        this.y = this.y + vy;
        this.x2 = this.x + tile_size;
        this.y2 = this.y + tile_size;
        this.kx = Math.floor(this.x / tile_size);
        this.ky = Math.floor(this.y / tile_size);
        this.ox = this.x + tile_size/2;
        this.oy = this.y + tile_size/2;
        var tempx = Math.floor((this.x + tile_size/2) / tile_size);
        var tempy = Math.floor((this.y + tile_size/2) / tile_size);
        if(tempx != this.fx || tempy != this.fy){
            this.fx = tempx;
            this.fy = tempy;
            buzles(new Point(tempx, tempy));
            //setTimeout(function(){ buzles(new Point(tempx, tempy));}, 0);
        }
    };
    this.stop = function(){
        this.walking = false;
    };

    this.isInside = function(px, py){
        return this.x <= px && px <= this.x2 && this.y <= py && py <= this.y2;
    };
    this.getOx = function(){
        return this.ox;
    };
    this.getOy = function(){
        return this.oy;
    };
    this.getFx = function(){
        return this.fx;
    };
    this.getFy = function(){
        return this.fy;
    };
    this.getKx = function(){
        return this.kx;
    };
    this.getKy = function(){
        return this.ky;
    };
    this.getX = function(){
        return this.x;
    };
    this.getY = function(){
        return this.y;
    };
    this.getX2 = function(){
        return this.x2;
    };
    this.getY2 = function(){
        return this.y2;
    };
    this.getDirection = function(){
        return this.direction;
    };
    this.setDirection = function(ir){
        this.direction = ir;
    };

    this.draw = function(mx, my){
        // ctx.fillStyle = "#00FF00";
        // ctx.fillRect(this.x - mx, this.y - my, tile_size, tile_size);
        // ctx.fillStyle = "#00FFFF";
        // ctx.fillRect(tiles_pos_x[this.fx] - mx, tiles_pos_y[this.fy] - my, tile_size, tile_size);
        // ctx.drawImage(arrows[this.direction], this.x - mx, this.y - my, tile_size, tile_size);

        ctx.drawImage(zombieImages[this.direction][this.walking ? anim_index : 1], this.x - mx, this.y - my, tile_size, tile_size);
    };
}
function Mob(kx, ky, l){
    this.kx = kx;
    this.ky = ky;
    this.x = kx * tile_size;
    this.y = ky * tile_size;
    this.x2 = this.x + tile_size;
    this.y2 = this.y + tile_size;
    this.level = l;
    this.v = mob_velocity;
    this.direction = 0;

    this.resize = function(ujmeret){
        this.x = this.x / tile_size * ujmeret;
        this.y = this.y / tile_size * ujmeret;
        this.x2 = this.x + ujmeret;
        this.y2 = this.y + ujmeret;
    };

    this.move = function(vx, vy){
        this.walking = true;
        this.x = this.x + vx;
        this.y = this.y + vy;
        this.x2 = this.x + tile_size;
        this.y2 = this.y + tile_size;
        this.kx = Math.floor(this.x / tile_size);
        this.ky = Math.floor(this.y / tile_size);
    };
    this.stop = function(){
        this.walking = false;
    };

    this.isInside = function(px, py){
        return this.x <= px && px <= this.x2 && this.y <= py && py <= this.y2;
    };

    this.getKx = function(){
        return this.kx;
    };
    this.getKy = function(){
        return this.ky;
    };

    this.getX = function(){
        return this.x;
    };
    this.getY = function(){
        return this.y;
    };
    this.getX2 = function(){
        return this.x2;
    };
    this.getY2 = function(){
        return this.y2;
    };
    this.getDirection = function(){
        return this.direction;
    };
    this.setDirection = function(ir){
        this.direction = ir;
    };
    this.getLevel = function(){
        return this.level;
    };
    this.setLevel = function(l){
        this.level = l;
    };

    this.draw = function(mx, my){
        // ctx.fillStyle = "#FF0000";
        ctx.drawImage(zombieImages[this.direction][anim_index], this.x - mx, this.y - my, tile_size, tile_size);
        // ctx.fillRect(this.x - mx, this.y - my, tile_size, tile_size);
    };
}
function Bullet(x, y, kx, ky, direction){
    this.kx = kx;
    this.ky = ky;
    this.x = x + corigate_bullet;
    this.y = y + corigate_bullet;
    this.x2 = this.x + bullet_size;
    this.y2 = this.y + bullet_size;
    this.ox = this.x + tile_size/2;
    this.oy = this.y + tile_size/2;
    this.direction = direction;

    this.resize = function(ujmeret){
        this.x = this.x / tile_size * ujmeret;
        this.y = this.y / tile_size * ujmeret;
        this.x2 = this.x + ujmeret;
        this.y2 = this.y + ujmeret;
    };

    this.move = function(){
        this.x = this.x + directions[this.direction][0] * bullet_velocity;
        this.y = this.y + directions[this.direction][1] * bullet_velocity;
        this.x2 = this.x + bullet_size;
        this.y2 = this.y + bullet_size;
        this.ox = this.x + tile_size/2;
        this.oy = this.y + tile_size/2;
        this.kx = Math.floor(this.x / tile_size);
        this.ky = Math.floor(this.y / tile_size);
    };
    this.isInside = function(px, py){
        return this.x <= px && px <= this.x2 && this.y <= py && py <= this.y2;
    };

    this.getKx = function(){
        return this.kx;
    };
    this.getKy = function(){
        return this.ky;
    };
    this.getOx = function(){
        return this.ox;
    };
    this.getOy = function(){
        return this.oy;
    };
    this.getX = function(){
        return this.x;
    };
    this.getY = function(){
        return this.y;
    };
    this.getX2 = function(){
        return this.x2;
    };
    this.getY2 = function(){
        return this.y2;
    };
    this.getDirection = function(){
        return this.direction;
    };
    this.setDirection = function(ir){
        this.direction = ir;
    };

    this.draw = function(mx, my){
        ctx.drawImage(bulletImages[direction], this.x - mx, this.y - my, bullet_size, bullet_size);
    };
}
function Trouble(name, duration, use, unuse){
    this.name = name;
    this.duration = duration;
    this.use = use;
    this.unuse = unuse;
}
// function set_meret(meret){
//
//     tile_size = meret;
//     bullet_size = meret/4;
//     player_velocity = meret/4;
//     bullet_velocity = meret/2;
//     mob_velocity = meret/4;
//
//     corigate_x = view_width / 2 - tile_size/2;
//     corigate_y = view_height / 2 - tile_size/2;
//
//     tiles_pos_x = [];
//     for(var i=0; i < map_width; i++){
//         tiles_pos_x[i] = i * tile_size;
//     }
//
//     tiles_pos_y = [];
//     for(var j=0; j < map_height; j++){
//         tiles_pos_y[j] = j * tile_size;
//     }
//     corigate_bullet = tile_size/2 - bullet_size/2;
// }
// function corrigate(meret){
//     p_player.resize(meret);
//     for(var i=0; i < mobs.length; i++){
//         mobs[i].resize(meret);
//     }
//     for(var i=0; i < bullets.length; i++){
//         bullets[i].resize(meret);
//     }
// }

function newgame(){
    lose = false;

    mobs = [];
    bullets = [];
    current_trouble = -1;

    mobskill = 150;
    spawn_rate = base_spawnrate;
    stink_dist = base_stink_dist;

    score = 0;
    timer = 1;

    tile_size = base_size;
    bullet_size = base_size/4;
    player_velocity = base_size/4;
    bullet_velocity = base_size/2;
    mob_velocity = base_size/4;

    corigate_x = view_width / 2 - tile_size/2;
    corigate_y = view_height / 2 - tile_size/2;

    tiles_pos_x = [];
    for(var i=0; i < map_width; i++){
        tiles_pos_x[i] = i * tile_size;
    }

    tiles_pos_y = [];
    for(var j=0; j < map_height; j++){
        tiles_pos_y[j] = j * tile_size;
    }
    corigate_bullet = tile_size/2 - bullet_size/2;


    m = new Map(map_width, map_height);
    m.set(map_width/2,map_height/2,0);
    p_player = new Player(map_width/2, map_height/2);

    buzles(new Point(p_player.getFx(), p_player.getFy()));
    next_trouble = Math.floor(Math.random()*trouble_def.length);
}
function resetSzagok(){
    stinkd = [];
    for(var i=0; i < map_width; i++){
        stinkd[i] = [];
    }
}
function buzles(point){
    resetSzagok();

    var queue = [];
    stinkd[point.x][point.y] = 0;
    queue.push(point);
    while(queue.length != 0){
        var c_point = queue.shift();
        if(m.empty(c_point.x+1, c_point.y) && stinkd[c_point.x+1][c_point.y] == undefined){
            stinkd[c_point.x+1][c_point.y] = stinkd[c_point.x][c_point.y] + 1;
            if(stinkd[c_point.x+1][c_point.y] < stink_dist){
                queue.push(new Point(c_point.x+1, c_point.y));
            }
        }
        if(m.empty(c_point.x-1, c_point.y) && stinkd[c_point.x-1][c_point.y] == undefined){
            stinkd[c_point.x-1][c_point.y] = stinkd[c_point.x][c_point.y] + 1;
            if(stinkd[c_point.x-1][c_point.y] < stink_dist){
                queue.push(new Point(c_point.x-1, c_point.y));
            }
        }
        if(m.empty(c_point.x, c_point.y+1) && stinkd[c_point.x][c_point.y+1] == undefined){
            stinkd[c_point.x][c_point.y+1] = stinkd[c_point.x][c_point.y] + 1;
            if(stinkd[c_point.x][c_point.y+1] < stink_dist){
                queue.push(new Point(c_point.x, c_point.y+1));
            }
        }
        if(m.empty(c_point.x, c_point.y-1) && stinkd[c_point.x][c_point.y-1] == undefined){
            stinkd[c_point.x][c_point.y-1] = stinkd[c_point.x][c_point.y] + 1;
            if(stinkd[c_point.x][c_point.y-1] < stink_dist){
                queue.push(new Point(c_point.x, c_point.y-1));
            }
        }
    }
}

function utkozoMob(x, y){
    for (var i = 0; i < mobs.length; i++)
    {
        if (mobs[i].isInside(x, y)/* ||
	                    mobs[i].isInside(x2, y) ||
	                    mobs[i].isInside(x2, y2) ||
	                    mobs[i].isInside(x, y2)*/){
            return i;
        }
    }
    return -1;
}
function utkozoPlayer(m){
    /*var left_top = m.isInside(p_player.getX(), p_player.getY());
    var right_top = m.isInside(p_player.getX2(), p_player.getY());
    var right_bot = m.isInside(p_player.getX2(), p_player.getY2());
    var left_bot = m.isInside(p_player.getX(), p_player.getY2());

    if(p_player.getX() % tile_size == 0){

    }
    var left_right =

    return (left_top && right_top ||
            right_top && right_bot ||
            right_bot && left_bot ||
            left_bot && left_top);
            */
    return m.isInside(p_player.getOx(), p_player.getOy());
}

function right(direction){
    return (direction+1) % 4;
}
function left(direction){
    return (direction+3) % 4;
}
function turn(direction){
    return (direction+2) % 4;
}

function mob_level0(x, y){
    var ujx, ujy, opt = [];

    for(var i=0; i < 4; i++){
        ujx = x + directions[i][0];
        ujy = y + directions[i][1];
        if(m.empty(ujx, ujy)){
            opt.push(i);
        }
    }

    return opt[Math.floor(Math.random()*opt.length)];
}
function mob_level1(x, y, direction){

    var temp = Math.random();
    if(temp <= 0.75){
        var ujx = x + directions[direction][0];
        var ujy = y + directions[direction][1];
        if(m.empty(ujx, ujy)){
            return direction;
        }else{
            if(temp <= 0.3){
                return mob_level1(x, y, right(direction));
            }else
            if(temp <= 0.6){
                return mob_level1(x, y, left(direction));
            }else{
                return mob_level1(x, y, turn(direction));
            }
        }
    }else
    if(temp <= 0.85){
        direction = left(direction);
        var ujx = x + directions[direction][0];
        var ujy = y + directions[direction][1];
        if(m.empty(ujx, ujy)){
            return direction;
        }else{
            if(temp <= 0.8){
                return mob_level1(x, y, right(direction));
            }else{//if(temp <= 0.85){
                return mob_level1(x, y, left(direction));
            }
        }
    }else
    if(temp <= 0.95){
        direction = right(direction);
        var ujx = x + directions[direction][0];
        var ujy = y + directions[direction][1];
        if(m.empty(ujx, ujy)){
            return direction;
        }else{
            if(temp <= 0.9){
                return mob_level1(x, y, right(direction));
            }else{ //if(temp <= 0.95){
                return mob_level1(x, y, left(direction));
            }
        }
    }else{
        direction = turn(direction);
        var ujx = x + directions[direction][0];
        var ujy = y + directions[direction][1];
        if(m.empty(ujx, ujy)){
            return direction;
        }else{
            if(temp <= 0.975){
                return mob_level1(x, y, right(direction));
            }else{//if(temp <= 1.0){
                return mob_level1(x, y, left(direction));
            }
        }
    }
}
function mob_level2(x, y){
    var options = [];
    for(var i=0; i < 4; i++){
        var newx = x + directions[i][0];
        var newy = y + directions[i][1];
        if(m.empty(newx, newy) && stinkd[newx][newy] < stinkd[x][y]){
            options.push(i);
        }
    }

    return options[Math.floor(Math.random()*options.length)];
}

function tryToMobMove(mob){
    if(utkozoPlayer(mob)){
        lose = true;
        return false;
    }

    if(mob.getX() % tile_size == 0 && mob.getY() % tile_size == 0){
        //#FRENZY!!
        if(fast_active){
            mob.v = tile_size / fast_scale;
        } else {
            mob.v = mob_velocity;
        }


        if(mob.getLevel() == 0){
            mob.setDirection(mob_level0(mob.getKx(), mob.getKy()));
            mob.setLevel(1);
        }else
            //1. 75% straight 10 % left 10% right 5% turn
        if(mob.getLevel() == 1){
            mob.setDirection(mob_level1(mob.getKx(), mob.getKy(), mob.getDirection()));
            if(stinkd[mob.getKx()][mob.getKy()] != undefined){
                if(Math.random() <= 0.3){
                    mob.setDirection(mob_level2(mob.getKx(), mob.getKy()));
                    mob.setLevel(2);
                }
            }
        }else
            //2. Szaglás után megy 20%ban elveszti a szagot
        if(mob.getLevel() == 2){
            if(stinkd[mob.getKx()][mob.getKy()] != undefined){
                mob.setDirection(mob_level2(mob.getKx(), mob.getKy()));
                if(Math.random() <= 0.2){//#TODO TÁVOLSÁGARÁNYOSAN FELEJTSEN SZAGOT
                    mob.setDirection(mob_level1(mob.getKx(), mob.getKy(), mob.getDirection()));
                    mob.setLevel(1);
                }
            }else{
                mob.setLevel(0);
            }
        }
    }

    var vx = directions[mob.getDirection()][0];
    var vy = directions[mob.getDirection()][1];

    mob.move(vx * mob.v, vy * mob.v);
    return true;
}
function tryToBulletMove(b){
    var vx = directions[b.getDirection()][0];
    var vy = directions[b.getDirection()][1];

    var ujx;
    var ujy;
    if (vx < 0 || vy < 0)
    {
        ujx = b.getKx();
        ujy = b.getKy();
        if (b.getX() % tile_size == 0)
            ujx += vx;
        if (b.getY() % tile_size == 0)
            ujy += vy;
    } else {
        ujx = b.getKx() + vx;
        ujy = b.getKy() + vy;
    }
    var index;
    if ((index = utkozoMob(b.getOx(), b.getOy())) != -1){
        mobs_trash.push(index);
        score += 50;
        return false;
    }
    if (m.empty(ujx, ujy))
    {
        b.move();
        return true;
    }
    return false;
}

function tryToPlayerMove(p, direction){
    //Írány beállítása
    p.setDirection(direction);
    var vx = directions[direction][0];
    var vy = directions[direction][1];

    var ujx;
    var ujy;
    if (vx < 0 || vy < 0)
    {
        ujx = p.getKx();
        ujy = p.getKy();
        if (p.getX() % tile_size == 0)
            ujx += vx;
        if (p.getY() % tile_size == 0)
            ujy += vy;
    } else {
        ujx = p.getKx() + vx;
        ujy = p.getKy() + vy;
    }

    if(p.getX() % tile_size == 0){
        player_velocity_x = player_velocity;
    }
    if(p.getY() % tile_size == 0){
        player_velocity_y = player_velocity;
    }

    var index;

    if ((index = utkozoMob(p.getOx(), p.getOy())) != -1){
        lose = true;
        return false;
    }
    if (m.empty(ujx, ujy))
    {

        if (vy != 0)
        {
            if (p.getX() % tile_size == 0)
            {
                p.move(vx * player_velocity_x, vy * player_velocity_y);
                return true;
            }
            else
            if (m.empty(ujx + 1, ujy))
            {
                p.move(vx * player_velocity_x, vy * player_velocity_y);
                return true;
            }
        }
        else//if (vx != 0)
        {
            if (p.getY() % tile_size == 0)
            {
                p.move(vx * player_velocity_x, vy * player_velocity_y);
                return true;
            }
            else
            if (m.empty(ujx, ujy + 1))
            {
                p.move(vx * player_velocity_x, vy * player_velocity_y);
                return true;
            }
        }
    }
    return false;
}

function lo(p){
    if(!unarmed_active){
        bullets.push(new Bullet(p.getX(), p.getY(), p.getFx(), p.getFy(), p.getDirection()));
    }
}


function refresh(){
    c.width = c.width;
}

function init(){
    c = document.getElementById("surface");
    view_width = c.width = window.innerWidth - view_keret;
    view_height = c.height = window.innerHeight - view_keret;
    ctx = c.getContext("2d");
    ctx.font="30px Verdana";
    //c.addEventListener("mousedown", doMouseDown, false);
    //c.addEventListener("mouseup", doMouseUp, false);
    //c.addEventListener("touchstart", handleStart, false);
    //c.addEventListener("touchend", handleEnd, false);
    window.addEventListener("keydown", doKeyDown, false);
    window.addEventListener("keyup", doKeyUp, false);

    buttons[0] = new MyButton(100,360, 0);
    buttons[1] = new MyButton(150,400, 1);
    buttons[2] = new MyButton(100,440, 2);
    buttons[3] = new MyButton(50,400, 3);
    buttons[4] = new MyButton(550,400, 4);

    //TODO KÉPEK


    newgame();
}

function doMouseDown(event){
    //alert("x: "+event.pageX+" y:" + event.pageY);
    for(var i=0; i < 5; i++){
        if(buttons[i].isInside(event.pageX, event.pageY)){
            pressedKey[i] = true;
            if(i == 4){
                lo(p_player);
            }
        }
    }
}

function doMouseUp(event){
    for(var i=0; i < 5; i++){
        if(buttons[i].isInside(event.pageX, event.pageY)){
            pressedKey[i] = false;
        }
    }
}

function doKeyDown(event){
    switch (event.keyCode){
        case 87:
            pressedKey[0] = true;
            break;
        case 65:
            pressedKey[3] = true;
            break;
        case 83:
            pressedKey[2] = true;
            break;
        case 68:
            pressedKey[1] = true;
            break;
        case 32:
            pressedKey[4] = true;
            lo(p_player);
            break;
    }
}
function doKeyUp(event){
    switch (event.keyCode){
        case 87:
            pressedKey[0] = false;
            break;
        case 65:
            pressedKey[3] = false;
            break;
        case 83:
            pressedKey[2] = false;
            break;
        case 68:
            pressedKey[1] = false;
            break;
        case 32:
            pressedKey[4] = false;
            break;
    }
}

trouble_def = [];
trouble_def[0] = new Trouble("Explosion", -1, function(){
    var tolx = Math.max(p_player.getFx() - explosion_size, 0);
    var toly =  Math.max(p_player.getFy() - explosion_size, 0);

    var igx = Math.min(p_player.getFx() + explosion_size + 1, m.getWidth());
    var igy = Math.min(p_player.getFy() + explosion_size + 1, m.getHeight());

    for (var i = tolx; i < igx; i++){
        for (var j = toly; j < igy; j++){
            m.set(i, j, 0);
        }
    }

    buzles(new Point(p_player.getFx(), p_player.getFy()));
}, function(){
    //NO NEED
});
/**/
trouble_def[1] = new Trouble("Broken leg", slow_duration, function(){
    player_velocity = tile_size / slow_scale;
}, function(){
    player_velocity = tile_size / 4;
});
trouble_def[2] = new Trouble("Frenzy", fast_duration, function(){
    fast_active = true;
}, function(){
    fast_active = false;
});
trouble_def[3] = new Trouble("Unarmed", unarmed_duration, function(){
    unarmed_active = true;
}, function(){
    unarmed_active = false;
});
trouble_def[4] = new Trouble("Stinky", stinky_duration, function(){
    stink_dist = base_stink_dist * stinky_scale;
    buzles(new Point(p_player.getFx(), p_player.getFy()));
}, function(){
    stink_dist = base_stink_dist;
    buzles(new Point(p_player.getFx(), p_player.getFy()));
});
trouble_def[5] = new Trouble("Reverse control", reverse_duration, function(){
    reverse_active = true;
}, function(){
    reverse_active = false;
});
trouble_def[6] = new Trouble("Blackout", blackout_duration, function(){
    blackout_active = true;
}, function(){
    blackout_active = false;
});
// #TODO Not working as intended
// trouble_def[7] = new Trouble("Shortview", zoom_duration, function(){
//     var ujmeret = base_size * zoom_size;
//     corrigate(ujmeret);
//     set_meret(ujmeret);
// }, function(){
//     corrigate(base_size);
//     set_meret(base_size);
// });
function add_trouble(sz){
    //TODO KIIRJA HOGY MILYEN SZIVATAS
    sz.use();
    if(sz.duration > 0){
        current_trouble = sz;
    } else {
        current_trouble = -1;
    }
}

function runGame(){
    //átméretezés sztem gépen kívül sehol nem fogják játék közben
    if(view_width != window.innerWidth-view_keret || view_height != window.innerHeight-view_keret){
        view_width = c.width = window.innerWidth-20;
        view_height = c.height = window.innerHeight-20;
        corigate_x = view_width / 2 - tile_size/2;
        corigate_y = view_height / 2 - tile_size/2;
    }

    if (timer % tick == 0){
        score+=5;
        mobskill++;
        spawn_rate += 10;
        if(current_trouble != -1){
            if(current_trouble.duration > 0){
                current_trouble.duration--;
            } else { // if(current_trouble.duration == 0)
                current_trouble.unuse();
                current_trouble = -1;
            }
        }
    }
    //Szivatás
    if (timer % trouble_rate == 0){
        add_trouble(new Trouble(trouble_def[next_trouble].name,
            trouble_def[next_trouble].duration,
            trouble_def[next_trouble].use,
            trouble_def[next_trouble].unuse));

        next_trouble = Math.floor(Math.random()*trouble_def.length);
    }
    if (timer % animation_rate == 0) {
        anim_index = (anim_index + 1) % 3
    }

    var move = false;
    if(reverse_active){
        for(var i=0; i < 4; i++){
            if(pressedKey[i]){
                tryToPlayerMove(p_player, turn(i));
                move = true;
            }
        }
    } else {
        for(var i=0; i < 4; i++){
            if(pressedKey[i]){
                tryToPlayerMove(p_player, i);
                move = true;
            }
        }
    }
    if(!move){
        p_player.stop();
    }

    for(var i=0; i < bullets.length; i++){
        if (!tryToBulletMove(bullets[i])){
            bullets_trash.push(i);
        }
    }

    for(var i=0; i < mobs.length; i++){
        tryToMobMove(mobs[i]);
    }
    //TÖRLÉSEK
    while(bullets_trash.length){
        bullets.splice(bullets_trash.pop(), 1);
    }
    while(mobs_trash.length){
        mobs.splice(mobs_trash.pop(), 1);
    }

    if (Math.floor(Math.random()*10000) < spawn_rate)
    {
        switch(Math.floor(Math.random()*4))
        {
            case 0:
                mobs.push(new Mob(0, Math.floor(Math.random()*m.getHeight()), 0));
                break;
            case 1:
                mobs.push(new Mob(m.getWidth() - 1, Math.floor(Math.random()*m.getHeight()), 0));
                break;
            case 2:
                mobs.push(new Mob(Math.floor(Math.random()*m.getWidth()), 0, 0));
                break;
            case 3:
                mobs.push(new Mob(Math.floor(Math.random()*m.getWidth()), m.getHeight() - 1, 0));
                break;
        }
    }
    if (lose)
    {
        //#TODO LOSE
        if (score > highscore) {
            highscore = score;
        }

        if(current_trouble != -1){
            current_trouble.unuse();
        }

        newgame();
    }

    info3 = "Highscore: " + ((highscore === -1) ? "-" : highscore);
    var mennyi = (trouble_rate - timer % trouble_rate) / 10;
    info2 = trouble_def[next_trouble].name+": " + mennyi;
    info1 = "Score: " + score;
    timer++;
}
function drawMainGame(){
    var mx = p_player.getX() - corigate_x;
    var my = p_player.getY() - corigate_y;
    m.draw(mx, my, tile_size);
    p_player.draw(mx, my);


    for(var i=0; i < mobs.length; i++){
        mobs[i].draw(mx, my);
    }

    for(var i=0; i < bullets.length; i++){
        bullets[i].draw(mx, my);
    }
}

function drawGame(){
    refresh();

    if(blackout_active){
        if(blackout_is_dark){
            if(timer % blackout_night == 0){
                blackout_is_dark = !blackout_is_dark;
            }
            drawMainGame();
        } else {
            if(timer % blackout_night == 0){
                blackout_is_dark = !blackout_is_dark;
            }
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, view_width, view_height);
        }

    } else {
        drawMainGame();
    }

    ctx.fillStyle = "#f0ece3";
    ctx.font = "34px Georgia";
    ctx.fillText(info1, 50, 50);
    ctx.fillText(info2, 400, 50);
    ctx.fillText(info3, 800, 50);


    if(current_trouble.duration > 0) {
        ctx.font = "17px Georgia";
        ctx.fillText(current_trouble.name + ": "+ current_trouble.duration, view_width/2 - current_trouble.name.length * 5, view_height/2+base_size);
    }

}