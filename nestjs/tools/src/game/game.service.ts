import { Injectable } from '@nestjs/common';
import { getLogin } from './gameRequest';
import { Game, GameInfo, Match, intervalIDtype, EndScreenInfo, InitData } from './interfaceGame';
import { defaultParameters, resetBall, updateGame} from './physics';


@Injectable()
export class GameService {
	private readonly gameMap: Map<string, GameInfo> = new  Map<string, GameInfo>();
	private readonly playersMap: Map<string, string | null> = new  Map<string, string>();

	getMatchArray() : Array<Match> {
		let tab : Array<Match> = [];
		for (let entry of this.gameMap.entries())
		{
			if (entry[1].players[0] !== null && entry[1].players[1] === null) {
				tab.push({name: entry[0], nb: entry[1].nb.toString(), button:"Join !"});
			}
			else {
				tab.push({name: entry[0], nb: "2", button:"Spectate !"});
			}
		}
		return (tab);
	}

	getPlayerArray() : Array<string> {
		let tab : Array<string> = [];
		for (let entry of this.playersMap.entries())
		{
			tab.push(entry[0]);
		}
		return (tab);
	}

	createRoom(id : string) : string {
		let roomName : string = "game-".concat(id);
		this.playersMap.set(id, roomName);
		this.gameMap.set(roomName,  {game:null, nb: 1, players: [id, null], intervalID: null, options: null});
		return roomName;
	}

	getRoomPlayers(roomName : string) : Array<string | null> {
		if (this.gameMap.has(roomName)) {
			return (this.gameMap.get(roomName).players);
		}
		return Array<string | null>();
	}

	isInRoom(id : string) : boolean {
			return this.playersMap.has(id) && this.playersMap.get(id) !== null;
	}

	getRoom(id : string) : string | null {
		if (this.playersMap.has(id) && this.playersMap.get(id) !== null) {
			return this.playersMap.get(id);
		}
		return null;
	}

	joinRoom(id : string, roomName : string) : boolean {
		if (this.gameMap.has(roomName) && this.gameMap.get(roomName).nb === 1) {
			this.playersMap.set(id, roomName);
			this.gameMap.get(roomName).nb = 2;
			this.gameMap.get(roomName).players[1] = id;
			return true;
		}
		return false;
	}

	spectateRoom(id : string, roomName : string) : boolean {
		if (this.gameMap.has(roomName) && this.gameMap.get(roomName).nb >= 2) {
			this.playersMap.set(id, roomName);
			this.gameMap.get(roomName).nb += 1;
			this.gameMap.get(roomName).players.push(id);
			return true;
		}
		return false;
	}

	// return true if the game has been destroyed
	leaveRoom(id : string) : boolean {
		let r : boolean = false;
		let roomName : string | null = this.playersMap.get(id);
		if (roomName !== null && this.gameMap.has(roomName)) {
			if (this.gameMap.get(roomName).players[0] === id) {
				if (this.gameMap.get(roomName).players[1] !== null) {
					for(var p of this.gameMap.get(roomName).players)
					{
						this.playersMap.set(p, null);
					}
				}
				this.gameMap.delete(roomName);
				r = true;
			}
			else if (this.gameMap.get(roomName).players[1] === id) {
				this.gameMap.get(roomName).nb -=1;
				this.gameMap.get(roomName).players[1] = null;
			}
			else
				this.gameMap.get(roomName).nb -=1;
		}
		this.playersMap.set(id, null);
		return (r);
	}

	initGame(props : InitData) : string | null {

		let roomName : string | null = this.playersMap.get(props.userId);
		if (roomName !== null && this.gameMap.has(roomName) && this.gameMap.get(roomName).players[1] != null && this.gameMap.get(roomName).players[0] === props.userId) {

			// options
			this.gameMap.get(roomName).options = new Map(JSON.parse(props.optionsJSON));

			this.gameMap.get(roomName).game = {
				mode : props.mode,
				p1: 0.5,
				p2: 0.5,
				ballX: 0, // set with resetBall
				ballY: 0, // set with resetBall
				Vx: 0, // set with resetBall
				Vy: 0, // set with resetBall
				speed: 0, // set with resetBall
				ballRadius: defaultParameters.ballRadius,
				playerWidth: defaultParameters.playerWidth,
				p1Height: defaultParameters.playerHeight,
				p2Height: defaultParameters.playerHeight,
				score1: 0,
				score2: 0,
				big : this.gameMap.get(roomName).options.get('big'),
				fast : this.gameMap.get(roomName).options.get('fast'),
				psy : this.gameMap.get(roomName).options.get('psy'),
				evil : this.gameMap.get(roomName).options.get('evil'),
				ballColor : "white",
				p1Color: "White",
				p2Color: "White",
				bonus1 : null, // set with resetBall
				bonus2 : null, // set with resetBall
				bonusRadius : defaultParameters.bonusRadius,
			};
			resetBall(this.gameMap.get(roomName).game); // initial state

			return roomName;
		}
		return null;
	}

	updateGame(roomName : string) : Game | null {
		let r : Game = this.gameMap.get(roomName).game;
		if (updateGame(r)) {
			// game finished
			clearInterval(this.gameMap.get(roomName).intervalID);
			return (null);
		}
		return (r);
	}

	updatePos(id : string, p : number) : void {
		let roomName : string | null = this.playersMap.get(id);
		if (roomName === null)
			return ;
		let gameinfo : GameInfo = this.gameMap.get(roomName);
		if (gameinfo.nb >= 2 && id == gameinfo.players[0]) {
			//normalise with the player's height
			if (p < gameinfo.game.p1Height / 2)
				p = gameinfo.game.p1Height / 2
			else if (p > 1 - (gameinfo.game.p1Height / 2))
				p = 1 - (gameinfo.game.p1Height / 2)

			if (gameinfo.options.get('invert'))
				gameinfo.game.p1 = 1 - p;
			else
				gameinfo.game.p1 = p;
		}
		else if (gameinfo.nb >= 2 && id == gameinfo.players[1]) {
			//normalise with the player's height
			if (p < gameinfo.game.p2Height / 2)
				p = gameinfo.game.p2Height / 2
			else if (p > 1 - (gameinfo.game.p2Height / 2))
				p = 1 - (gameinfo.game.p2Height / 2)

			if (gameinfo.options.get('invert'))
				gameinfo.game.p2 = 1 - p;
			else
				gameinfo.game.p2 = p;
		}
	}

	addIntervalID(roomName : string, intervalID : intervalIDtype) : void {
		this.gameMap.get(roomName).intervalID = intervalID;
	}

	getGame(id : string) : Game {
		return this.gameMap.get(this.playersMap.get(id)).game;
	}

	gameStarted(roomName : string) : boolean {
		return (this.gameMap.get(roomName).game !== null)
	}

	closeGame(roomName : string) : EndScreenInfo {
		let gameinfo : GameInfo = this.gameMap.get(roomName);
		const r : EndScreenInfo = {player1:gameinfo.players[0], player2:gameinfo.players[1], score1:gameinfo.game.score1, score2:gameinfo.game.score2, mode:gameinfo.game.mode};
		this.playersMap.set(r.player1, null);
		this.playersMap.set(r.player2, null);

		for(var p of gameinfo.players)
		{
			this.playersMap.set(p, null);
		}
		this.gameMap.delete(roomName);
		return (r);
	}

	connection(id : string) : void {
		this.playersMap.set(id, null);
	}

	deconnection(id : string) : void {
		this.leaveRoom(id);
		this.playersMap.delete(id);
	}

	invitSend(id : string) : void {
		if (this.getRoom(id) == null)
			this.createRoom(id);
	}

	joinInvit(id : string , ToJoinId: string) : boolean {
		const roomName = this.getRoom(ToJoinId);
		if (roomName) {
			if (this.joinRoom(id, roomName)) {
				return (true);
			}
			if (this.spectateRoom(id, roomName)) {
				return (true);
			}
		}
		return (false);
	}
}
