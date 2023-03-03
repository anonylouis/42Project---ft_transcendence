import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import socket from '../socket';

import { instanceAPI } from '../../../datas/instanceAPI';

import BanIcon from '../../../assets/ban-48.png';
import UnbanIcon from '../../../assets/unban-48.png';

import { UserListDiv } from '../../../styles/Chat.styled';

function IsMemberSelectedBan(memberSelected) {
	const { userData, setUserData } = useContext(UserContext);
	const [ isSelectedBan, setIsSelectedBan ] = useState(false);
	const options = [1, 3, 5];
	const [ time, setTime ] = useState(1);

	const checkBan = async () => {
		const bans = await instanceAPI.get('member/ban', {
			headers: {
				"roomId": `${userData.user.currentRoomId}`,
				"Authorization": `Bearer ${userData.token}`
			}
		})
		if (bans.data) {
			const found = bans.data.find(ban => ban.userId === memberSelected.props.id);

			if (found)
				setIsSelectedBan(true);
			else
				setIsSelectedBan(false);
		}
	}

	useEffect(() => {
		checkBan();
	}, []);

	useEffect(() => {
		socket.on('newBan', (userName) => {
			checkBan();
		});
		socket.on('unban', (userName) => {
			checkBan();
		});
		return () => {
			socket.off('newBan');
			socket.off('unban');
		};
	}, []);


	const banUser = async (ban) => {
		if (userData?.token && userData?.user) {
			if (!isSelectedBan && ban.id !== userData.user.id) {
				const target = await instanceAPI.put('member/ban', null, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"new-ban": `${ban.id}`,
						"until": `${time}`,
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (target) {
					const content = {
						userName: ban.login,
						roomName: userData.user.currentRoomName
					};

					socket.emit('newBan', content);
				}
			}
		}
	}

	const unbanUser = async (ban) => {
		if (userData?.token && userData?.user) {
			if (isSelectedBan && ban.id !== userData.user.id) {
				const target = await instanceAPI.put('member/ban', null, {
					headers: {
						"roomId": `${userData.user.currentRoomId}`,
						"new-ban": `${ban.id}`,
						"until": "0",
						"Authorization": `Bearer ${userData.token}`
					}
				});
				if (target) {
					const content = {
						userName: ban.login,
						roomName: userData.user.currentRoomName
					};
					socket.emit('unban', content);
				}
			}
		}
	}

	const onOptionsChangeHandler = (e) => {
		setTime(e.target.value);
	}

	return (
		<>
			{isSelectedBan ?
			(
				<UserListDiv onClick={() => unbanUser(memberSelected.props)}>
					<img src={UnbanIcon} />
					<b>UnBan</b>
				</UserListDiv>
			) : (
				<>
					<UserListDiv>
						<img src={BanIcon} onClick={() => banUser(memberSelected.props)} />
						<b>Ban</b>
					</UserListDiv>
					<select onChange={onOptionsChangeHandler}>
					<option>Choose time to ban</option>
					{options.map((option, index) => {
						return <option key={index} >
							{option}
						</option>
					})}
					</select>
				</>
			)}
		</>
	)
}

export default IsMemberSelectedBan;
