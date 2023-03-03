import { Injectable, ForbiddenException, Req, Res, Body, StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Block } from './interfaceBlock';
import { join } from 'path';

@Injectable()
export class BlockService {
	constructor(
		private prisma: PrismaService,
	) {}

	async getBlocks(userId: string) {
		try {
			const blocks = await this.prisma.block.findMany({
				where: {
					userId,
				},
			});
			var fs = require('fs');
			let tab : Block[] = JSON.parse(JSON.stringify(blocks));

			for (let element of tab) {
				const blockUser = await this.prisma.user.findUnique({
					where: {id: element.blockId}
				});
				if (!blockUser) {
					element.avatar = undefined;
				} else {
					element.avatar = fs.readFileSync(join(process.cwd(), blockUser.avatar), 'base64');
					element.login = blockUser.login;
				}
			}
			return tab;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Can\'t find BlockList',
					)
				}
			}
			throw error;
		}
	}

	getBlockById(userId: string, blockId: number) {
		return this.prisma.block.findFirst({
			where: {
				id: blockId,
				userId,
			},
		});
	}

	async createBlock(blockId: string, userId: string) {
		const newBlock = await this.prisma.user.findUnique({
			where: {
				id: blockId
			}
		})
		if (!newBlock || newBlock.id !== blockId || newBlock.id === userId) {
			throw new ForbiddenException(
				'Can\'t create new block',
			);
		}
		const alreadyBlock = await this.prisma.block.findFirst({
			where: {
				blockId,
				userId,
			}
		})
		if(alreadyBlock) {
			throw new ForbiddenException(
				'Can\'t create new block',
			);
		}
		const addBlock = await this.prisma.block.create({
			data: {
				userId,
				blockId
			},
		});
		return addBlock;
	}

	async deleteBlockById(userId: string, oldBlockId: number) {
		const oldBlock = await this.prisma.block.findFirst({
			where: {
//				id: oldBlockId,
				userId,
			},
		});
		if (!oldBlock || oldBlock.userId !== userId) {
			throw new ForbiddenException(
				'Can\'t delete block',
			);
		}
		await this.prisma.block.delete({
			where: {
				id: oldBlockId,
			},
		});
		return this.prisma.block.findMany({
			where: {
				userId,
			},
		});
	}
}
