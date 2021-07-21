let c, ctx;

const view_frame = 10;
let view_width, view_height;

function initCanvas () {
    c = document.getElementById ("surface");
    view_width = c.width = window.innerWidth - view_frame;
    view_height = c.height = window.innerHeight - view_frame;

    ctx = c.getContext ("2d");
}

function refreshCanvasDimensions () {
    if (view_width !== (window.innerWidth - view_frame) || view_height !== (window.innerHeight - view_frame)) {
        view_width = c.width = window.innerWidth - view_frame;
        view_height = c.height = window.innerHeight - view_frame;
        corrected_x = view_width / 2 - tile_size / 2;
        corrected_y = view_height / 2 - tile_size / 2;
    }
}