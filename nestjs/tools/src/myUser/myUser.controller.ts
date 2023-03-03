import { Injectable, Controller, Get, Req, Body, Post, Put, UseGuards, UploadedFile, UseInterceptors, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config';
import { Express, Request } from 'express';
import { PrismaService } from '../prisma/prisma.service'
import { MyUserService } from './myUser.service'
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { UserDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(JwtGuard)
@Injectable()
@Controller('myUser')
export class MyUserController {
	constructor(
		private prisma: PrismaService,
		private userService: MyUserService,
	) {}

	@Get('id')
	getId(@GetUser('id') userId: string) {
		return userId;
	}

	@Get('user')
	getUser(@GetUser() user: User) {
		return user;
	}

	@Put('2fa')
	async updateTwoFaAuth(userId : string, value : boolean) {
		const ret = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				isTwoFaAuthEnabled: value,
			},
		});
		return ret;
	}
	
	@Get('idByLogin')
	getIdByLogin(@Req() req: Request) {
		const login = req.header('userLogin')
		return this.userService.getIdByLogin(login);
	}

	@Get('loginById')
	getLoginById(@Req() req: Request) {
		const id = req.header('id')
		return this.userService.getLoginById(id);
	}

	@Get('profileById')
	getProfileById(@Req() req: Request) {
		const id = req.header('userId')
		return this.userService.getProfileById(id);
	}

	@Get('myAvatar')
	getAvatar(@Req() req: Request, @GetUser('avatar') userAvatar: string) {
		const file = createReadStream(join(process.cwd(), userAvatar));
		return new StreamableFile(file);
	}

	@Get('avatarById')
	async getAvatarById(@Req() req: Request) {
		const id = req.header('id');
		const path = await this.userService.getAvatarFromId(id)
		const file = createReadStream(join(process.cwd(), path));
		return new StreamableFile(file);
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('avatar'))
	uploadFile(@GetUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
		return this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				avatar: ((file.path) as string),
			},
		})
	}

	@Get('sessionId')
	getSessionId(@GetUser('sessionID') sessionId: string) {
		return sessionId;
	}

	@Put('')
	putProfile(@Body() dto: UserDto, @GetUser() user: User) {
		return this.userService.putProfile(user, dto.password, dto.email, dto.info);
	}

	@Put('isConnectedFalse')
	setConnectedFalse(@GetUser('id') id: string) {
		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				isConnected: false,
			},
		});
	};

	@Put('changeRoom')
	putCurrentRoom(@Req() req: Request, @GetUser('id') userId: string) {
		const roomId = parseInt(req.header('roomId'));
		const roomName = req.header('roomName');
		if (!roomId || !roomName)
			return null;
		return this.userService.changeRoom(roomId, roomName, userId);
	}
}
