function GameObject (kx, ky, x, y) {
    this.kx = kx;
    this.ky = ky;
    this.x = x;//kx * tile_size;
    this.y = y;//ky * tile_size;
    this.x2 = this.x + tile_size;
    this.y2 = this.y + tile_size;
    this.ox = this.x + tile_size / 2;
    this.oy = this.y + tile_size / 2;

    this.direction = 0;

}

GameObject.prototype = {
    resize: function (new_size) {
        this.x = this.x / tile_size * new_size;
        this.y = this.y / tile_size * new_size;
        this.x2 = this.x + new_size;
        this.y2 = this.y + new_size;
    },

    stop: function () {
        this.walking = false;
    },

    isInside: function (px, py) {
        return this.x <= px && px <= this.x2 && this.y <= py && py <= this.y2;
    },

    getOx: function () {
        return this.ox;
    },
    getOy: function () {
        return this.oy;
    },
    getKx: function () {
        return this.kx;
    },
    getKy: function () {
        return this.ky;
    },
    getX: function () {
        return this.x;
    },
    getY: function () {
        return this.y;
    },
    getX2: function () {
        return this.x2;
    },
    getY2: function () {
        return this.y2;
    },
    getDirection: function () {
        return this.direction;
    },
    setDirection: function (dir) {
        this.direction = dir;
    },
    move: function (vx, vy) {
        this.walking = true;
        this.x = this.x + vx;
        this.y = this.y + vy;
        this.x2 = this.x + tile_size;
        this.y2 = this.y + tile_size;
        this.kx = Math.floor (this.x / tile_size);
        this.ky = Math.floor (this.y / tile_size);
        this.ox = this.x + tile_size / 2;
        this.oy = this.y + tile_size / 2;
    }
}