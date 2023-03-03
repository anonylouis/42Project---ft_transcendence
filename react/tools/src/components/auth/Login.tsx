import React, { useState, useContext, ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../main'
import styled from 'styled-components'
import axios from 'axios'
import { Buffer } from 'buffer'

import { instanceAPI } from '../../datas/instanceAPI';

const FormDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	background-color: rgba(0, 0, 0, 0.87);
	width: 50%;
	margin: 3%;
	padding: 2% 3% 5% 3%;
	border:3px rgba(240, 160, 160, 0.863) solid;
	border-radius: 5%;
`

const ValidButton = styled.input`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	color : white;
	font-size: large;
	background: rgba(255, 120, 120, 0.6);
	border: solid 1px;
	cursor: pointer;
`

function Login () {
	let navigate = useNavigate();
	const { userData, setUserData } = useContext(UserContext)
	const [logField, setLogField] = useState<string | null>(null);
	const [user, setUser] = useState({
								email: "",
								login: "",
								hash: ""
							})

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newProfile = {
				email: logField,
				login: logField,
				hash: user.hash,
		}

		const token  = await instanceAPI.post('auth/signin', {
			email: newProfile.email,
			login: newProfile.login,
			password: newProfile.hash
		})

		const loginResponse  = await instanceAPI.get('myUser/user',
			{headers: {"Authorization": `Bearer ${token.data.access_token}`} }
		)

		const avatar = await instanceAPI.get('myUser/myAvatar', {
			headers: {"Authorization": `Bearer ${token.data.access_token}`},
			responseType: "arraybuffer",
		});

		const buff = Buffer.from(avatar.data, 'binary')
		const base64 = buff.toString('base64')

		if (token.data && loginResponse?.data) {
			setUserData({
				token: token.data.access_token,
				user: loginResponse.data,
				avatar: base64,
				AuthValidated:!(loginResponse.data.isTwoFaAuthEnabled as boolean),
			})
			setUser({
				email: "",
				login: "",
				hash: "",
			})

			if (loginResponse.data.isTwoFaAuthEnabled as boolean) {
				localStorage.setItem("auth-token", "")
				navigate("/twoFaAuth");
			}
			else {
				localStorage.setItem("auth-token", token.data.access_token)
				navigate("/myProfile");
			}
		}
	}

	const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
		const { value, name} = e.target
		setUser(oldUser => {
			return {
				...oldUser,
				[name]: value
			}
		})
	}

	const handleLogFieldChange = (e : ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { value, name } = e.target
		setLogField(value);
	}

	return (
		(userData?.user && userData.token && userData.AuthValidated) ? (
			<FormDiv>
				<h1> You are connected as {userData.user.login}</h1>
			</FormDiv>
		) : (
		<FormDiv>
			<h1>Log In :</h1>
			<form onSubmit={handleSubmit} style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
				<label>E-mail or Login :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="text" name="logField" value={logField ? logField : ''}
					onChange={handleLogFieldChange}/>
				<br/>
				<label>Password :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="password" name="hash" value={user.hash}
					onChange={handleChange}/>
				<br/>
				<ValidButton style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="submit" value="Log In !" />
			</form>
		</FormDiv>
	))
}

export default Login
