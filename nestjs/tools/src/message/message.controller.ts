import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MessageService } from './message.service';

@UseGuards(JwtGuard)
@Controller('message')
export class MessageController {
	constructor(
		private messageService: MessageService,
	) {}

	@Get(':id')
	getMessages(@Param('id', ParseIntPipe) roomId: number, @GetUser('id') userId: string) {
		return this.messageService.getMessages(roomId, userId);
	};

	//createMessage(@Req() req: Request, @Res() res: Response, @Param('id', ParseIntPipe) roomId: number) {
	@Post(':id')
	createMessage(@Req() req: Request, @Param('id', ParseIntPipe) roomId: number) {
		const sender = req.header('sender');
		const receveir = req.header('receveir');
		const message = req.header('message');
		const isWhisp = req.header('isWhisp') === 'true';
		return this.messageService.createMessage(sender, receveir, message, roomId, isWhisp);
	}

}
