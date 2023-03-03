import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import socket from '../socket';

import { instanceAPI } from '../../../datas/instanceAPI';

import AdminIcon from '../../../assets/admin-48.png';
import RemoveAdminIcon from '../../../assets/remove-admin.png';

import { UserListDiv } from '../../../styles/Chat.styled';

function IsMemberSelectedAdmin(memberSelected) {
	const { userData, setUserData } = useContext(UserContext);
	const [ isSelectedAdmin, setIsSelectedAdmin ] = useState(false);

	const checkAdmin = async () => {
		if (userData?.token && userData?.user) {
			const admins = await instanceAPI.get('admin', {
				headers: {
					"roomId": `${userData.user.currentRoomId}`,
					"Authorization": `Bearer ${userData.token}`
				}
			})
			if (admins.data) {
				const found = admins.data.find(admin => admin.userId === memberSelected.props.id);

				if (found)
					setIsSelectedAdmin(true);
				else
					setIsSelectedAdmin(false);
			}
		}
	}

	useEffect(() => {
		checkAdmin();
	}, [userData]);

	useEffect(() => {
		socket.on('newAdmin', (userName) => {
			checkAdmin();
		});
		socket.on('unsetAdmin', (userName) => {
			checkAdmin();
		});
		return () => {
			socket.off('newAdmin');
			socket.off('unsetAdmin');
		};
	}, []);

	const setAdmin = async (admin) => {
		if (userData?.token && userData?.user) {
			if (!isSelectedAdmin && admin.id !== userData.user.id) {
				const target = await instanceAPI.post('admin', null, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"new-admin": `${admin.id}`,
						"userName": `${admin.login}`,
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (target) {
					const content = {
						userName: admin.login,
						roomName: userData.user.currentRoomName
					};

					setIsSelectedAdmin(true);
					socket.emit('newAdmin', content);
				}
			}
		}
	}

	const unsetAdmin = async (admin) => {
		//seulement owner peu unset admin.
		if (userData?.token && userData?.user) {
			if (isSelectedAdmin && admin.id !== userData.user.id) {
				const target = await instanceAPI.delete('admin', {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"delete-admin": `${admin.id}`,
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (target) {
					const content = {
						userName: admin.login,
						roomName: userData.user.currentRoomName
					};

					setIsSelectedAdmin(true);
					socket.emit('unsetAdmin', content);
				}
			}
		}
	}

	return (
		<>
			{isSelectedAdmin ?
			(
				<UserListDiv onClick={() => unsetAdmin(memberSelected.props)}>
					<img src={RemoveAdminIcon} />
					<b>Unset Admin</b>
				</UserListDiv>
			) : (
				<UserListDiv onClick={() => setAdmin(memberSelected.props)}>
					<img src={AdminIcon} />
					<b>Set Admin</b>
				</UserListDiv>
			)}
		</>
	)
}

export default IsMemberSelectedAdmin;
