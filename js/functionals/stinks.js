let stink_matrix;
let stink_dist;

function resetStinkMatrix () {
    stink_matrix = [];
    for (let i = 0; i < map_width; i++) {
        stink_matrix[i] = [];
    }
}

function stinks (point) {
    resetStinkMatrix ();

    let queue = [];
    stink_matrix[point.x][point.y] = 0;
    queue.push (point);
    while (queue.length !== 0) {
        let c_point = queue.shift ();
        if (map.empty (c_point.x + 1, c_point.y) && stink_matrix[c_point.x + 1][c_point.y] === undefined) {
            stink_matrix[c_point.x + 1][c_point.y] = stink_matrix[c_point.x][c_point.y] + 1;
            if (stink_matrix[c_point.x + 1][c_point.y] < stink_dist) {
                queue.push (new Point (c_point.x + 1, c_point.y));
            }
        }
        if (map.empty (c_point.x - 1, c_point.y) && stink_matrix[c_point.x - 1][c_point.y] === undefined) {
            stink_matrix[c_point.x - 1][c_point.y] = stink_matrix[c_point.x][c_point.y] + 1;
            if (stink_matrix[c_point.x - 1][c_point.y] < stink_dist) {
                queue.push (new Point (c_point.x - 1, c_point.y));
            }
        }
        if (map.empty (c_point.x, c_point.y + 1) && stink_matrix[c_point.x][c_point.y + 1] === undefined) {
            stink_matrix[c_point.x][c_point.y + 1] = stink_matrix[c_point.x][c_point.y] + 1;
            if (stink_matrix[c_point.x][c_point.y + 1] < stink_dist) {
                queue.push (new Point (c_point.x, c_point.y + 1));
            }
        }
        if (map.empty (c_point.x, c_point.y - 1) && stink_matrix[c_point.x][c_point.y - 1] === undefined) {
            stink_matrix[c_point.x][c_point.y - 1] = stink_matrix[c_point.x][c_point.y] + 1;
            if (stink_matrix[c_point.x][c_point.y - 1] < stink_dist) {
                queue.push (new Point (c_point.x, c_point.y - 1));
            }
        }
    }
}