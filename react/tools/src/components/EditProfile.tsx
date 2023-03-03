import React, {useState, useContext, BaseSyntheticEvent, FormEventHandler, FormEvent, ChangeEventHandler, ChangeEvent } from 'react'
import { UserContext } from '../main'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import Logout from './auth/Logout'
import { instanceAPI } from '../datas/instanceAPI';
import { edit_props, edit_user } from '../interfaces/interfaceEditProfile'
import swal from 'sweetalert'

const EditDiv = styled.div`
	color: white;
`
const ValidButton = styled.button`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	color : red;
	text-transform : capitalize;
	font-size: large;
	background: rgba(0, 0, 0, 0.9);
	border-radius: 25px 10px 25px 10px;
	cursor: pointer;
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
`

const RedCross = styled.div`
	background-color: black;
	color: #FFF;
	float: right;
	font-size: 20px;
	cursor: pointer;
`
const InputImage = styled.input`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	font-size: medium;
	background: rgba(0, 0, 0, 0.9);
	border-radius: 25px 10px 25px 10px;
`
const InputText = styled.input`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	font-size: medium;
`
const InputSlide = styled.input`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	font-size: medium;
`

const EditProfile = ({close} : edit_props) => {
	let navigate = useNavigate();
	let { id } = useParams()
	const { userData, setUserData } = useContext(UserContext)
	const [user, setUser] = useState<edit_user>({login: null, password: null, email: null, info: null})

	const [newAvatar, setNewAvatar] = useState<File | null>(null);

	const [isChecked, setIsChecked] = useState<boolean>(userData?.user?.isTwoFaAuthEnabled ? userData?.user?.isTwoFaAuthEnabled : false);


	if (userData?.user) {
		id = userData.user.id
	}

	const avatarUpdate = (e : React.FormEvent<HTMLFormElement>) => {
		if (newAvatar)
		{
			e.preventDefault()
			const formdata = new FormData();
			formdata.append('avatar', newAvatar);
			formdata.append('fileName', newAvatar.name);
			const config = {
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
					'Content-Type': 'multipart/form-data',
				},
			};
			instanceAPI.post('myUser/upload', formdata, config).then(() => {
				
				instanceAPI.post('medal', {}, {
					headers: {
						"Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
						"title": "Fashion Victim"
					}
				}).then(() => {}).catch((e) => {
					console.log('Medal already obtained')
				});
				navigate(0);
			}).catch((e) => {
                swal({title: "Upload failed !!", icon: "warning"});
            });
		}
	}

	const userUpdate = () => {
		instanceAPI.put('myUser', user, {
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
			}
		}).then((user) => {
			navigate(0);
		}).catch((e) => {
			swal({title: "Update failed !!", icon: "warning"});
			setUser({login: null, password: null, email: null, info: null});
		});
	}

	const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { value, name } = e.target
		
		setUser(oldUser => {
			return {
				...oldUser,
				[name]: value
			}
		})
	}

	const DAUpdate= async (e : FormEvent<HTMLFormElement>) => {
		if (userData?.user?.id) {
			if (isChecked) {
				const token = await instanceAPI.post('auth/2fa/turn-on', null, {
					headers: {Authorization: `Bearer ${userData.token}`}
				});
			} else {
				const token = await instanceAPI.post('auth/2fa/turn-off', null, {
					headers: {Authorization: `Bearer ${userData.token}`}
				});
			}
		}
	}

	const handleChangeCheckBox = (e : ChangeEvent<HTMLInputElement>) => {
		setIsChecked(!isChecked);
	}

	const handleChangeAvatar = (e : ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files)
			setNewAvatar(e.target.files[0])
	}

	return (
		<EditDiv>
			<RedCross  onClick={() => close(false)}>&#10060;</RedCross>
			<h1>Editing {userData?.user?.login} </h1>

			<hr/>
			
			<h3>Change avatar: </h3>
			<form onSubmit={avatarUpdate}>
				<InputImage type="file" onChange={handleChangeAvatar}/>
				<DeleteButton type="submit">Upload avatar</DeleteButton>
			</form>

			<br/>
			<br/>
			<hr/>

			<h3>Double Authentification :</h3>
			<form onSubmit={DAUpdate}>
				<InputSlide type="checkbox" name="check2fa" value={undefined} onChange={handleChangeCheckBox} checked={isChecked}/>
				<DeleteButton type="submit">Update</DeleteButton>
			</form>

			<br/>
			<hr/>
			
			<h3>Change informations: </h3>
			
			<table><tbody>
				<tr>
					<td><label>Email : </label></td>
					<td><InputText type="email" name="email" placeholder={userData?.user?.email} value={user.email ? user.email : ''}
						title='Enter a valid email'
						onChange={handleChange}/></td>
				</tr>

				<tr>
					<td><label>Password : </label></td>
					<td><InputText type="text" name="password" placeholder={"********"} value={user.password ? user.password : ''} pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}"
						title='Your password must contain minimum five characters, at least one uppercase letter, one lowercase letter and one number !'
						onChange={handleChange}/></td>
				</tr>

				<tr>
					<td><label>Infos : </label></td>
					<td><InputText type="text" name="info" placeholder={userData?.user?.info} value={user.info ? user.info : ''} pattern=".{0,50}"
						title='Maximum 50 characters !'
						onChange={handleChange}/></td>
				</tr>
			</tbody></table>

			<br/>
			<ValidButton onClick={userUpdate}>Update</ValidButton>



		</EditDiv>
	)
}

export default EditProfile
