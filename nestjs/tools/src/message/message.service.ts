import { Injectable, ForbiddenException, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { BlockService} from '../block/block.service';
import { MyUserService} from '../myUser/myUser.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { addAchievement } from 'src/achievement/AddAchievement';
import { Message } from '@prisma/client'


@Injectable()
export class MessageService {
	constructor(
		private prisma: PrismaService,
		private blockService: BlockService,
		private userService: MyUserService,
	) {}

	async getMessages(roomId: number, userId: string) {
		const messagesList = await this.prisma.message.findMany({
			where: {
				roomId,
			},
		});
		const blockedList = await this.blockService.getBlocks(userId);

		if (messagesList) {
			let tab : Message[] = JSON.parse(JSON.stringify(messagesList));

			if (blockedList !== null && blockedList !== undefined && blockedList.length > 0) {
				for (let element of tab) {
					const senderId = await this.userService.getIdByLogin(element.sender);
					if (senderId) {
						const found = blockedList.find(user => senderId === user.blockId);
						if (found) {
							element.message = "Blocked by user...";
						}
					}
				}
				return tab;
			}
			return messagesList;
		} else {
			return messagesList;
		}
	}

	async createMessage(sender: string, receveir: string,
						message: string, roomId: number, isWhisp: boolean) {
		const room = await this.prisma.room.findUnique({
			where: {
				id: roomId,
			},
		});
		
		const user = await this.prisma.user.findUnique({
			where: {
				login: sender,
			},
		});
		addAchievement(this.prisma, user.id, "Chatty");

		const newMessage = await this.prisma.message.create({
			data: {
				roomId,
				roomName: room.name,
				sender,
				receveir,
				isWhisp,
				message
			},
		});
		return message;
	}
}
