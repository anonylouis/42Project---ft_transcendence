import { Injectable } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { HttpService } from '@nestjs/axios';

const CALLBACK_URL = "https://" + process.env.VITE_HOSTNAME + ":"
+ process.env.VITE_PROXY_PORT + "/api/auth/redirect";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, "42") {
	constructor(private readonly httpService: HttpService) {
		super({
			clientID: process.env.VITE_FT_UID,
			clientSecret: process.env.VITE_FT_SECRET,
			callbackURL: CALLBACK_URL,
		});
	};
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile
	) : Promise <any> {
		const {id, emails, username, _raw} = profile;
		const email = emails[0].value;
		const login = username;
		const password = '42';
		const imageLink : string = JSON.parse(_raw).image.link;

		const uniqueFilename = require('unique-filename');
		var path : string = './' + uniqueFilename('./src/datas/uploads', '42Image');

		const cursus = JSON.parse(_raw).cursus_users;
		let info : string = "About me";
		for(var i=0; i<cursus.length; i++) {
			if(cursus[i].grade == "Learner") {
				info = "My blackhole is the " + new Date(cursus[i].blackholed_at).toDateString() + " ,but right now I prefer to play Tygerpong...";
			}
		}

		const response = await this.httpService.axiosRef({
			url: `${imageLink}`,
			method: 'GET',
			responseType: 'stream',
		});
		var fs = require('fs');
		const writer = fs.createWriteStream(path);
		response.data.pipe(writer);

		const authDto = {
			email,
			password,
			login,
			path,
			info
		}
		return authDto;
	};
}
