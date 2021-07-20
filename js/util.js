function extend (child, parent) {
    child.prototype = parent.prototype;
    child.prototype = new parent ();
    child.prototype.constructor = child;
}