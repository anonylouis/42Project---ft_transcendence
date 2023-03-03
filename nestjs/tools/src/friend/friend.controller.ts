import { Body, Injectable, Controller, UseGuards, Get, Post, Delete, Req, Res, Param } from '@nestjs/common';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { FriendService } from './friend.service';

@UseGuards(JwtGuard)
@Controller('friend')
export class FriendController {
	constructor(
		private friendService: FriendService,
	) {}

	@Get()
	getFriends(@GetUser('id') userId: string) {
		return this.friendService.getFriends(userId);
	};

	@Post()
	createFriend(@Req() req: Request, @GetUser('id') userId: string) {
		const friendId = req.header('new-friend');
		return this.friendService.createFriend(friendId, userId);
	}

	@Delete(':id')
	deleteFriendById(@GetUser('id') userId: string, @Param() params) {
		return this.friendService.deleteFriendById(userId, parseInt(params.id));
	};
}
