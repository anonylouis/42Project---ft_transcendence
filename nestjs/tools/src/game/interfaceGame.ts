export type intervalIDtype = ReturnType<typeof setInterval>

export interface Match {
	name : string,
	nb : string,
	button : string
}

export interface Bonus {
	x : number,
	y: number,
	type: number
}

export interface Game {
	mode: string,
	p1: number,
	p2: number,
	ballX: number,
	ballY: number,
	Vx: number,
	Vy: number,
	speed: number,
	ballRadius: number,
	playerWidth: number,
	p1Height: number,
	p2Height: number,
	score1: number,
	score2: number,
	big : boolean,
	fast : boolean,
	psy : boolean,
	evil : boolean,
	ballColor : string,
	p1Color : string,
	p2Color: string,
	bonus1 : Bonus | null,
	bonus2 : Bonus | null,
	bonusRadius : number,
}

export interface GameInfo {
	game : Game;
	nb : number;
	players: Array<string | null>;
	intervalID : intervalIDtype | null;
	options : Map<string, boolean> | null;
}

export interface EndScreenInfo {
	player1 : string,
	player2 : string,
	score1 : number,
	score2: number,
	mode : string
}

export interface Parameters {
	speed: number,
	ballRadius: number,
	bonusRadius: number,
	playerWidth: number,
	playerHeight: number,
	maxPoint: number,
	ballColor: string,
	playerColor: string
}

export interface userRoom {
	userId : string,
	roomName : string
}

export interface userPos {
	userId : string,
	pos : number
}

export interface InitData {
	userId : string,
	mode : string,
	optionsJSON : string
}

export interface joinData {
	userId: string,
	toJoinId: string,
}