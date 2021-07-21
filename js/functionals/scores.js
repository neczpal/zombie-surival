let info_score;
let info_trouble;
let info_high_score;

let score;
let high_score = 0;

//#TODO highscore to be more working

function updateScoreboard () {
    info_high_score = "High score: " + ((high_score === -1) ? "-" : high_score);
    if (troubles_enabled) {
        let left_time = (trouble_rate - timer % trouble_rate) / 10;
        info_trouble = troubleDefs[nextTroubleIndex].name + ": " + left_time;
    } else {
        info_trouble = ''
    }
    info_score = "Score: " + score;
}