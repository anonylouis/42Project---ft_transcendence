import {
	MessageBody,
	ConnectedSocket,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";

import { StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MyUserService } from '../myUser/myUser.service';
import { MessageService } from '../message/message.service';
import { BlockService } from '../block/block.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { Member } from '../member/interfaceMember';
import { join } from 'path';

const PORT : number = parseInt(process.env.VITE_GATEWAY_PORT);
const users = {};

@WebSocketGateway(PORT, {
	path: '/mysocket',
	cors: {
		origin: '*',
	},
})

export class SocketEvents {
	constructor(
		private prisma: PrismaService,
		private msg: MessageService,
		private blockService: BlockService,
		private userService: MyUserService,
	) {}

	@WebSocketServer()
	server: Server;

	//connexion
	async handleConnection(client: Socket) {
		this.server.use(async (socket, next) => {
			const sessionID = socket.handshake.auth.sessionID;
			if (sessionID) {
				//find existing session
				const session = await this.prisma.user.findUnique({
					where: {
						sessionID: sessionID,
					},
				})
				if (session) {
					(socket as any).sessionID = session.sessionID;
					(socket as any).userID = session.id;
					(socket as any).username = session.login;
					return next();
				}
			}
			const username = socket.handshake.auth.username;

			if (!username || username === undefined) {
				return next(new Error("invalid username"));
			}
			client.emit("session", {
				sessionID: client.handshake.auth.sessionID,
				username: client.handshake.auth.username,
				userID: client.handshake.auth.userID,
			})
		});
	}

	//deconnexion
	handleDisconnect(client: Socket) {
		const getAllSockets = async () => {
			const matchingSockets = await this.server.in(users[client.id]).allSockets();
			const isDisconnected = matchingSockets.size === 0;
			if (isDisconnected && users[client.id] !== undefined && users[client.id] !== "" && users[client.id] !== null) {
				const user = await this.prisma.user.update({
					where: {
						login: users[client.id],
					},
					data: {
						isConnected: false,
					},
				})

				delete users[client.id]
				const usersList = await this.prisma.user.findMany();
				if (usersList) {
					var fs = require('fs');
					let tab : User[] = JSON.parse(JSON.stringify(usersList));

					for (let element of tab) {
						element.avatar = fs.readFileSync(join(process.cwd(), element.avatar), 'base64');
					}
					client.broadcast.emit("userList", tab)
				}
			}
		}
		getAllSockets();
	}

	//Join the user to rooms
	@SubscribeMessage('userJoin')
	async handleUserJoin(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		if (content) {
			users[client.id] = content.username;
			client.join(content.username);
			client.join(content.roomName);
			const user = await this.prisma.user.update({
				where: {
					login: content.username,
				},
				data: {
					isConnected: true,
				},
			})

			const usersList = await this.prisma.user.findMany();
			if (usersList) {
				var fs = require('fs');
				let tab : User[] = JSON.parse(JSON.stringify(usersList));

				for (let element of tab) {
					element.avatar = fs.readFileSync(join(process.cwd(), element.avatar), 'base64');
				}
				this.server.emit("userList", tab);
			}
		}
	}

	//Send all chat user in objects array to all other user when arrive.
	@SubscribeMessage('userList')
	async handleUserList(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
		var fs = require('fs');

		const usersList = await this.prisma.user.findMany();
		let tab = JSON.parse(JSON.stringify(usersList));

		if (tab) {
			for (let element of tab) {
				element.avatar = fs.readFileSync(join(process.cwd(), element.avatar), 'base64');
			}
		}
		this.server.emit("userList", tab);
	}

	//entering room
	@SubscribeMessage('roomEntered')
	handleEnteringRoom(@MessageBody() room: any, @ConnectedSocket() client: Socket) {
		client.leave(room.oldRoomName);
		client.join(room.newRoomName);
	}

	//private message
	@SubscribeMessage('privateMessage')
	handlePrivateMessage(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('privateMessage', {
			content,
			from: users[client.id],
		});
	}

	@SubscribeMessage('roomsList')
	async handleRoomsList(@ConnectedSocket() client: Socket) {
		const rooms = await this.prisma.room.findMany({});

		if (rooms)
			this.server.emit("roomsList", rooms);
	}

	@SubscribeMessage('membersList')
	async handleMembersList(@MessageBody() room: any, @ConnectedSocket() client: Socket) {
		if (room) {
			var fs = require('fs');
			const members = await this.prisma.member.findMany({
				where: {
					roomId: room.id,
				}
			});
			let tab : Member[] = JSON.parse(JSON.stringify(members));

			for (let element of tab) {
				const memberUser = await this.prisma.user.findUnique({
					where: {id: element.userId}
				});
				if (!memberUser) {
					element.avatar = undefined;
				} else {
					element.avatar = fs.readFileSync(join(process.cwd(), memberUser.avatar), 'base64');
					element.login = memberUser.login;
				}
			}
			this.server.to(room.name).emit("membersList", tab)
		}
	}

	/**************************************************************************/
	/*                      admin / mute / ban / block                        */
	/**************************************************************************/

	@SubscribeMessage('newAdmin')
	handleNewAdmin(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('newAdmin', content.userName);
	}

	@SubscribeMessage('unsetAdmin')
	handleUnsetAdmin(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('unsetAdmin', content.userName);
	}

	@SubscribeMessage('newMute')
	handleNewMute(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('newMute', content.userName);
	}

	@SubscribeMessage('newBan')
	handleNewBan(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('newBan', content.userName);
	}

	@SubscribeMessage('updateHistory')
	handleUpdateHistory(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('updateHistory', content.userName);
	}

	@SubscribeMessage('newBlock')
	handleNewBlock(@MessageBody() content: any, @ConnectedSocket() client: Socket) {
		this.server.to(content.roomName).emit('newBlock', content.userName);
	}
}
