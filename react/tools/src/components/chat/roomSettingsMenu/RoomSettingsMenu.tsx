import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import styled from 'styled-components';
import swal from 'sweetalert';

import { instanceAPI } from '../../../datas/instanceAPI';
import socket from '../socket';
import UserMenu from '../UserMenu';
import ChangePasswd from './ChangePasswd';
import CreateRoom from './CreateRoom';
import LeaveRoom from './LeaveRoom';
import { UserListDiv, IconMenuImg } from '../../../styles/Chat.styled';

function RoomSettingsMenu(roomId) {
	const { userData, setUserData } = useContext(UserContext);
	const [ currentRoom, setCurrentRoom ] = useState({});
	const [ isAdmin, setIsAdmin ] = useState<bool>(false);
	const [ isOwner, setIsOwner ] = useState<bool>(false);

	useEffect(() => {
		const getRoom = async () => {
			if (userData?.token && userData?.user) {
				const room = await instanceAPI.get('room/id/' + roomId.props.id, {
					headers: {
						"Authorization": `Bearer ${userData?.token}`
					}
				});

				if (room.data) {
					setCurrentRoom(room.data);

					const admins = await instanceAPI.get('admin', {
						headers: {
							"Authorization": `Bearer ${userData?.token}`,
							"roomId": `${room.data.id}`
						}
					});
					if (admins) {
						const found = admins.data.find(admin => admin.userId === userData.user.id);

						if (found)
							setIsAdmin(true);
						else
							setIsAdmin(false);
					} else {
						setIsAdmin(false);
					}
						if (room.data.ownerId === userData.user.id)
							setIsOwner(true);
						else
							setIsOwner(false);
				} else
					setIsOwner(false);
			}
		}
		getRoom();
	}, [userData, currentRoom]);

	return (
		<>
			<CreateRoom />
			{userData?.user.currentRoomId !== 1 ? (<LeaveRoom props={roomId.props}/>) : (null)}
			{isOwner ? (<ChangePasswd props={roomId.props.id}/>) : (null)}
		</>
	)
}

export default RoomSettingsMenu;
