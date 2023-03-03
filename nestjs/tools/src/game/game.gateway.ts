import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {EndScreenInfo, Game, InitData, intervalIDtype, joinData, Match, userPos, userRoom } from './interfaceGame'
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { addGameToHistory, deprecatedInvitations, deprecatedInvitationsStart, getLogin } from './gameRequest';

const PORT : number = parseInt(process.env.VITE_GATEWAY_PORT);

@WebSocketGateway(PORT, {
	path: '/mysocket',
	cors: true,
})

export class GameGateway {
	constructor(private gameService: GameService, private prisma: PrismaService) {}
	@WebSocketServer()
	server : Server;
	
	@SubscribeMessage('loadGamePage')
  	handleMessage(client : Socket, userId : string) {
		let roomName : string | null = this.gameService.getRoom(userId);
		
		if (roomName !== null) {
			client.join(roomName);
			if (this.gameService.gameStarted(roomName))
				this.server.to(client.id).emit('startGame');
			else
				this.server.to(roomName).emit('inRoom', this.gameService.getRoomPlayers(roomName));
		}
		else {
			this.server.to(client.id).emit('notInRoom');
		}
	}

	@SubscribeMessage('initGame')
	initGame(client : Socket, props : InitData) {
		let roomName : string | null = this.gameService.initGame(props);
		if (roomName !== null) {
			this.server.to(roomName).emit('startGame');
	
			let intervalID : intervalIDtype = setInterval(() => {
				let r : Game | null = this.gameService.updateGame(roomName);
				if (r !== null)
					this.server.to(roomName).emit('renderGame', r);
				else
				{
					let r : EndScreenInfo = this.gameService.closeGame(roomName)
					this.server.to(roomName).emit('gameFinished', r);
					this.server.to(roomName).emit('updateRoomFront', roomName);
					addGameToHistory(this.prisma, r);
				}
			}, 1000 / 60);

			this.gameService.addIntervalID(roomName, intervalID);
			if(this.gameService.getRoomPlayers(roomName)[0] == props.userId) {
				deprecatedInvitationsStart(this.prisma, props.userId);
			}
		}
	}

	@SubscribeMessage('updatePos')
	updatePos(client: Socket, props : userPos) {
		this.gameService.updatePos(props.userId, props.pos);
	}

	@SubscribeMessage('updateRoomBack')
	updateRoom(client : Socket, props : userRoom) {
		if (this.gameService.getRoom(props.userId) === null)
		{
			client.leave(props.roomName);
			this.server.to(client.id).emit('notInRoom');
		}
		else {
			this.server.to(client.id).emit('inRoom', this.gameService.getRoomPlayers(props.roomName));
		}
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client : Socket, props : userRoom) {
		if (this.gameService.joinRoom(props.userId, props.roomName)) {
			client.join(props.roomName);
			this.server.to(props.roomName).emit('inRoom', this.gameService.getRoomPlayers(props.roomName));
			var tab : Match[] = this.gameService.getMatchArray();

			var promiseTab : Promise<any>[] = [];
			for (let m of tab) {
				promiseTab.push(getLogin(this.prisma, m.name.slice(5)))
			}
			Promise.all(promiseTab).then(
				(values) => {
					for (let i = 0; i < values.length; i++) {
						tab[i].name = values[i]+"******"+tab[i].name;
					}
					this.server.emit("updateMatchList", tab);
				}
			)
		}
	}

	@SubscribeMessage('spectateRoom')
	spectateRoom(client : Socket, props : userRoom) {
		if (this.gameService.spectateRoom(props.userId, props.roomName)) {
			client.join(props.roomName);

			if (this.gameService.gameStarted(props.roomName))
				this.server.to(client.id).emit('startGame');
			else
				this.server.to(props.roomName).emit('inRoom', this.gameService.getRoomPlayers(props.roomName));

			var tab : Match[] = this.gameService.getMatchArray();

			var promiseTab : Promise<any>[] = [];
			for (let m of tab) {
				promiseTab.push(getLogin(this.prisma, m.name.slice(5)))
			}
			Promise.all(promiseTab).then(
				(values) => {
					for (let i = 0; i < values.length; i++) {
						tab[i].name = values[i]+"******"+tab[i].name;
					}
					this.server.emit("updateMatchList", tab);
				}
			)
		}
	}

	@SubscribeMessage('leaveRoom')
		leaveRoom(client : Socket, userId : string) {
			let roomName : string | null = this.gameService.getRoom(userId);
			if (this.gameService.leaveRoom(userId)) {
				deprecatedInvitationsStart(this.prisma, userId);
			}
			if (roomName !== null) {
				this.server.to(roomName).emit('updateRoomFront', roomName);
			}
	}

	@SubscribeMessage('newRoom')
	createGame(client : Socket, userId : string) {
		const roomName : string = this.gameService.createRoom(userId);
		client.join(roomName);
		this.server.to(roomName).emit('inRoom', this.gameService.getRoomPlayers(roomName));
		var tab : Match[] = this.gameService.getMatchArray();

		var promiseTab : Promise<any>[] = [];
		for (let m of tab) {
			promiseTab.push(getLogin(this.prisma, m.name.slice(5)))
		}
		Promise.all(promiseTab).then(
			(values) => {
				for (let i = 0; i < values.length; i++) {
					tab[i].name = values[i]+"******"+tab[i].name;
				}
				this.server.emit("updateMatchList", tab);
			}
		)
	}

	@SubscribeMessage('loadMatchList')
	updateMatchList() {
		var tab : Match[] = this.gameService.getMatchArray();

		var promiseTab : Promise<any>[] = [];
		for (let m of tab) {
			promiseTab.push(getLogin(this.prisma, m.name.slice(5)))
		}
		Promise.all(promiseTab).then(
			(values) => {
				for (let i = 0; i < values.length; i++) {
					tab[i].name = values[i]+"******"+tab[i].name;
				}
				this.server.emit("updateMatchList", tab);
			}
		)
	}

	@SubscribeMessage('resetBack')
	resetBack(client : Socket) {
		this.server.to(client.id).emit('resetFront');
	}

	@SubscribeMessage('gameInvitSent')
	gameInvitSent(client : Socket, userId : string) {
		this.gameService.invitSend(userId);
	}

	@SubscribeMessage('joinInvit')
	joinInvit(client : Socket, props : joinData) {
		deprecatedInvitations(this.prisma, props.userId, props.toJoinId);
		if (this.gameService.joinInvit(props.userId, props.toJoinId)) {
			const roomName = this.gameService.getRoom(props.userId)
			client.join(roomName);
			this.server.to(client.id).emit('successfullyJoined');
			this.server.to(roomName).emit('inRoom', this.gameService.getRoomPlayers(roomName));
			var tab : Match[] = this.gameService.getMatchArray();

			var promiseTab : Promise<any>[] = [];
			for (let m of tab) {
				promiseTab.push(getLogin(this.prisma, m.name.slice(5)))
			}
			Promise.all(promiseTab).then(
				(values) => {
					for (let i = 0; i < values.length; i++) {
						tab[i].name = values[i]+"******"+tab[i].name;
					}
					this.server.emit("updateMatchList", tab);
				}
			)
		}
	}
}
