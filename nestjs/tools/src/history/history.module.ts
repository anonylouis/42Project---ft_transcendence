import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller'
import { HistoryService } from './history.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [HistoryController],
	providers: [HistoryService],
})

export class HistoryModule {}
