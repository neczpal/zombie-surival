function loadImage (resourceName, width, height) {
    let img = new Image (width, height);
    img.src = './res/' + resourceName + '.png';

    return img;
}

function load4DirectionalImage (resourceName, width, height, index = -1) {
    let imgs = [];

    imgs.push (loadImage (resourceName + "_top" + (index === -1 ? "" : "_" + index), width, height));
    imgs.push (loadImage (resourceName + "_right" + (index === -1 ? "" : "_" + index), width, height));
    imgs.push (loadImage (resourceName + "_bot" + (index === -1 ? "" : "_" + index), width, height));
    imgs.push (loadImage (resourceName + "_left" + (index === -1 ? "" : "_" + index), width, height));

    return imgs;
}

function loadCharacterImages (resourceName, frames, width, height) {
    let imgs = [];

    for (let i = 0; i < frames; i++) {
        imgs.push (load4DirectionalImage (resourceName, width, height, (i + 1)));
    }

    return imgs;
}

const crateImage = loadImage ("crate", 256, 256);
const floorImage = loadImage ("floor", 345, 345);
const bulletImages = load4DirectionalImage ("bullet", 128, 128);
const weaponImage = load4DirectionalImage ("weapon", 74, 74);
const zombieImages = loadCharacterImages ("zombie", 3, 74, 74);
const heroImages = loadCharacterImages ("hero", 3, 74, 74);