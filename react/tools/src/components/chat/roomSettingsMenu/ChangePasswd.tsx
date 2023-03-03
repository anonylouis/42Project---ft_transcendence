import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import styled from 'styled-components';
import { instanceAPI } from '../../../datas/instanceAPI';
import socket from '../socket';
import Swal from 'sweetalert2';
import { UserListDiv, IconMenuImg } from '../../../styles/Chat.styled';
import AddKeyIcon from '../../../assets/add-key-48.png';
import RemoveKeyIcon from '../../../assets/remove-key-48.png';

function ChangePasswd(roomId) {
	const { userData, setUserData } = useContext(UserContext);
	const [ isPrivate, setIsPrivate ] = useState<bool>(false);
	const [ newKey, setNewKey ] = useState({password: ""});
	const [ oldKey, setOldKey ] = useState({password: ""});

	useEffect(() => {
		const getRoom = async () => {
			if (userData?.token && userData?.user) {
				const room = await instanceAPI.get('room/id/' + `${roomId.props}`, {
					headers: {
						Authorization: `Bearer ${userData?.token}`
					}
				});
			if(room.data.isPrivate)
				setIsPrivate(true);
			}
		}
		getRoom();
	}, [userData]);

	const addKey = async () => {
		Swal.fire({
			title: 'Password',
			html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
			confirmButtonText: 'Submit',
			focusConfirm: false,
			preConfirm: () => {
				const password = Swal.getPopup().querySelector('#password').value
				if (!password) {
					Swal.showValidationMessage(`Please enter a password`)
				}
				return { password: password }
			}
		}).then((result) => {
			instanceAPI.patch('room/'+`${roomId.props}`, {
				password: `${result.value.password}`,
				}, {
					headers: {
						"Authorization": `Bearer ${userData.token}`,
						"isPrivate": "true"
					}
			}).then(() => {
				setIsPrivate(true);
				socket.emit('roomsList');
			})
		})
	}

	const removeKey = async () => {
		Swal.fire({
			title: 'Password',
			html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
			confirmButtonText: 'Submit',
			focusConfirm: false,
			preConfirm: () => {
				const password = Swal.getPopup().querySelector('#password').value
				if (!password) {
					Swal.showValidationMessage("Please enter a password")
				}
				return { password: password }
			}
		}).then((result) => {
			instanceAPI.post('room/check', {
				roomId: roomId.props,
				password: result.value.password
			}, {
				headers: {
					Authorization: `Bearer ${userData?.token}`
				}
			}).then((response) => {
				instanceAPI.patch('room/'+`${roomId.props}`, {
					password: `${result.value.password}`,
					}, {
						headers: {
							"Authorization": `Bearer ${userData.token}`,
							"isPrivate": "false"
						}
				}).then(() => {
					setIsPrivate(false);
					socket.emit('roomsList');
				})
			}).catch((e) => {
				console.log('wrong password', e)
			})
		})
	}

	return (
		<>
			{isPrivate ?
			(
				<>
					<UserListDiv>
						<IconMenuImg src={AddKeyIcon} onClick={addKey} />
						<span>Change Key</span>
					</UserListDiv>
					<UserListDiv>
						<IconMenuImg src={RemoveKeyIcon} onClick={removeKey} />
						<span>Remove Key</span>
					</UserListDiv>
				</>
			) : (
				(roomId.props.id !== 1) ?
				(
					<UserListDiv>
						<IconMenuImg src={AddKeyIcon} onClick={addKey} />
						<span>Set Private</span>
					</UserListDiv>
				) : (
					null
				)
			)}
		</>
	)
}

export default ChangePasswd;
