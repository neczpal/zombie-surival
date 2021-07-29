const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const DIRECTION_INDICES = [UP, RIGHT, DOWN, LEFT];
const DIRECTION_VALUES = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function getCoordsInDirection (kx, ky, x, y, direction) {
    let vx = DIRECTION_VALUES[direction][0];
    let vy = DIRECTION_VALUES[direction][1];

    let new_x;
    let new_y;
    if (vx < 0 || vy < 0) {
        new_x = kx;
        new_y = ky;
        if (x % tile_size === 0)
            new_x += vx;
        if (y % tile_size === 0)
            new_y += vy;
    } else {
        new_x = kx + vx;
        new_y = ky + vy;
    }

    return [new_x, new_y];
}