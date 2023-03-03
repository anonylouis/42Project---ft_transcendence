import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import socket from '../socket';
import { instanceAPI } from '../../../datas/instanceAPI';
import MuteIcon from '../../../assets/mute-48.png';
import UnmuteIcon from '../../../assets/unmute-48.png';
import { UserListDiv } from '../../../styles/Chat.styled';
import { Member } from '../../../interfaces/interfaceMember';

function IsMemberSelectedMute(memberSelected) {
	const { userData, setUserData } = useContext(UserContext);
	const options = [1, 3, 5];
	const [ time, setTime ] = useState(1);

	useEffect(() => {
		socket.on('newMute', (userName) => {
		});
		return () => {
			socket.off('newMute');
		};
	}, []);

	const muteUser = async (mute) => {
		if (userData?.token && userData?.user) {
			if (mute.id !== userData.user.id) {
				const target = await instanceAPI.put('member/mute', null, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"new-mute": `${mute.id}`,
						"until": `${time}`,
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (target) {
					const content = {
						userName: mute.login,
						roomName: userData.user.currentRoomName
					};
					socket.emit('newMute', content);
				}
			}
		}
	}

	const onOptionsChangeHandler = (e) => {
		setTime(e.target.value);
	}

	return (
		<>
			<UserListDiv>
				<img src={MuteIcon} onClick={() => muteUser(memberSelected.props)} />
				<b>Mute</b>
			</UserListDiv>
			<select onChange={onOptionsChangeHandler}>
			<option>Choose time to mute</option>
			{options.map((option, index) => {
				return <option key={index} >
					{option}
				</option>
			})}
			</select>
		</>
	)
}

export default IsMemberSelectedMute;
