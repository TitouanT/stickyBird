const BIRD_SIZE = 3;
const LINES = 9;
const COLS = 10;
const ADD_OBSTACLE_THRESHOLD = 5;
const OBSTACLE = 1;
const EMPTY = 0;

let mat;
let bird;
function setup() {
	// createCanvas(200, 200);
	createCanvas(windowWidth, windowHeight);
	mat = [];
	bird = new Bird();
	for (let i = 0; i < LINES; i++) {
		mat[i] = [];
		for (let j = 0; j < COLS; j++) {
			mat[i][j] = EMPTY;
		}
	}
	addObstacle(mat, -1);
	frameRate(1);
}
function draw() {
	if (draw.gameOver === undefined) {
		draw.gameOver = false;
		draw.move = true;
		draw.i = 0;
	}
	if (!draw.gameOver && draw.move) {
		moveObstacles(mat);
		addObstacle(mat, ADD_OBSTACLE_THRESHOLD);
	}
	draw.gameOver = detectCollision(mat, bird);
	if (draw.gameOver) {
		let turn = 5;
		if (draw.i < turn) {
			if (draw.i%2) drawDead (dead_laughing_close);
			else drawDead(dead_laughing_open);
		}
		else if (draw.i < turn + 3) {
			if (draw.i == turn) drawDead (dead_full);
			else if (draw.i == turn + 1) drawDead (dead_blink);
			else drawDead (dead_full)
		}
		else {
			draw.i = -1;
			draw.gameOver = false;
		}
		draw.i++;
	}
	if (draw.i === 0){
		display(mat, bird);
		draw.gameOver = false;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked () {
	if (!draw.gameOver && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
		if (windowHeight < 500 && windowWidth < 500 && !fullscreen()) {
			fullscreen(true);
		}
		let keyCode_simulated;
		if (mouseX > width / 2) keyCode_simulated = RIGHT_ARROW;
		else keyCode_simulated = LEFT_ARROW;

		bird.move(keyCode_simulated);
		draw.move = false;
		redraw();
		draw.move = true;
	}
}

function keyPressed() {
	if (!draw.gameOver && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
		bird.move(keyCode);
		draw.move = false;
		redraw();
		draw.move = true;
	}
	return false;
}

function detectCollision (mat, bird) {
	for (let i = 0; i < bird.getSize(); i++)
		if (mat[bird.line][bird.cols[i]] == OBSTACLE) return true;

	return false;
}

function addObstacle (mat, threshold) {
	let obstacleOnThresholdLine;
	if (threshold > 0 && threshold < LINES) {
		obstacleOnThresholdLine = false;
		for (let i = 0; i < COLS && !obstacleOnThresholdLine; i++) {
			if (mat[threshold][i] == OBSTACLE) obstacleOnThresholdLine = true;
		}

	}
	else obstacleOnThresholdLine = true;

	if (obstacleOnThresholdLine) {
		let w = 3;
		let col = floor(random (COLS - w));
		for (let i = 0; i < COLS; i++) mat[LINES-1][i] = OBSTACLE;
		for (let i = col; i < w + col; i++) {
			mat[LINES - 1][i] = EMPTY;
		}
	}
}

function moveObstacles (mat) {
	// for (let i = 1; i < LINES; i++) {
	// 	for (let j = 0; j < COLS; j++) {
	// 		mat[i-1][j] = mat[i][j];
	// 	}
	// }
	// for (let i = 0; i < COLS; i++) mat[LINES - 1][i] = EMPTY;
	let out = mat[0];
	for (let i = 0; i < COLS; i++) mat[0][i] = EMPTY;
	for (let i = 1; i < LINES; i++) mat[i-1] = mat[i];
	mat[LINES-1] = out;
}

function display (mat, bird) {
	// stroke(0);
	noStroke();
	const c_height = floor(height / LINES);
	const c_width = floor(width / COLS);
	for (let i = 0; i < LINES; i++) {
		for (let j = 0; j < COLS; j++) {


			if (mat[i][j] == OBSTACLE) {
				fill(0,0,255);
			}
			else {
				fill(draw.gameOver ? 0 : 255);
			}
			rect(j * c_width, i * c_height, c_width, c_height);
		}
	}
	for (let i = 0; i < bird.getSize(); i++) {
		fill(255,0,0);
		rect(bird.cols[i] * c_width, 0, c_width, c_height);
	}
}

function drawDead (mat) {
	noStroke();
	const lines = mat.length;
	const cols = mat[0].length;
	const c_height = floor(height / lines);
	const c_width = floor(width / cols);
	for (let i = 0; i < lines; i++) {
		for (let j = 0; j < cols; j++) {

			switch (mat[i][j]) {
				case B: fill(255,255,255); break;
				case E: fill(255,0,0); break;
				case H: fill(0,0,0); break;
				case M: fill(51); break;
			}
			rect(j * c_width, i * c_height, c_width, c_height);
		}
	}
}

let Bird = function () {
	let size = 3;
	this.line = 0;
	this.cols = [0, 1, 2];

	this.move = function (key) {
		let move = 0;
		if (key === LEFT_ARROW && this.cols[0] > 0) {
			move--;
		}
		else if (key == RIGHT_ARROW && this.cols[size - 1] < COLS - 1) {
			move++;
		}


		if (move != 0) {
			for (let i = 0; i < size; i++) {
				this.cols[i] += move;
			}
		}
	}

	this.getSize = () => size;

}

let B=0, H=1, E=2, M=3;

let dead_full = [
	[H, H, H, H, H, H, H, H, H, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, E, E, B, B, E, E, B, H],
	[H, B, E, E, B, B, E, E, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, H, H, B, M, M, B, H, H, H],
	[B, B, H, B, B, B, B, H, B, B],
	[B, B, H, B, B, B, B, H, B, B],
	[B, B, H, H, H, H, H, H, B, B]
];

let dead_blink = [
	[H, H, H, H, H, H, H, H, H, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, E, E, B, B, B, B, B, H],
	[H, B, E, E, B, B, E, E, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, H, H, B, M, M, B, H, H, H],
	[B, B, H, B, B, B, B, H, B, B],
	[B, B, H, B, B, B, B, H, B, B],
	[B, B, H, H, H, H, H, H, B, B]
];

let dead_laughing_close = [
	[H, H, H, H, H, H, H, H, H, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, E, E, B, B, E, E, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, H, H, B, M, M, B, H, H, H],
	[B, B, H, B, B, B, B, H, B, B],
	[B, B, H, H, H, H, H, H, B, B],
	[B, B, B, B, B, B, B, B, B, B]
];

let dead_laughing_open = [
	[H, H, H, H, H, H, H, H, H, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, B, E, E, B, B, E, E, B, H],
	[H, B, B, B, B, B, B, B, B, H],
	[H, H, H, M, M, M, M, H, H, H],
	[B, B, H, M, B, B, M, H, B, B],
	[B, B, H, M, M, M, M, H, B, B],
	[B, B, H, H, H, H, H, H, B, B]
];