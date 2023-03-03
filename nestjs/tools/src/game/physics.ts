import { Game, Parameters } from "./interfaceGame";

export const defaultParameters : Parameters = {
	speed: 1,
	ballRadius: 0.015,
	bonusRadius: 0.025,
	playerWidth: 0.015,
	playerHeight: 0.25,
	maxPoint: 5,
	ballColor: "white",
	playerColor : "white"
}

export const fastBallspeed : number = 2;

function collision(game : Game, player_x : number, player_y : number, player_height : number) : boolean {

	const player_top = player_y - player_height / 2;
	const player_bottom = player_y + player_height / 2;
	const player_left = player_x;
	const player_right = player_x + game.playerWidth;

	const ball_top = game.ballY - game.ballRadius;
	const ball_bottom = game.ballY + game.ballRadius;
	const ball_left = game.ballX - game.ballRadius;
	const ball_right = game.ballX + game.ballRadius;

	return (ball_right > player_left
		&& ball_top < player_bottom
		&& ball_left < player_right
		&& ball_bottom > player_top);
}

function collisionBonus(game : Game, bonus_x : number, bonus_y : number) : boolean {

	const bonus_top = bonus_y - game.bonusRadius;
	const bonus_bottom = bonus_y + game.bonusRadius;
	const bonus_left = bonus_x - game.bonusRadius;
	const bonus_right = bonus_x + game.bonusRadius;

	const ball_top = game.ballY - game.ballRadius;
	const ball_bottom = game.ballY + game.ballRadius;
	const ball_left = game.ballX - game.ballRadius;
	const ball_right = game.ballX + game.ballRadius;

	return (ball_right > bonus_left
		&& ball_top < bonus_bottom
		&& ball_left < bonus_right
		&& ball_bottom > bonus_top);
}

export function resetBall(game : Game) {

	let angleRad = Math.PI / 2 * (Math.random() - 0.5); // start random
	let direction = (Math.random() < 0.5) ? 1 : -1;     // start random
	let speed = defaultParameters.speed;
	if (game.fast)
		speed = fastBallspeed;

	game.ballX = 0.5;
	game.ballY = 0.5;
	game.Vx = direction * speed * Math.cos(angleRad) * 0.01;
	game.Vy = speed * Math.sin(angleRad) * 0.01;
	game.speed = speed;

	if (game.psy)
	{
		game.ballColor ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
		game.p1Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
		game.p2Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
	}
	else
	{
		game.ballColor = defaultParameters.ballColor;
		game.p1Color = defaultParameters.playerColor;
		game.p2Color = defaultParameters.playerColor;
	}

	if (game.mode == "magic")
	{
		game.bonus1 = {
			x: (Math.random() * 0.3) + 0.1,
			y: (Math.random() * 0.8) + 0.1,
			type : Math.floor((Math.random() * 4))
		}
		game.bonus2 = {
			x: (Math.random() * 0.3) + 0.6,
			y: (Math.random() * 0.8) + 0.1,
			type : Math.floor((Math.random() * 4))
		}
	}

}

function applyBonus(game : Game, type : number) {
	if (type == 0) { // green
		if (game.ballX < 0.5) {
			if (game.p1Height < 0.8)
				game.p1Height += 0.1;
		}
		else {
			if (game.p2Height < 0.8)
				game.p2Height += 0.1;
		}
	}
	else if (type == 1) { // red
		if (game.ballX < 0.5) {
			if (game.p1Height > 0.2)
				game.p1Height -= 0.1;
		}
		else {
			if (game.p2Height > 0.2)
				game.p2Height -= 0.1;
		}
	}
	else if (type == 2) { // yellow
		game.Vx*=1.3
		game.Vy*=1.3
		game.speed*=1.3
	}
	else {
		game.Vx*=0.7
		game.Vy*=0.7
		game.speed*=0.7
	}
}

// return true if the game is finished !
export function updateGame(game : Game) : boolean {
	game.ballX += game.Vx;
	game.ballY += game.Vy;

	if (game.ballY + game.ballRadius > 1 || game.ballY - game.ballRadius < 0) {
		if (game.psy)
		{
			game.ballColor ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			game.p1Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			game.p2Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
		}
		game.Vy = -game.Vy;
		if (game.evil && Math.random() < 0.5)
			game.Vx = -game.Vx;
	}

	let player_x : number = 0;
	let player_y : number = game.p1;
	let player_height : number = game.p1Height;
	
	if (game.ballX > 0.5) {
		player_x = 1 - game.playerWidth;
		player_y = game.p2;
		player_height = game.p2Height;
	}

	if (collision(game, player_x, player_y, player_height)) {
		let angleRad : number = (-1) * Math.PI / 4  * (player_y - game.ballY) / (player_height / 2);
		let direction : number = (game.ballX < 0.5) ? 1 : -1;
		game.Vx = direction * game.speed * Math.cos(angleRad) * 0.01;
		game.Vy = game.speed * Math.sin(angleRad) * 0.01;

		game.speed += 0.1;
		if (game.psy)
		{
			game.ballColor ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			game.p1Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			game.p2Color ='#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
		}
	}

	if (game.bonus1 && collisionBonus(game, game.bonus1.x, game.bonus1.y)) {
		applyBonus(game, game.bonus1.type);
		game.bonus1 = null;
	}
	if (game.bonus2 && collisionBonus(game, game.bonus2.x, game.bonus2.y)) {
		applyBonus(game, game.bonus2.type);
		game.bonus2 = null;
	}

	if (game.ballX >= 1) {
		game.score1++;
		if (game.score1 >= defaultParameters.maxPoint)
			return (true)
		resetBall(game);
	} else if (game.ballX <= 0) {
		game.score2++;
		if (game.score2 >= defaultParameters.maxPoint)
			return (true)
		resetBall(game);
	}
	return (false)
}