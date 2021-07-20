function Mob (kx, ky, lev) {
    GameObject.call (this, kx, ky, kx * tile_size, ky * tile_size);

    this.level = lev;

    this.getLevel = function () {
        return this.level;
    };
    this.setLevel = function (l) {
        this.level = l;
    };

    this.draw = function (mx, my) {
        ctx.drawImage (zombieImages[anim_index][this.direction], this.x - mx, this.y - my, tile_size, tile_size);
    };
}

extend (Mob, GameObject);