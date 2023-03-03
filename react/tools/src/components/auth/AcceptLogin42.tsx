import React, { useEffect, useContext } from "react"
import { UserContext } from '../../main';
import { useParams, useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'

import { instanceAPI } from '../../datas/instanceAPI';

function AcceptLogin42() {
	const { userData, setUserData } = useContext(UserContext);
	let navigate = useNavigate();
	let { id } = useParams();

	const login = async () => {
		const token = await instanceAPI.get('auth/signWith42', {
			headers: {"id": id}
		})

		const myUser = await instanceAPI.get('myUser/user',
			{headers: {"Authorization": `Bearer ${token.data.access_token}`}}
		)
		const avatar = await instanceAPI.get('myUser/myAvatar', {
			headers: {
				Authorization: `Bearer ${token.data.access_token}`
			},
			responseType: "arraybuffer",
		});
		const buff = Buffer.from(avatar.data, 'binary')
		const base64 = buff.toString('base64')
		if (myUser?.data && token?.data?.access_token && base64 && setUserData) {
			setUserData({
				token: token.data.access_token,
				user: myUser.data,
				avatar: base64,
				AuthValidated:!(myUser.data.isTwoFaAuthEnabled as boolean),
			})
			if (myUser.data.isTwoFaAuthEnabled as boolean) {
				localStorage.setItem("auth-token", "")
				navigate("/twoFaAuth");
			}
			else {
				localStorage.setItem("auth-token", token.data.access_token)
				navigate("/myProfile");
			}
		}
	}

	useEffect(() => {
		login();
	}, []);

	return (
		<>
		</>
	)
}

export default AcceptLogin42;
