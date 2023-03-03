import { Socket } from "socket.io-client"

export interface Bonus {
	x : number,
	y: number,
	type: number
}

export interface Game {
	mode: string
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
	ballColor : string
	p1Color : string,
	p2Color: string,
	bonus1 : Bonus | null,
	bonus2 : Bonus | null,
	bonusRadius : number,
}

export interface EndScreenInfoFront {
	player1 : string,
	player2 : string,
	score1 : number,
	score2: number,
	socket: Socket
}

export interface EndScreenInfoBack {
	player1 : string,
	player2 : string,
	score1 : number,
	score2: number,
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