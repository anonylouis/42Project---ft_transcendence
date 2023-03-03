import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../main';
import styled from 'styled-components';
import socket from './socket';
import swal from 'sweetalert';
import { instanceAPI } from '../../datas/instanceAPI';
import { User } from '../../interfaces/interfaceUser';
import { UserListDiv } from '../../styles/Chat.styled';

const AvatarImg = styled.img`
	box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.7);
	width: 50px;
	height: 50px;
	border-radius: 50%;
	object-fit: cover;
	position: relative;
	left: 5px;
	top: 10px;
`

const StatusSpan = styled.span`
	margin-left: 45%;
	font-size: 17px;
`

const NameSpan = styled.span`
	margin-left: 20px;
	font-size: 20px;
`

const GreenDotSpan = styled.span`
	background-color: green;
	height: 7px;
	width: 7px;
	border: 1px black solid;
	border-radius: 50%;
	display: inline-block;
`

const RedDotSpan = styled.span`
	background-color: red;
	height: 7px;
	width: 7px;
	border: 1px black solid;
	border-radius: 50%;
	display: inline-block;
`

function UsersList() {
	const { userData, setUserData } = useContext(UserContext);
	const [ usersList, setUsersList ] = useState<User[] | null>(null);

	//Call the serveur to fetch userList
	useEffect(() => {
		if (userData?.user) {
			socket.emit('userList', userData.user.id);
			socket.on('userList', (users) => {
				setUsersList(users);
			});
		}
		return () => {
			if (userData?.user)
				socket.off('userList');
		};
	}, [userData]);

	const enteringRoom = async (roomName) => {
		if (userData?.user && userData?.token && roomName !== userData.user.login) {
			let oldRoomName: string = userData.user.currentRoomName;
			//check if rooms already exists.
			let roomExist = await instanceAPI.get('room/name/' + roomName, {
					headers: {
						"Authorization": `Bearer ${userData?.token}`
					}
			})

			if (roomExist.data) {
				const user = userData.user;

				user.currentRoomId = roomExist.data.id;
				user.currentRoomName = roomName;

				await instanceAPI.put('myUser/changeRoom', null, {
					headers: {
						"roomId": user.currentRoomId,
						"roomName": roomName,
						"Authorization": `Bearer ${userData?.token}`
					}
				});

				setUserData({...userData, ["user"]: user});
				const rooms = { oldRoomName: oldRoomName, newRoomName: roomName}

				socket.emit("roomEntered", rooms);
			}
		} else {
			swal({title: "You can't talk to yourself!", icon: "warning"});
		}
	}

	return (
		<>
			{usersList ?
			(
				usersList.map((user) => {
					if (user.login === userData?.user?.login) {
						return (null);
					}
					return (
						<UserListDiv key={user.id} onClick={() => enteringRoom(user.login)}>
						<AvatarImg src={user.avatar ? `data:image/jpeg;base64,${user.avatar}` : undefined}/>
						{
							<NameSpan>
							{user.login} <br/>
							{user.isConnected ? (
								<>
								<GreenDotSpan/>
								<StatusSpan>online</StatusSpan>
								</>
							) : (
								<>
								<RedDotSpan/>
								<StatusSpan>offline</StatusSpan>
								</>
							)}
							</NameSpan>
						}
						</UserListDiv>
					)
				})
			) : (
				<UserListDiv/>
			)}
		</>
	)
}

export default UsersList;
