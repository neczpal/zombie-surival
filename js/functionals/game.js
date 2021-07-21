let timer;

let anim_index = 0;

let lose = false;

let spawn_rate;
let mob_skill;//#TODO Make mobs level up faster as time goes on?

let map;//Map
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
    currentTroubleDef = {};
    troubleLeftDuration = -1;

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

    map = new Map (map_width, map_height);
    map.set (map_width / 2, map_height / 2, 0);
    player = new Player (map_width / 2, map_height / 2);

    stinks (new Point (player.getFx (), player.getFy ()));
    nextTroubleIndex = Math.floor (Math.random () * troubleDefs.length);
}

//#Untangle runGame function
function runGame () {
    // Resize only used on desktop probably
    if (view_width !== window.innerWidth - view_frame || view_height !== window.innerHeight - view_frame) {
        view_width = c.width = window.innerWidth - view_frame;
        view_height = c.height = window.innerHeight - view_frame;
        corrected_x = view_width / 2 - tile_size / 2;
        corrected_y = view_height / 2 - tile_size / 2;
    }

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
    let move = false;
    if (reverse_active) {
        for (let i = 0; i < 4; i++) {
            if (pressedKey[i]) {
                tryToMovePlayer (player, turn (i));
                move = true;
            }
        }
    } else {
        for (let i = 0; i < 4; i++) {
            if (pressedKey[i]) {
                tryToMovePlayer (player, i);
                move = true;
            }
        }
    }
    if (!move) {
        player.stop ();
    }

    //Shooting
    //#TODO Shooting speed and/or mb more weapons
    if (pressedKey[KEY_SHOOT]) {
        shot (player);
    }

    //Bullet moving
    for (let i = 0; i < bullets.length; i++) {
        if (!tryToMoveBullet (bullets[i])) {
            bullets_trash.push (i);
        }
    }

    //Mob moving
    for (let i = 0; i < mobs.length; i++) {
        tryToMobMove (mobs[i]);
    }

    //Deletes
    while (bullets_trash.length) {
        bullets.splice (bullets_trash.pop (), 1);
    }
    while (mobs_trash.length) {
        mobs.splice (mobs_trash.pop (), 1);
    }

    //Spawning
    if (Math.floor (Math.random () * 10000) < spawn_rate) {
        switch (Math.floor (Math.random () * 4)) {
            case 0:
                mobs.push (new Mob (0, Math.floor (Math.random () * map.getHeight ()), 0));
                break;
            case 1:
                mobs.push (new Mob (map.getWidth () - 1, Math.floor (Math.random () * map.getHeight ()), 0));
                break;
            case 2:
                mobs.push (new Mob (Math.floor (Math.random () * map.getWidth ()), 0, 0));
                break;
            case 3:
                mobs.push (new Mob (Math.floor (Math.random () * map.getWidth ()), map.getHeight () - 1, 0));
                break;
        }
    }

    //Losing
    if (lose) {
        //#TODO LOSE screen
        if (score > high_score) {
            high_score = score;
        }

        if (currentTroubleDef !== -1) {
            currentTroubleDef.undo_use ();
        }

        newGame ();
    }

    //Scoreboard
    info_high_score = "High score: " + ((high_score === -1) ? "-" : high_score);
    if (troubles_enabled) {
        let left_time = (trouble_rate - timer % trouble_rate) / 10;
        info_trouble = troubleDefs[nextTroubleIndex].name + ": " + left_time;
    } else {
        info_trouble = ''
    }
    info_score = "Score: " + score;
    timer++;
}