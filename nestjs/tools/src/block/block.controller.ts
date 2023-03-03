import { Body, Injectable, Controller, UseGuards, Get, Post, Delete, Req, Res, Param } from '@nestjs/common';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BlockService } from './block.service';

@UseGuards(JwtGuard)
@Controller('block')
export class BlockController {
	constructor(
		private blockService: BlockService,
	) {}

	@Get()
	getBlocks(@GetUser('id') userId: string) {
		return this.blockService.getBlocks(userId);
	};

	@Post()
	createBlock(@Req() req: Request, @GetUser('id') userId: string) {
		const blockId = req.header('new-block');
		return this.blockService.createBlock(blockId, userId);
	}

	@Delete(':id')
	deleteBlockById(@GetUser('id') userId: string, @Param() params) {
		return this.blockService.deleteBlockById(userId, parseInt(params.id));
	};
}
