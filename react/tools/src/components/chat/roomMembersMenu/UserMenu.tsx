import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import { instanceAPI } from '../../../datas/instanceAPI';
import IsMemberSelectedAdmin from './IsMemberSelectedAdmin';
import IsMemberSelectedMute from './IsMemberSelectedMute';
import IsMemberSelectedBan from './IsMemberSelectedBan';
import PlayGameIcon from '../../../assets/play-game-48.png';
import InfosProfileIcon from '../../../assets/info-48.png';
import OwnerIcon from '../../../assets/monarch-48.png';
import { UserListDiv } from '../../../styles/Chat.styled';
import { User } from "../../../interfaces/interfaceUser";


interface MemberProps {
	props : User;
}

function UserMenu(memberSelected : MemberProps) {
	const { userData, setUserData } = useContext(UserContext);
	let navigate = useNavigate();
	const [ isAdmin, setIsAdmin ] = useState(false);
	const [ isOwner, setIsOwner ] = useState(false);
	const [ currentRoom, setCurrentRoom ] = useState({});

	useEffect(() => {
		if (userData?.token && userData?.user && memberSelected.props) {
			const checkAdmin = async () => {
				const admins = await instanceAPI.get('admin', {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"Authorization": `Bearer ${userData.token}`
					}
				})
				if (admins.data) {
					const found = admins.data.find(admin => admin.userId === userData.user.id);

					if (found)
						setIsAdmin(true);
					else
						setIsAdmin(false);
				} else {
					setIsAdmin(false);
				}
			}

			const checkOwner = async () => {
				const room = await instanceAPI.get('room/id/'
												+ userData.user.currentRoomId, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (room.data) {
					setCurrentRoom(room);
					if (room.data.ownerId === userData.user.id)
						setIsOwner(true);
					else
						setIsOwner(false);
				} else {
					setIsOwner(false);
				}
			}

			checkAdmin();
			checkOwner();
		}
	}, [userData]);

	const inviteToPlay = async (player : User) => {
		if (userData?.user)
		{
			const roomName = "invite-" + player.id;

			let roomExist = await instanceAPI.get('room/name/' + roomName, {
				headers: {"Authorization": `Bearer ${userData?.token}`}
			})

			if (roomExist.data) {
				const newMessage = {
					sender: userData.user.login,
					receveir: roomName,
					message: userData.user.id,
					roomName: roomName,
					roomId: roomExist.data.id,
					isWhisp: false
				}
				const messageResponse = await instanceAPI.post('message/' +  roomExist.data.id,
					null, {
					headers: {
						"Authorization": `Bearer ${userData.token}`,
						"sender": `${newMessage.sender}`,
						"receveir": `${newMessage.receveir}`,
						"message": `${newMessage.message}`,
						"isWhisp": `"false"`
					}
				})

				if (messageResponse.data) {
					socket.emit('privateMessage', newMessage);
					socket.emit('gameInvitSent', userData.user.id);
					navigate('/game');
				}
			}
		}
	}

	const viewProfile = (user) => {
		if (user.props.id === userData.user.id)
			navigate('/myProfile');
		else
			navigate('/profile/' + user.props.id);
	}

	return (
		<>
			{(memberSelected.props?.login && userData.user.id !== memberSelected.props.id) ?
			(
				<>
					<b>Member selected: {memberSelected.props.login}</b>
					<UserListDiv onClick={() => inviteToPlay(memberSelected.props)}>
						<img src={PlayGameIcon} />
						<b>Invite to Play</b>
					</UserListDiv>
					<UserListDiv onClick={() => viewProfile(memberSelected)}>
						<img src={InfosProfileIcon} />
						<b>View Profile</b>
					</UserListDiv>
					{isAdmin ?
					(
						<>
							<IsMemberSelectedMute props={memberSelected.props} />
							<IsMemberSelectedBan props={memberSelected.props} />
						</>
					) : (
						null
					)}
					{isOwner ?
					(
						<IsMemberSelectedAdmin props={memberSelected.props} />
					) : (
						null
					)}
				</>
				) : (
					null
				)}
		</>
	)
}

export default UserMenu;
