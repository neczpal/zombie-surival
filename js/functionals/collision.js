function mobCollide (x, y) {
    for (let i = 0; i < mobs.length; i++) {
        if (mobs[i].isInside (x, y)) {
            return i;
        }
    }
    return -1;
}

function playerCollide (m) {
    return m.isInside (player.getOx (), player.getOy ());
}

