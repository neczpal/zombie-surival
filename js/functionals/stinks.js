let stink_matrix;
let stink_dist;


function stinks (point) {
    //Resetting the matrix
    stink_matrix = createArray (map_width, map_height);
    //BFS
    let queue = [];
    stink_matrix[point.x][point.y] = 0;
    queue.push (point);
    while (queue.length !== 0) {
        let currentPoint = queue.shift ();
        //Check every direction
        for (const direction of DIRECTION_VALUES) {
            //If empty and not yet defined
            if (map.empty (currentPoint.x + direction[0], currentPoint.y + direction[1])
                && stink_matrix[currentPoint.x + direction[0]][currentPoint.y + direction[1]] === undefined) {
                //Increase stink number by 1
                stink_matrix[currentPoint.x + direction[0]][currentPoint.y + direction[1]]
                    = stink_matrix[currentPoint.x][currentPoint.y] + 1;
                //If its in the radius stink_dist we push it to the queue
                if (stink_matrix[currentPoint.x + direction[0]][currentPoint.y + direction[1]] < stink_dist) {
                    queue.push (new Point (currentPoint.x + direction[0],
                        currentPoint.y + direction[1]));
                }
            }
        }
    }
}