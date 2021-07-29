let bullet_size;
let bullet_velocity;

function Bullet (x, y, kx, ky, direction) {
    GameObject.call (this, kx, ky, x + corrected_bullet, y + corrected_bullet);

    this.direction = direction;

    this.force_move = function () {
        this.x = this.x + DIRECTION_VALUES[this.direction][0] * bullet_velocity;
        this.y = this.y + DIRECTION_VALUES[this.direction][1] * bullet_velocity;
        this.x2 = this.x + bullet_size;
        this.y2 = this.y + bullet_size;
        this.ox = this.x + tile_size / 2;
        this.oy = this.y + tile_size / 2;
        this.kx = Math.floor (this.x / tile_size);
        this.ky = Math.floor (this.y / tile_size);
    };

    this.draw = function (mx, my) {
        ctx.drawImage (bulletImages[direction], this.x - mx, this.y - my, bullet_size, bullet_size);
    };
}

extend (Bullet, GameObject);