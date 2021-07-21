let trouble_def = [];

let current_trouble;
let next_trouble;
//#TODO Create animation for troubles

const explosion_trouble = new Trouble ("Explosion", -1, function () {
    let from_x = Math.max (player.getFx () - explosion_size, 0);
    let from_y = Math.max (player.getFy () - explosion_size, 0);

    let to_x = Math.min (player.getFx () + explosion_size + 1, map.getWidth ());
    let to_y = Math.min (player.getFy () + explosion_size + 1, map.getHeight ());

    for (let i = from_x; i < to_x; i++) {
        for (let j = from_y; j < to_y; j++) {
            map.set (i, j, 0);
        }
    }

    stinks (new Point (player.getFx (), player.getFy ()));
}, function () {
    //NO NEED
});

const broken_leg_trouble = new Trouble ("Broken leg", slow_duration, function () {
    player_velocity = tile_size / slow_scale;
}, function () {
    player_velocity = tile_size / 4;
});

const frenzy_trouble = new Trouble ("Frenzy", fast_duration, function () {
    fast_active = true;
}, function () {
    fast_active = false;
});

const unarmed_trouble = new Trouble ("Unarmed", unarmed_duration, function () {
    unarmed_active = true;
}, function () {
    unarmed_active = false;
});

const stinky_trouble = new Trouble ("Stinky", stinky_duration, function () {
    stink_dist = base_stink_dist * stinky_scale;
    stinks (new Point (player.getFx (), player.getFy ()));
}, function () {
    stink_dist = base_stink_dist;
    stinks (new Point (player.getFx (), player.getFy ()));
});

const reverse_control_trouble = new Trouble ("Reverse control", reverse_duration, function () {
    reverse_active = true;
}, function () {
    reverse_active = false;
});

const blackout_trouble = new Trouble ("Blackout", blackout_duration, function () {
    blackout_active = true;
}, function () {
    blackout_active = false;
});

function enableTroubles () {
    if (explosion_enabled) {
        trouble_def.push (explosion_trouble);
    }
    if (broken_leg_enabled) {
        trouble_def.push (broken_leg_trouble);
    }
    if (frenzy_enabled) {
        trouble_def.push (frenzy_trouble);
    }
    if (unarmed_enabled) {
        trouble_def.push (unarmed_trouble);
    }
    if (stinky_enabled) {
        trouble_def.push (stinky_trouble);
    }
    if (reverse_control_enabled) {
        trouble_def.push (reverse_control_trouble);
    }
    if (blackout_enabled) {
        trouble_def.push (blackout_trouble);
    }
}

function add_trouble (trouble) {
    trouble.use ();
    if (trouble.duration > 0) {
        current_trouble = trouble;
    } else {
        current_trouble = -1;
    }
}