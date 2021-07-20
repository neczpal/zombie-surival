let pressedKey = []; //HashSet
//#TODO shooting feels bad
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
            pressedKey[0] = state;
            break;
        case 'a':
        case 'Left':
        case 'ArrowLeft':
        case  65:
        case  37:
            pressedKey[3] = state;
            break;
        case 's':
        case 'Down':
        case 'ArrowDown':
        case  83:
        case  40:
            pressedKey[2] = state;
            break;
        case 'd':
        case 'Right':
        case 'ArrowRight':
        case  68:
        case  39:
            pressedKey[1] = state;
            break;
        case ' ':
        case 'x':
        case  32:
        case  88:
            pressedKey[4] = state;
            if (state)
                shot (player);
            break;
    }
}

function doKeyDown (event) {
    doKeyEvent (event, true);
}

function doKeyUp (event) {
    doKeyEvent (event, false);
}