let tiles_pos_x; // i*tile_size
let tiles_pos_y; // j*tile_size

function drawMainGame () {
    let mx = player.getX () - corrected_x;
    let my = player.getY () - corrected_y;
    map.draw (mx, my, tile_size);


    for (let i = 0; i < mobs.length; i++) {
        mobs[i].draw (mx, my);
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw (mx, my);
    }
    player.draw (mx, my);
}

function drawGame () {
    // Resize only used on desktop probably
    refreshCanvasDimensions ();

    if (blackout_active) {
        if (timer % blackout_night === 0) {
            blackout_is_light = !blackout_is_light;
        }
        if (blackout_is_light) {
            drawMainGame ();
        } else {
            drawMainGame ();

            let maskCanvas = document.createElement ('canvas');
            maskCanvas.width = c.width;
            maskCanvas.height = c.height;
            let maskCtx = maskCanvas.getContext ('2d');

            maskCtx.fillStyle = "black";
            maskCtx.fillRect (0, 0, maskCanvas.width, maskCanvas.height);
            maskCtx.globalCompositeOperation = 'xor';
            maskCtx.arc (view_width / 2, view_height / 2, base_size, 0, 2 * Math.PI);
            maskCtx.fill ();

            ctx.drawImage (maskCanvas, 0, 0);
        }

    } else {
        drawMainGame ();
    }

    ctx.fillStyle = "#f0ece3";
    ctx.font = "34px Georgia";
    ctx.fillText (info_score, 50, 50);
    ctx.fillText (info_trouble, 400, 50);
    ctx.fillText (info_high_score, 800, 50);


    if (troubleLeftDuration > 0) {
        ctx.font = "17px Georgia";
        ctx.fillText (currentTroubleDef.name + ": " + troubleLeftDuration, view_width / 2 - currentTroubleDef.name.length * 5, view_height / 2 + base_size);
    }

}