let c, ctx;

const view_frame = 10;
let view_width, view_height;

function initCanvas () {
    c = document.getElementById ("surface");
    view_width = c.width = window.innerWidth - view_frame;
    view_height = c.height = window.innerHeight - view_frame;

    ctx = c.getContext ("2d");
}