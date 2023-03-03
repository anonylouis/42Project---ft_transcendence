import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RoomDto } from './dto';
import { RoomService } from './room.service';
import  * as argon from 'argon2';

@UseGuards(JwtGuard)
@Controller('room')
export class RoomController {
	constructor(
		private roomService: RoomService,
	) {}

	@Post('check')
	async checkPassword(@Body() dto: RoomDto) {
		return this.roomService.checkPassword(dto);
	};

	@Get()
	async getRooms() {
		return this.roomService.getRooms();
	};

	@Get('name/:name')
	async getRoomByName(@Param('name') roomName: string) {
		return this.roomService.getRoomByName(roomName);
	};

	@Get('id/:id')
	getRoomById(@Param('id', ParseIntPipe) roomId: number) {
		return this.roomService.getRoomById(roomId);
	};

	@Post()
	async createRoom(@Req() req: Request, @Body() dto: RoomDto, @GetUser('id') userId: string) {
		const isWhisp = req.header('isWhisp') === 'true';
		let newPassword = "nopass";
		if (dto.password)
			newPassword = dto.password;
		const hash = await argon.hash(newPassword);
		return this.roomService.createRoom(dto.name, hash, userId, isWhisp);
	}

	@Patch(':id')
	@FormDataRequest()
	async editRoomById(@Req() req: Request, @Body() dto: RoomDto, @Param('id', ParseIntPipe) roomId: number) {
		const isPrivate = req.header('isPrivate') === 'true';
		let newPassword = "nopass";
		if (dto.password)
			newPassword = dto.password;
		const hash = await argon.hash(newPassword);
		return this.roomService.editRoomById(isPrivate, hash, roomId);
	};

	@Put('owner')
	async giveOwner(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('userId');
		const ownerId = req.header('ownerId');
		return this.roomService.giveOwner(roomId, userId, ownerId);
	}
}
