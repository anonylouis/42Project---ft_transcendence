import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from "socket.io";
import * as fs from 'fs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		httpsOptions: {
			key: fs.readFileSync('/usr/src/app/ft_transcendence/ssl_key/ft_transcendence.key.pem'),
			cert: fs.readFileSync('/usr/src/app/ft_transcendence/ssl_key/ft_transcendence-x509.crt'),
		},
	});

	app.enableCors();
	app.setGlobalPrefix('api');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	await app.listen(3000, "0.0.0.0");
}

bootstrap();
