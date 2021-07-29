let pressedKey = []; //HashSet

const KEY_UP = UP;
const KEY_RIGHT = RIGHT;
const KEY_DOWN = DOWN;
const KEY_LEFT = LEFT;

const MOVEMENT_KEYS = [KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT];

const KEY_SHOOT = 4;

function registerEventListeners () {
    window.addEventListener ("keydown", doKeyDown, false);
    window.addEventListener ("keyup", doKeyUp, false);
}

function doKeyEvent (event, state) {
    let code;
    //Keycode deprecated
    if (event.key !== undefined) {
        code = event.key;
    } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
        code = event.keyCode;
    }

    switch (code) {
        case 'w':
        case 'Up':
        case 'ArrowUp':
        case  87:
        case  38:
            pressedKey[KEY_UP] = state;
            break;
        case 'd':
        case 'Right':
        case 'ArrowRight':
        case  68:
        case  39:
            pressedKey[KEY_RIGHT] = state;
            break;
        case 's':
        case 'Down':
        case 'ArrowDown':
        case  83:
        case  40:
            pressedKey[KEY_DOWN] = state;
            break;
        case 'a':
        case 'Left':
        case 'ArrowLeft':
        case  65:
        case  37:
            pressedKey[KEY_LEFT] = state;
            break;
        case ' ':
        case 'x':
        case  32:
        case  88:
            pressedKey[KEY_SHOOT] = state;
            break;
    }
}

function doKeyDown (event) {
    doKeyEvent (event, true);
}

function doKeyUp (event) {
    doKeyEvent (event, false);
}