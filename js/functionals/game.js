let timer;

let anim_index = 0;

let lose = false;

let spawn_rate;
let mob_skill;//#TODO Make mobs level up faster as time goes on?

let map;//GameMap
let player;//Player p;
let mobs; //List
let bullets; //List

let bullets_trash = [];
let mobs_trash = [];

let fast_active = false;
let unarmed_active = false;
let reverse_active = false;
let blackout_active = false;
let blackout_is_light = false;

let corrected_bullet;// tile_size/2 - bullet_size/2
let corrected_x, corrected_y;

function newGame () {
    lose = false;

    mobs = [];
    bullets = [];
    activeTroubles = [];

    mob_skill = 150;
    spawn_rate = base_spawn_rate;
    stink_dist = base_stink_dist;

    score = 0;
    timer = 1;

    bullet_size = base_size / 4;
    player_velocity = base_size / 4;
    bullet_velocity = base_size / 2;
    mob_velocity = base_size / 4;

    corrected_x = view_width / 2 - tile_size / 2;
    corrected_y = view_height / 2 - tile_size / 2;

    tiles_pos_x = [];
    for (let i = 0; i < map_width; i++) {
        tiles_pos_x[i] = i * tile_size;
    }

    tiles_pos_y = [];
    for (let j = 0; j < map_height; j++) {
        tiles_pos_y[j] = j * tile_size;
    }
    corrected_bullet = tile_size / 2 - bullet_size / 2;

    if (troubles_enabled) {
        enableTroubles ();
    }

    map = new GameMap (map_width, map_height);
    map.set (map_width / 2, map_height / 2, 0);
    player = new Player (map_width / 2, map_height / 2);

    stinks (new Point (player.getFx (), player.getFy ()));
    nextTroubleIndex = Math.floor (Math.random () * troubleDefs.length);
}

function runGame () {
    // Tick update
    if (timer % tick === 0) {
        score += 5;
        mob_skill++;
        spawn_rate += 10;

        troubleTick ();
    }
    // Troubles
    if (troubles_enabled && timer % trouble_rate === 0) {
        activateNextTrouble ();
    }

    if (timer % animation_rate === 0) {
        anim_index = (anim_index + 1) % 3
    }

    // Player Moving
    tickPlayerMoving ();

    //Shooting
    tickPlayerShooting ();

    //Bullet moving
    tickBulletsMoving ();

    //Mob moving
    tickMobsMoving ();

    //Deletes
    deleteDeadGameObjects ();

    //Spawning
    tickMobsSpawn ();

    //Losing
    if (lose) {
        //#TODO LOSE screen
        if (score > high_score) {
            high_score = score;
        }

        if (activeTroubles.length) {
            for (let i = 0; i < activeTroubles.length; i++) {
                activeTroubles[i].undo_use ();
            }
        }

        newGame ();
    }

    //Scoreboard
    updateScoreboard ();

    timer++;
}


function deleteDeadGameObjects () {
    while (bullets_trash.length) {
        bullets.splice (bullets_trash.pop (), 1);
    }
    while (mobs_trash.length) {
        mobs.splice (mobs_trash.pop (), 1);
    }
}