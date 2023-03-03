import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../main';
import socket from './socket';
import { instanceAPI } from '../../datas/instanceAPI';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

import LockIcon from '../../assets/lock-48.png';
import CrownIcon from '../../assets/crown-48.png';

import { UserListDiv } from '../../styles/Chat.styled';
import { Room } from "../../interfaces/interfaceRoom";
import { User } from "../../interfaces/interfaceUser";

function RoomsList() {
	const { userData, setUserData } = useContext(UserContext);
	const [ roomsList, setRoomsList ] = useState<Room[]>([]);

/*
** Get rooms to display them in the left chat component.
*/
	useEffect(() => {
		socket.emit('roomsList');
		socket.on('roomsList', (roomsList) => {
			setRoomsList(roomsList);
		});
		return () => {
			socket.off('roomsList');
		};
	}, []);

/*
** This function add user to room members at first entry.
*/
	const addMemberFirstRoomEntry = async () => {
		const members = await instanceAPI.get('member', {
			headers: {
				"roomId": `${userData.user.currentRoomId}`,
				"Authorization": `Bearer ${userData.token}`
			}
		});
		if (members) {
			const found = members.data.find(member => member.userId === userData.user.id);

			if (!found) {
				const newMember = await instanceAPI.post('member', null, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"roomName": `${userData.user.currentRoomName}`,
						"new-member": `${userData.user.id}`,
						"Authorization": `Bearer ${userData.token}`
					}
				})
				if (newMember) {
					const room = {id: userData.user.currentRoomId,
								name: userData.user.currentRoomName}
					socket.emit('membersList', room);
				}
			}
		}
	}

	const enteringRoom = async (props) => {
		let oldRoomName:string = userData.user.currentRoomName;
		let newRoom = props;
		let isBan = false;

		if (userData?.user && newRoom.id != userData.user.currentRoomId) {
			const bans = await instanceAPI.get('member/ban', {
				headers: {
					"Authorization": `Bearer ${userData.token}`,
					"roomId": newRoom.id
				}
			});
			bans.data.forEach((user) => {
				if (user.userId === userData.user.id) {
					swal({title: "You are ban in this room", icon: "info"});;
					isBan = true;
				}
			})
			if (!isBan) {
				if (newRoom.isPrivate) {
					Swal.fire({
						title: 'Password needed',
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
						instanceAPI.post('room/check', {
							roomId: newRoom.id,
							password: result.value.password
						}, {
							headers: {
								"Authorization": `Bearer ${localStorage.getItem("auth-token")}`
							}
						}).then((response) => {
							let userTmp:User = userData.user;
							userTmp.currentRoomId = newRoom.id;
							userTmp.currentRoomName = newRoom.name;
							instanceAPI.put('myUser/changeRoom', null, {
								headers: {
									"roomId": userTmp.currentRoomId,
									"roomName": userTmp.currentRoomName,
									Authorization: `Bearer ${userData.token}`
								}
							});
							setUserData({...userData, ["user"]: userTmp});
							addMemberFirstRoomEntry();
							const rooms = { oldRoomName: oldRoomName, newRoomName: newRoom.name }
							socket.emit("roomEntered", rooms);
						}).catch((e) => {console.log('entering private room failed', e)})
					})
				} else {
					let userTmp:User = userData.user;
					userTmp.currentRoomId = newRoom.id;
					userTmp.currentRoomName = newRoom.name;
					instanceAPI.put('myUser/changeRoom', null, {
						headers: {
							"roomId": userTmp.currentRoomId,
							"roomName": userTmp.currentRoomName,
							Authorization: `Bearer ${userData.token}`
						}
					});
					setUserData({...userData, ["user"]: userTmp});
					addMemberFirstRoomEntry();
					const rooms = { oldRoomName: oldRoomName, newRoomName: newRoom.name }
					socket.emit("roomEntered", rooms);
				}
			}
		}
	}

	return (
		<>
			{roomsList[0] ?
			(
				roomsList.map((room, index) => {
					return (
						<div key={index} >
							{(room.isWhisp === false || room.name === ("invite-"+userData?.user?.id)) ?
							(
								<UserListDiv onClick={() => enteringRoom(room)}>
									<h4>🐅: {room.isWhisp ? "Game Invitation" : room.name}</h4>
									<>
										{room.isPrivate ?
										(
											<img src={LockIcon} />
										) : (
											null
										)}
										{(room.ownerId === userData?.user?.id && room.isWhisp === false) ?
										(
											<span>(Owner)</span>
										) : (
											null
										)}
									</>
								</UserListDiv>
							) : (
								null
							)}
						</div>
					)
				})
			) : (
				null
			)}
		</>
	)
}

export default RoomsList;
