import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [BlockController],
	providers: [BlockService],
})

export class BlockModule {}
