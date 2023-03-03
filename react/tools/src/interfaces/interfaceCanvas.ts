import { Socket } from "socket.io-client";

export interface canvas_props {
	className : string,
	width : number,
	height : number,
	socket : Socket,
	userId : string
}

export interface Net {
	x : number,
	width : number,
	height : number,
	color : string
}

export const normalNet : Net = {
	x : 0.5,
	width: 2,
	height: 10,
	color: "WHITE",
}

export interface Player {
	y : number,
	width : number,
	height : number,
	color : string,
	score : number
}

export const user  : Player= {
	y: 0.5, //ok
	width: 0.015, //ok
	height: 0.25,
	color: "WHITE",
	score: 0
}

export const com : Player= {
	y: 0.5, //ok
	width: 0.015, //ok
	height: 0.25, //ok
	color: "WHITE",
	score: 0
}

interface PLayer_params {
	width : number,
	height : number,
	color : string
}

export const normalPlayer : PLayer_params = {
	width : 0.015,
	height : 0.25,
	color : "WHITE"
}

export interface Ball {
	x : number,
	y : number,
	radius : number,
	speed: number,
	Vx : number,
	Vy : number,
	color : string
}

interface Ball_params {
	radius : number,
	color : string
}

export const normalBall : Ball_params = {
	radius : 0.015,
	color : "WHITE" //useless
}

export const bigBallRadius : number = 0.035


