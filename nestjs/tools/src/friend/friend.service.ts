import { Injectable, ForbiddenException, Req, Res, Body, StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Friend } from './interfaceFriend';
import { join } from 'path';

@Injectable()
export class FriendService {
	constructor(
		private prisma: PrismaService,
	) {}

	async getFriends(userId: string) {
		try {
			const friends = await this.prisma.friend.findMany({
				where: {
					userId,
				},
			});
			var fs = require('fs');
			let tab : Friend[] = JSON.parse(JSON.stringify(friends));

			for (let element of tab) {
				const friendUser = await this.prisma.user.findUnique({
					where: {id: element.friendId}
				});
				if (!friendUser) {
					element.avatar = undefined;
				} else {
					element.avatar = fs.readFileSync(join(process.cwd(), friendUser.avatar), 'base64');
					element.login = friendUser.login;
					element.victories = friendUser.victories;
					element.loses = friendUser.loses;
				}
			}
			return tab;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Can\'t find FriendList',
					)
				}
			}
			throw error;
		}
	}

	getFriendById(userId: string, friendId: number) {
		return this.prisma.friend.findFirst({
			where: {
				id: friendId,
				userId,
			},
		});
	}

	async createFriend(friendId: string, userId: string) {
		const newFriend = await this.prisma.user.findUnique({
			where: {
				id: friendId
			}
		})
		if (!newFriend || newFriend.id !== friendId || newFriend.id === userId) {
			throw new ForbiddenException(
				'Can\'t create new friend',
			);
		}
		const alreadyFriend = await this.prisma.friend.findFirst({
			where: {
				friendId,
				userId,
			}
		})
		if(alreadyFriend) {
			throw new ForbiddenException(
				'Can\'t create new friend',
			);
		}
		const addFriend = await this.prisma.friend.create({
			data: {
				userId,
				friendId
			},
		});
		return addFriend;
	}

	async deleteFriendById(userId: string, oldFriendId: number) {
		const oldFriend = await this.prisma.friend.findFirst({
			where: {
//				id: oldFriendId,
				userId,
			},
		});
		if (!oldFriend || oldFriend.userId !== userId) {
			throw new ForbiddenException(
				'Can\'t delete friend',
			);
		}
		await this.prisma.friend.delete({
			where: {
				id: oldFriendId,
			},
		});
		return this.prisma.friend.findMany({
			where: {
				userId,
			},
		});
	}
}
