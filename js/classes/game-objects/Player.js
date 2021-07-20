function Player (kx, ky) {
    GameObject.call (this, kx, ky, kx * tile_size, ky * tile_size);

    this.fx = Math.floor ((this.x + tile_size / 2) / tile_size);
    this.fy = Math.floor ((this.y + tile_size / 2) / tile_size);

    this.move = function (vx, vy) {
        GameObject.prototype.move.call (this, vx, vy);

        let tmp_x = Math.floor ((this.x + tile_size / 2) / tile_size);
        let tmp_y = Math.floor ((this.y + tile_size / 2) / tile_size);

        if (tmp_x !== this.fx || tmp_y !== this.fy) {
            this.fx = tmp_x;
            this.fy = tmp_y;
            stinks (new Point (tmp_x, tmp_y));
        }
    };

    this.getFx = function () {
        return this.fx;
    };
    this.getFy = function () {
        return this.fy;
    };

    this.draw = function (mx, my) {
        ctx.drawImage (heroImages[this.walking ? anim_index : 1][this.direction], this.x - mx, this.y - my, tile_size, tile_size);

        if (pressedKey[4] && this.direction !== 0) {
            ctx.drawImage (weaponImage[this.direction], this.x - mx, this.y - my, tile_size, tile_size);
        }
    };
}

extend (Player, GameObject);