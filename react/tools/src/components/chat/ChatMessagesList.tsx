import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from '../../main';
import styled from 'styled-components';
import socket from './socket';

import { instanceAPI } from '../../datas/instanceAPI';
import { Message } from "../../interfaces/interfaceMessage";
import { joinData } from "../../interfaces/interfaceGame";
import { useNavigate } from "react-router-dom";

const MsgListDiv = styled.div`
	height: 90%;
	justify-content: center;
	border-left: 1px black solid;
	overflow-x: hidden;
	overflow-y: visible;
	white-space: pre-wrap;
	white-space: -moz-pre-wrap;
	white-space: -pre-wrap;
	white-space: -o-pre-wrap;
	word-wrap: break-word;
`

const ChatUl = styled.ul`
	list-style: none;
`

const ChatLi = styled.li`
	justify-content: center;
`
const InvitButton = styled.button`
	font-weight: bold;
	border: 2px solid;
	border-color: rgba(255, 70, 70, 1);
	background-color:rgba(220, 137, 115, 0.5);
	width: 60px;
	&:hover {
		background-color:rgba(220, 137, 115, 0.8);
	}
	cursor: pointer;
`

function ChatMessagesList(currentRoom) {
	const { userData, setUserData } = useContext(UserContext);
	const [ msgList, setMsgList] = useState<Message[]>([]);

	const getMessagesInRoom = async (roomId) => {
		if (userData?.token && userData?.user) {
			const messages = await instanceAPI.get('message/' + roomId, {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			})
			if (messages.data) {
				if (currentRoom.props.isWhisp === false) {
					setMsgList(messages.data);
				} else {
					let tmpMsgList: Array<Message> = [];

					messages.data.forEach((msg) => {
						if ((msg.sender === userData.user.login && msg.receveir === userData.user.currentRoomName)
						|| (msg.sender === userData.user.currentRoomName && msg.receveir === userData.user.login)
						|| (userData.user.currentRoomName === ("invite-"+userData.user?.id)))
							tmpMsgList.push(msg);
					})
					setMsgList(tmpMsgList);
				}
			}
		}
	}

/*
** Display Message on refresh or entering room.
*/

	useEffect(() => {
		if (userData?.user && currentRoom.props) {
			getMessagesInRoom(userData.user.currentRoomId);
		}
	}, [userData, currentRoom]);

/*
** Display new Message on receive.
*/

	useEffect(() => {
		socket.on('privateMessage', (newMessage) => {
			if (msgList && newMessage && userData?.user) {
				if (currentRoom.props.isWhisp === false && newMessage.content.isWhisp === false) {
					getMessagesInRoom(userData.user.currentRoomId);
				} else {
					if ((newMessage.content.sender === userData.user.login && newMessage.content.roomName === userData.user.currentRoomName)
					|| (newMessage.content.sender === newMessage.content.roomName && newMessage.content.receveir === userData.user.login)
					|| (newMessage.content.roomName == "invite-"+userData.user.id)) {
						getMessagesInRoom(userData.user.currentRoomId);
					}
				}
			}
		});
		return () => {
			socket.off('privateMessage');
		};
	}, [currentRoom]);

/*
** Scroll down in chat Message on receive.
*/

	useEffect(() => {
		const element = document.getElementById("chatMessageList");

		if (element)
			element.scrollIntoView(false);
	}, [msgList]);

	function joinGame(toJoinId: string) {
		if (userData?.user) {
			const data : joinData = {userId: userData.user.id, toJoinId:toJoinId}
			socket.emit('joinInvit', data);
		}
	}

	let navigate = useNavigate();
	useEffect(() => {
		socket.on('successfullyJoined', () => {
			navigate('/game');
		});
	},[])

	return (
		<MsgListDiv>
			<ChatUl id="chatMessageList">
				{msgList ?
				(msgList.map((msg, index) => {
					return (
						<ChatLi key={index}>
							<br />
							<b>{msg.sender}: </b>
							<br />
							{(msg.roomName === ("invite-"+userData?.user?.id) && msg.message !== "Deprecated Invitation !") ? (
									<i><span>
										&emsp;Join my game !! &emsp;
										-- &gt; &ensp;
										<InvitButton onClick={() => joinGame(msg.message)}>Join</InvitButton>
										&ensp; &lt; --
									</span></i>
								) : (
									<i><span>&emsp;{msg.message}</span></i>
							)}
						</ChatLi>
					)
				})
				) : (
					null
				)}
			</ChatUl>
		</MsgListDiv>
	)
}

export default ChatMessagesList;
