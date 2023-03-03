import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MedalService } from './medal.service';
import { CreateMedalDto, EditMedalDto } from './dto';

@UseGuards(JwtGuard)
@Controller('medal')
export class MedalController {
	constructor(
		private medalService: MedalService,
	) {}

	@Get()
	getMedals(@GetUser('id') userId: string) {
		return this.medalService.getMedals(userId);
	};

	@Get(':id')
	getMedalsByUserId(@Param('id') userId: string) {
		return this.medalService.getMedalsByUserId(userId);
	};

	@Post()
	createMedal(@Req() req: Request, @GetUser('id') userId: string) {
		const title = req.header('title');
		return this.medalService.createMedal(title, userId);
	}

	@Patch(':id')
	@FormDataRequest()
	editMedalById(@GetUser('id') userId: string, @Param('id', ParseIntPipe) medalId: number, @Body() dto: EditMedalDto) {
		return this.medalService.editMedalById(userId, medalId, dto);
	};
}
