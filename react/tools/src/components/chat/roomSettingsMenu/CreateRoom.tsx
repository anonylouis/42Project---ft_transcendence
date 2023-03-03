import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import { instanceAPI } from '../../../datas/instanceAPI';
import socket from '../socket';
import NewRoomIcon from '../../../assets/add-new-48.png';
import { UserListDiv, IconMenuImg } from '../../../styles/Chat.styled';
import swal from 'sweetalert';

function CreateRoom() {
	const { userData, setUserData } = useContext(UserContext);
	const [ newRoom, setNewRoom ] = useState({name: "", password: "nopass"});

	var re = new RegExp("^([A-Za-z0-9]{3,10})$");

	const createRoom = async (e) => {
		e.preventDefault();

		if (!re.test(newRoom.name))
			return;

		if (newRoom.name === "") {
			swal({title: "Enter a room name!", icon: "warning"});
			return ;
		}
		//check if roomName is a userName already existing.
		const roomExist = await instanceAPI.get('room/name/'+ newRoom.name, {
				headers: {
					"Authorization": `Bearer ${userData?.token}`,
				}
		})

		//check if room already exists.
		if (!roomExist.data) {
			//create room
			const createdRoom = await instanceAPI.post('room', newRoom, {
					headers: {
						"Authorization": `Bearer ${userData?.token}`,
					}
			})

			if (createdRoom.data) {
				//change the user place
				let user:User = userData.user;

				user.currentRoomName = createdRoom.data.name;
				user.currentRoomId = createdRoom.data.id;
				await instanceAPI.put('myUser/changeRoom', null, {
					headers: {
						"roomId": user.currentRoomId,
						"roomName": user.currentRoomName,
						Authorization: `Bearer ${userData?.token}`
					}
				});

				const roomSocket = {
					oldRoomName: userData.user.currentRoomName,
					newRoomName: user.currentRoomName
				}

				socket.emit('roomEntered', roomSocket);
				setUserData({...userData, ["user"]: user});
				socket.emit('roomsList');
			}
		} else {
			swal({title: "Room already exist", icon: "info"});;
		}
		setNewRoom({
			name: "",
			password: "nopass"
		})
		e.target.reset();
	}

	const handleChangeNewRoom = (e) => {
		const { value, name } = e.target;

		setNewRoom(room => {
			return {...room, [name]: value}
		})
	}

	return (
		<>
			<UserListDiv>
				<form onSubmit={createRoom}>
					<label>Create room: </label>
					<input type="image" alt="Submit" src={NewRoomIcon} value={newRoom.name}/>
					<input type="text"
						name="name"
						placeholder="Enter the room name..."
						pattern="[A-Za-z0-9]{3,10}"
						required value={newRoom.name}
						onChange={handleChangeNewRoom}/>
				</form>
			</UserListDiv>
		</>
	)
}

export default CreateRoom;
