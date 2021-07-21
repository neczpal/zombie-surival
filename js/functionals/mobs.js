function right (direction) {
    return (direction + 1) % 4;
}

function left (direction) {
    return (direction + 3) % 4;
}

function turn (direction) {
    return (direction + 2) % 4;
}

function mob_level0 (x, y) {
    let new_x, new_y, opt = [];

    for (let i = 0; i < 4; i++) {
        new_x = x + directions[i][0];
        new_y = y + directions[i][1];
        if (map.empty (new_x, new_y)) {
            opt.push (i);
        }
    }

    return opt[Math.floor (Math.random () * opt.length)];
}

function mob_level1 (x, y, direction) {
    let temp = Math.random ();

    if (temp <= 0.75) {
        let new_x = x + directions[direction][0];
        let new_y = y + directions[direction][1];

        if (map.empty (new_x, new_y)) {
            return direction;
        } else {
            if (temp <= 0.3) {
                return mob_level1 (x, y, right (direction));
            } else if (temp <= 0.6) {
                return mob_level1 (x, y, left (direction));
            } else {
                return mob_level1 (x, y, turn (direction));
            }
        }
    } else if (temp <= 0.85) {
        direction = left (direction);
        let new_x = x + directions[direction][0];
        let new_y = y + directions[direction][1];

        if (map.empty (new_x, new_y)) {
            return direction;
        } else {
            if (temp <= 0.8) {
                return mob_level1 (x, y, right (direction));
            } else {//if(temp <= 0.85){
                return mob_level1 (x, y, left (direction));
            }
        }
    } else if (temp <= 0.95) {
        direction = right (direction);
        let new_x = x + directions[direction][0];
        let new_y = y + directions[direction][1];

        if (map.empty (new_x, new_y)) {
            return direction;
        } else {
            if (temp <= 0.9) {
                return mob_level1 (x, y, right (direction));
            } else { //if(temp <= 0.95){
                return mob_level1 (x, y, left (direction));
            }
        }
    } else {
        direction = turn (direction);
        let new_x = x + directions[direction][0];
        let new_y = y + directions[direction][1];

        if (map.empty (new_x, new_y)) {
            return direction;
        } else {
            if (temp <= 0.975) {
                return mob_level1 (x, y, right (direction));
            } else {//if(temp <= 1.0){
                return mob_level1 (x, y, left (direction));
            }
        }
    }
}

function mob_level2 (x, y) {
    let options = [];
    for (let i = 0; i < 4; i++) {
        let new_x = x + directions[i][0];
        let new_y = y + directions[i][1];
        if (map.empty (new_x, new_y) && stink_matrix[new_x][new_y] < stink_matrix[x][y]) {
            options.push (i);
        }
    }

    return options[Math.floor (Math.random () * options.length)];
}

function tryToMobMove (mob) {
    if (playerCollide (mob)) {
        lose = true;
        return false;
    }

    if (mob.getX () % tile_size === 0 && mob.getY () % tile_size === 0) {
        //#FRENZY!!
        if (fast_active) {
            mob.v = tile_size / fast_scale;
        } else {
            mob.v = mob_velocity;
        }


        if (mob.getLevel () === 0) {
            mob.setDirection (mob_level0 (mob.getKx (), mob.getKy ()));
            mob.setLevel (1);
        } else //1. 75% straight 10 % left 10% right 5% turn
        if (mob.getLevel () === 1) {
            mob.setDirection (mob_level1 (mob.getKx (), mob.getKy (), mob.getDirection ()));
            if (stink_matrix[mob.getKx ()][mob.getKy ()] !== undefined) {
                if (Math.random () <= 0.3) {
                    mob.setDirection (mob_level2 (mob.getKx (), mob.getKy ()));
                    mob.setLevel (2);
                }
            }
        } else //2. Goes after the smell 20% to lose track
        if (mob.getLevel () === 2) {
            if (stink_matrix[mob.getKx ()][mob.getKy ()] !== undefined) {
                mob.setDirection (mob_level2 (mob.getKx (), mob.getKy ()));
                if (Math.random () <= 0.2) {//#TODO Lose smell according to distance from player
                    mob.setDirection (mob_level1 (mob.getKx (), mob.getKy (), mob.getDirection ()));
                    mob.setLevel (1);
                }
            } else {
                mob.setLevel (0);
            }
        }
    }

    let vx = directions[mob.getDirection ()][0];
    let vy = directions[mob.getDirection ()][1];

    mob.move (vx * mob.v, vy * mob.v);
    return true;
}

function tickMobsMoving () {
    for (let i = 0; i < mobs.length; i++) {
        tryToMobMove (mobs[i]);
    }
}

function tickMobsSpawn () {
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
}