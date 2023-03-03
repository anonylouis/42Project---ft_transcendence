import {
	IsOptional,
	IsNotEmpty
} from 'class-validator';

export class RoomDto {
	@IsOptional()
	roomId: number;

	@IsOptional()
	name: string;

	@IsOptional()
	password: string;
}
