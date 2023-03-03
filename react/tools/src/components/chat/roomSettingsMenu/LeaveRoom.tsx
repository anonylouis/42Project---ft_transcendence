import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import { instanceAPI } from '../../../datas/instanceAPI';
import socket from '../socket';
import swal from 'sweetalert';
import { UserListDiv, IconMenuImg } from '../../../styles/Chat.styled';
import DeleteRoomIcon from '../../../assets/red-cross-48.png';

function LeaveRoom(currentRoom) {
	const { userData, setUserData } = useContext(UserContext);

	const leaveRoom = async () => {
		//give owner if you are the owner and delete from memberList of the room
		if (userData?.token && userData?.user && userData.user.currentRoomId !== 1) {
			if (currentRoom.props.ownerId == userData.user.id) {
				const members = await instanceAPI.get('member', {
					headers: {
						"roomId": currentRoom.props.id,
						"Authorization": `Bearer ${userData?.token}`
					}
				})
				if (members.data.length <= 1) {
					swal({text: "You can't leave room when you are alone.", icon: "info"});
					return ;
				} else if (members.data) {
					let newOwner:string;

					members.data.every((member) => {
						if (member.userId !== userData.user.id) {
							newOwner = member.userId;
							return true;
						}
					})
					const owner = await instanceAPI.put('room/owner', {}, {
						headers: {
							"roomId": currentRoom.props.id,
							"userId": userData.user.id,
							"ownerId": newOwner,
							"Authorization": `Bearer ${userData?.token}`
						}
					})
				}
				const roomLeaved = await instanceAPI.delete('member/leave', {
						headers: {
							"roomId": userData.user.currentRoomId,
							"delete-member": userData.user.id,
							"Authorization": `Bearer ${userData?.token}`
						}
				})

				if (roomLeaved.data) {
					let userTmp:User = userData.user;
					const rooms = { oldRoomName: userTmp.currentRoomName, newRoomName: "General Chat" }

					userTmp.currentRoomId = 1;
					userTmp.currentRoomName = "General Chat";
					instanceAPI.put('myUser/changeRoom', null, {
						headers: {
							"roomId": userTmp.currentRoomId,
							"roomName": userTmp.currentRoomName,
							"Authorization": `Bearer ${userData.token}`
						}
					});
					setUserData({...userData, ["user"]: userTmp});
					socket.emit("roomEntered", rooms);
				}
			} else {
				const roomLeaved = await instanceAPI.delete('member/leave', {
						headers: {
							"roomId": userData.user.currentRoomId,
							"delete-member": userData.user.id,
							"Authorization": `Bearer ${userData?.token}`
						}
				})

				if (roomLeaved.data) {
					let userTmp:User = userData.user;
					const rooms = { oldRoomName: userTmp.currentRoomName, newRoomName: "General Chat" }

					userTmp.currentRoomId = 1;
					userTmp.currentRoomName = "General Chat";
					instanceAPI.put('myUser/changeRoom', null, {
						headers: {
							"roomId": userTmp.currentRoomId,
							"roomName": userTmp.currentRoomName,
							"Authorization": `Bearer ${userData.token}`
						}
					});
					setUserData({...userData, ["user"]: userTmp});
					socket.emit("roomEntered", rooms);
				}
			}
		}
	}

	return (
		<>
			<UserListDiv>
				<IconMenuImg src={DeleteRoomIcon} onClick={leaveRoom} />
				<b>Leave Room</b>
			</UserListDiv>
		</>
	)
}

export default LeaveRoom;
