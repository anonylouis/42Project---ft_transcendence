import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { HistoryService } from './history.service';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
	constructor(
		private historyService: HistoryService,
	) {}

	@Get()
	getHistory(@Req() req: Request) {
		return this.historyService.getHistory(req);
	};

}
