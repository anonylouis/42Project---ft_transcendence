import React, { useState, useEffect, useContext, FormEvent, ChangeEvent } from 'react'
import { UserContext } from '../../main'
import styled from 'styled-components'
import { instanceAPI } from '../../datas/instanceAPI';
import { Buffer } from 'buffer'
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/interfaceMain';

const QRDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Photo = styled.img`
	margin:30px;
	margin-left: 40px;
	margin-right: 40px;
	width: 250px;
	height: 250px;
	border: 3px white solid;
	object-fit: cover;
`

const DeleteButton = styled.button`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	color : red;
	text-transform : capitalize;
	font-size: large;
	background: rgba(0, 0, 0, 0.9);
	border-radius: 25px 10px 25px 10px;
	float: right;
	cursor: pointer;
	width: 40%;
	margin: auto;
	margin-bottom: 20px;
`

const InputText = styled.input`
	padding-top : 5px;
	padding-bottom : 5px;
	padding-right: 10px;
	padding-left: 10px;
	font-size: medium;
	margin: 20px;
`

const Form = styled.form`
	display: flex;
	flex-direction: column;
`

function QrCodeTwoFaAuth() {
	let navigate = useNavigate();
	const { userData, setUserData } = useContext(UserContext);
	const [ Image, setImage ] = useState<string | null>(null);
	const [ CodeValue, setCodeValue] = useState<string | null>(null);

	const TryCode = async (e : FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (userData?.token && userData.user) {
			const isValid = await instanceAPI.post('auth/2fa/authenticate', {
				}, {
					headers: {
						'code': `${CodeValue}`,
						'Authorization': `Bearer ${userData.token}`
					}, 
				})
			const result : boolean = isValid.data;
			if (result) {
				localStorage.setItem("auth-token", userData.token)
				setUserData!({...userData, ["AuthValidated"]: true});
				navigate("/myProfile");
			}
			else {
				const qrcode = await instanceAPI.post('auth/2fa/generate', {}, {
					headers: {Authorization: `Bearer ${userData.token}`}, 
					responseType: "arraybuffer"
				})
				if (qrcode?.data) {
					setImage(Buffer.from(qrcode.data, 'binary').toString('base64'));
				}	
			}
		}
	}

	const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { value, name } = e.target
		setCodeValue(value);
	}

	useEffect(() => {
		const getQrCode = async() => {
			if (userData?.token && userData.user) {
				const qrcode = await instanceAPI.post('auth/2fa/generate', {}, {
					headers: {Authorization: `Bearer ${userData.token}`}, 
					responseType: "arraybuffer"
				})
				if (qrcode?.data) {
					setImage(Buffer.from(qrcode.data, 'binary').toString('base64'));
				}
			}
		}
		getQrCode();
	}, [userData]);

	return (
		<QRDiv>
			<Photo src={Image ? `data:image/jpeg;base64,${Image}` : undefined} alt="QrCodeTwoFaAuth"/>
			<Form onSubmit={TryCode}>
				<InputText type="text" name="code" value={CodeValue ? CodeValue : ''}
					onChange={handleChange}/>
				<br/>
				<DeleteButton type="submit">OK !</DeleteButton>
			</Form>
		</QRDiv>
	)
}

export default QrCodeTwoFaAuth;
