let trouble_def = [];

let current_trouble;
let next_trouble;
//#TODO Create animation for troubles

trouble_def[0] = new Trouble ("Explosion", -1, function () {
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
trouble_def[1] = new Trouble ("Broken leg", slow_duration, function () {
    player_velocity = tile_size / slow_scale;
}, function () {
    player_velocity = tile_size / 4;
});
trouble_def[2] = new Trouble ("Frenzy", fast_duration, function () {
    fast_active = true;
}, function () {
    fast_active = false;
});
trouble_def[3] = new Trouble ("Unarmed", unarmed_duration, function () {
    unarmed_active = true;
}, function () {
    unarmed_active = false;
});
trouble_def[4] = new Trouble ("Stinky", stinky_duration, function () {
    stink_dist = base_stink_dist * stinky_scale;
    stinks (new Point (player.getFx (), player.getFy ()));
}, function () {
    stink_dist = base_stink_dist;
    stinks (new Point (player.getFx (), player.getFy ()));
});
trouble_def[5] = new Trouble ("Reverse control", reverse_duration, function () {
    reverse_active = true;
}, function () {
    reverse_active = false;
});
trouble_def[6] = new Trouble ("Blackout", blackout_duration, function () {
    blackout_active = true;
}, function () {
    blackout_active = false;
});

function add_trouble (trouble) {
    trouble.use ();
    if (trouble.duration > 0) {
        current_trouble = trouble;
    } else {
        current_trouble = -1;
    }
}