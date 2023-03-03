import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../main'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
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

function Register () {
	let navigate = useNavigate()
	const { userData, setUserData } = useContext(UserContext)
	const [user, setUser] = useState({
								email: "",
								hash: "",
								login: "",
								info: ""
							})
	const [infoDiv, setInfoDiv] = useState<string>("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newProfile = {
				email: user.email,
				hash: user.hash,
				login: user.login,
				info: user.info
		}

		try {
			const token  = await instanceAPI.post('auth/signup', {
				email: newProfile.email,
				login: newProfile.login,
				password: newProfile.hash,
				info: newProfile.info
			})
			localStorage.setItem("auth-token", token.data.access_token)

			if (token.data) {
				const myUser = await instanceAPI.get('myUser/user', {
					headers: {
						Authorization: `Bearer ${token.data.access_token}`
					}
				})

				const avatar = await instanceAPI.get('myUser/myAvatar', {
					headers: {
						Authorization: `Bearer ${token.data.access_token}`
					},
					responseType: "arraybuffer",
				});

				const buff = Buffer.from(avatar.data, 'binary')
				const base64 = buff.toString('base64')

				//create private room
				if (myUser.data) {
					if (setUserData) {
						setUserData({
							token: token.data.access_token,
							user: myUser.data,
							avatar: base64
						})
					}
				}
			}

			setUser({
				email: "",
				hash: "",
				login: "",
				info: "",
			})

			navigate('/myProfile')
		}
		catch (e : any) {
			if (e.message == "Request failed with status code 400")
				setInfoDiv("Please respect the required format !")
			else if (e.message == "Request failed with status code 403")
				setInfoDiv("Login/Email already associated with an account !");
		}
	}

	const handleChange = (e) => {
		const { value, name} = e.target
		setUser(oldUser => {
			return {...oldUser, [name]: value}
		})
	}

	return (
		<FormDiv>
			<h1>Register :</h1>
			<div>{infoDiv}</div>
			<form onSubmit={handleSubmit}  style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
				
				<label>E-mail :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="email" name="email" required value={user.email}
					title='Enter a valid email'
					onChange={handleChange}/>
				<br/>
				
				<label>Login :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="text" name="login" required value={user.login} pattern="[A-Za-z0-9]{3,10}"
					title='Your login must contain between 3 and 10 letters/numbers !'
					onChange={handleChange}/>
				<br/>

				<label>Password :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="password" name="hash" required value={user.hash} pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}"
					title='Your password must contain minimum five characters, at least one uppercase letter, one lowercase letter and one number !'
					onChange={handleChange}/>
				<br/>

				<label>Infos :</label>
				<input style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="text" name="info" value={user.info} pattern=".{0,50}"
				title='Maximum 50 characters !'
					onChange={handleChange}/>
				<br/>

				<ValidButton style={{padding:"2%", margin:"2% 0% 7% 0%", fontSize:"medium"}} type="submit" value="Register !" />
			</form>
		</FormDiv>
	)
}

export default Register
