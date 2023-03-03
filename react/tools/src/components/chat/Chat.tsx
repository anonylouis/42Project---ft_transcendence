import React, { useState, useEffect, useContext } from "react"
import { UserContext } from '../../main'
import styled from 'styled-components'
import socket from './socket';
import swal from 'sweetalert';

import { instanceAPI } from '../../datas/instanceAPI';

import ChatMessagesList from './ChatMessagesList';
import RoomsList from './RoomsList';
import UsersList from './UsersList';
import RoomMembersList from './roomMembersMenu/RoomMembersList';
import RoomSettingsMenu from './roomSettingsMenu/RoomSettingsMenu';

import BackgroundChat from '../../assets/tiger_walk.jpg';
import DropDown from '../../assets/drop-down-50.png';
import RoomIcon from '../../assets/house-48.png';
import PeopleIcon from '../../assets/people-48.png';
import TigerIcon from '../../assets/year-of-tiger-48.png';
import GearIcon from '../../assets/settings-48.png';
import CrownIcon from '../../assets/crown-48.png';
import AdminIcon from '../../assets/admin-48.png';
import OwnerIcon from '../../assets/monarch-48.png';


const TotalChatClosedDiv = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
	width: 800px;
	height: 20px;
	display: flex;
	flex-direction: column;
`

const TotalChatDiv = styled.div`
	position: fixed;
	right: 0;
	bottom: 0;
	width: 800px;
	height: 400px;
	display: flex;
	flex-direction: column;
`

const CloseDivOpen = styled.div`
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	height: 30px;
	border : solid;
	border-width : 1px 1px 0px 1px;
	background: rgba(168, 67, 67, 1);
	display: flex;
	flex-direction : row-reverse;
	align-items: center;
`
const CloseDivClose = styled(CloseDivOpen)`
	position : fixed;
	width : 800px;
	bottom : 0;
	right : 0;
`

const CloseButton = styled.button`
	background: rgba(240, 160, 160, 0.8);
	float: right;
	margin-right: 1%;
	font-weight: 1000;
	font-size: 1em;
	flex: 1;
`
const CurrentRoom = styled.div`
	flex : 15;
	text-align: center;
	font-size: 1em;
	font-weight: bold;
`

const UpDiv = styled.div`
	display: flex;
	flex-direction: row;
	height: 15%;
	border-top: 1px black solid;
	border-left: 1px black solid;
	border-right: 1px black solid;
	text-align: center;
`

const DownDiv = styled.div`
	display: flex;
	flex-direction: row;
	height: 85%;
	max-height: 80%;
`

const LeftMenuDiv = styled.div`
	background: rgba(168, 67, 67, 1);
	width: 30%;
	font-size: 20px;
	padding-top: 15px;
	border-bottom: 1px black solid;
`

const ChatMenuDiv = styled.div`
	background: rgba(240, 227, 193, 1);
	border-left: 1px black solid;
	border-bottom: 1px black solid;
	width: 70%;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
`

const ChatMenuButtonDiv = styled.div`
	display: flex;
	padding: 7px;
`

const IconMemberImg = styled.img`
	border: 1px rgba(225, 227, 193, 1) solid;
`

const IconMenuImg = styled.img`
	border: 1px rgba(168, 67, 67, 1) solid;
	&:hover {
		border: 1px orange solid;
		cursor: pointer;
	}
`

const LeftDiv = styled.div`
	display: flex;
	flex-direction: column;
	border-bottom-left-radius: 5px;
	background: rgba(168, 67, 67, 1);
	border-left: 1px black solid;
	border-bottom: 1px black solid;
	width: 30%;
	overflow-x: hidden;
	overflow-y: visible;
`

const ChatDiv = styled.div`
	background: rgba(225, 227, 193, 1);
	display: flex;
	border-bottom: 1px black solid;
	border-right: 1px black solid;
	flex-direction: column;
	width: 70%;
`

const ChatForm = styled.form`
	height: 10%;
	display: flex;
	flex-direction: row;
`

const ChatMsgInput = styled.input`
	width: 80%;
	background: rgba(240, 227, 193, 1);
	text-align: left;
`

const ChatButtonInput = styled.input`
	width: 25%;
	background: rgba(168, 67, 67, 1);
`

function Chat({chatOpen, setChatOpen} : {chatOpen : boolean, setChatOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
	const { userData, setUserData } = useContext(UserContext);
	const [ isConnected, setIsConnected ] = useState(socket.connected);
	const [ isReady, setIsReady ] = useState(false);
	const [ isAdmin, setIsAdmin ] = useState(false);
	const [ isOwner, setIsOwner ] = useState(false);
	const [ isMute, setIsMute ] = useState(false);
	const [ isBan, setIsBan ] = useState(false);
	const [ isBlock, setIsBlock ] = useState(false);
	const [ isInTigerMenu, setIsInTigerMenu ] = useState(true);
	const [ isInRoomsMenu, setIsInRoomsMenu ] = useState(false);
	const [ isInMembersMenu, setIsInMembersMenu ] = useState(false);
	const [ isInSettingsMenu, setIsInSettingsMenu ] = useState(false);
	const [ isInUserMenu, setIsInUserMenu ] = useState(false);
	const [ chatMessage, setChatMessage ] = useState({msg: "", roomName: ""});

	const [ currentRoom, setCurrentRoom ] = useState({});

	var re = new RegExp("^([\x20-\x7E]{1,50})$");

	useEffect(() => {
		if (userData?.token && userData?.user) {
			setIsReady(true);
			if (userData?.user) {
				const getRoom = async () => {
					const room = await instanceAPI.get('room/id/' + userData.user.currentRoomId, {
						headers: {
							"Authorization": `Bearer ${userData?.token}`
						}
					});

					if (room.data) {
						setCurrentRoom(room.data);
						if (room.data.ownerId === userData.user.id)
							setIsOwner(true);
						else
							setIsOwner(false);
						//check if you are admin in the current room
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
						//check if you are mute in the current room
						const mutes = await instanceAPI.get('member/mute', {
							headers: {
								"Authorization": `Bearer ${userData?.token}`,
								"roomId": `${room.data.id}`
							}
						});

						if (mutes) {
							const found = mutes.data.find(mute => mute.userId === userData.user.id);

							if (found)
								setIsMute(true);
							else
								setIsMute(false);
						}
					}
				}
				getRoom();
			}
		} else {
			setIsReady(false);
		}
	}, [userData]);

/*
**This hooks connect the user after many checks.
*/
	useEffect(() => {
		if (isReady) {
			const getSessionID = async () => {
				let sessionID = localStorage.getItem("sessionID");

				if (!sessionID || sessionID == "" || sessionID === undefined || userData?.user) {
					let session = await instanceAPI.get('myUser/sessionId', {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth-token")}`
						}
					});
					localStorage.setItem("sessionID", session.data);
				}
				if (!sessionID) {
					sessionID = localStorage.getItem("sessionID");
				}
				if (isConnected == false) {
					const username = userData.user.login;

					socket.auth = { sessionID, username };

					socket.connect();
//					setIsConnected(socket.connected);
					const rooms = { username: userData.user.login, roomName: userData.user.currentRoomName };

					socket.emit("userJoin", rooms);
				}
			}
			getSessionID();
		}
	}, [isReady]);

	useEffect(() => {
		socket.on('connect', () => {
			setIsConnected(socket.connected);
		});

		socket.on('connect_error', (err) => {
			if (err.message === "invalid username") {
				setIsConnected(false);
			}
		});

		socket.on("session", ({ sessionID, userID, username }) => {
			// attach the session ID to the next reconnection attempts
			socket.auth = { sessionID, username };
			// store it in the localStorage
			localStorage.setItem("sessionID", sessionID);
			// save the ID of the userID
			socket.userID = userID;
		});

		socket.on('disconnect', () => {
			localStorage.setItem("sessionID", "");
			setIsConnected(false);
		});

		return () => {
			socket.off('connect');
			socket.off('connect_error');
			socket.off('session');
			socket.off('disconnect');
		};
	}, []);

	const handleChange = (e) => {
		setChatMessage({...chatMessage, [e.target.name]: e.target.value})
	}

/*
** This function send messages to the database and
** all sockets in the room, when the user click on the send button.
*/

	const newMessageSubmit = async (e) => {
		e.preventDefault()
		
		if (!re.test(chatMessage.msg))
			return;

		if (userData?.user && userData.user.currentRoomName && chatMessage.msg !== ""
			&& userData.user.currentRoomName != ("invite-"+ userData.user.id)) {
			let parsedMsg = chatMessage.msg.trim();

			if (parsedMsg === "") {
				swal({title: "You are not allow to send only space", icon: "info"});;
				return ;
			}

			if (currentRoom.isWhisp === false) {
				const newMessage = {
					sender: userData.user.login,
					receveir: userData.user.currentRoomName,
					message: parsedMsg,
					roomName: userData.user.currentRoomName,
					roomId: userData.user.currentRoomId,
					isWhisp: false
				}

				const messageResponse = await instanceAPI.post('message/' + newMessage.roomId,
					null, {
					headers: {
						"Authorization": `Bearer ${userData.token}`,
						"sender": `${newMessage.sender}`,
						"receveir": `${newMessage.receveir}`,
						"message": `${newMessage.message}`,
						"isWhisp": `"false"`
					}
				})
				if (messageResponse.data)
					socket.emit('privateMessage', newMessage);
			} else {
				const newMessage = {
					sender: userData.user.login,
					receveir: userData.user.currentRoomName,
					message: parsedMsg,
					roomName: userData.user.currentRoomName,
					roomId: userData.user.currentRoomId,
					isWhisp: true
				}

				const messageResponse = await instanceAPI.post('message/' + newMessage.roomId,
					null, {
					headers: {
						"Authorization": `Bearer ${userData.token}`,
						"sender": `${newMessage.sender}`,
						"receveir": `${newMessage.receveir}`,
						"message": `${newMessage.message}`,
						"isWhisp": `"true"`
					}
				})

				if (messageResponse.data)
					socket.emit('privateMessage', newMessage);
				const room = await instanceAPI.get('room/name/' + userData.user.login, {
					headers: {
						"Authorization": `Bearer ${userData?.token}`
					}
				});

				if (room.data) {
					const newMessageCpy = {
						sender: userData.user.login,
						receveir: userData.user.currentRoomName,
						message: parsedMsg,
						roomName: room.data.name,
						roomId: room.data.id,
						isWhisp: true
					}

					const ret = await instanceAPI.post('message/' + room.data.id,
						null, {
						headers: {
							"Authorization": `Bearer ${userData.token}`,
							"sender": `${newMessage.sender}`,
							"receveir": `${newMessage.receveir}`,
							"message": `${newMessage.message}`,
							"isWhisp": `"true"`
						}
					})
					socket.emit('privateMessage', newMessageCpy);
				}
			}
			setChatMessage({
				msg: "",
				roomName: ""
			})
			e.target.reset();
		}
	}

	const mutedAlert = () => {
		swal({title: "You are muted in this room..", icon: "warning"});
	}

	useEffect(() => {
		socket.on('newAdmin', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You are a admin!", icon: "info"});;
				setIsAdmin(true);
			}
		});

		socket.on('unsetAdmin', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You are not admin anymore!", icon: "info"});;
				setIsAdmin(false);
			}
		});

		socket.on('newMute', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You are a muted!", icon: "info"});;
				setIsMute(true);
			}
		});

		socket.on('unmute', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You have been unmuted!", icon: "info"});;
				setIsMute(false);
			}
		});

		socket.on('newBan', async (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You are ban and kick from your current room!", icon: "info"});
				let userTmp:User = userData.user;

				userTmp.currentRoomId = 1;
				userTmp.currentRoomName = "General Chat";
				await instanceAPI.put('myUser/changeRoom', null, {
					headers: {
						"roomId": userTmp.currentRoomId,
						"roomName": userTmp.currentRoomName,
						"Authorization": `Bearer ${userData.token}`,
					}
				});
				setIsBan(true);
			}
		});

		socket.on('unban', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You have been unbanned!", icon: "info"});;
				setIsBan(false);
			}
		});

		socket.on('newFriend', (userName) => {
			if (userData?.user && userName === userData.user.login) {
				swal({title: "You have a new friend!", icon: "info"});;
			}
		});

		return () => {
			socket.off('newAdmin');
			socket.off('unsetAdmin');
			socket.off('newMute');
			socket.off('unmute');
			socket.off('newBan');
			socket.off('unBan');
		};
	}, [userData]);

/*
** the four functions below allow to change between users and rooms,
** in the left component.
*/

	const goInTigerMenu = () => {
		setIsInTigerMenu(true);
		setIsInRoomsMenu(false);
		setIsInMembersMenu(false);
		setIsInSettingsMenu(false);
	}

	const goInRoomsMenu = () => {
		setIsInTigerMenu(false);
		setIsInRoomsMenu(true);
		setIsInMembersMenu(false);
		setIsInSettingsMenu(false);
	}

	const goInMembersMenu = () => {
		setIsInTigerMenu(false);
		setIsInRoomsMenu(false);
		if (isInMembersMenu && !isInUserMenu)
			setIsInUserMenu(true);
		else
			setIsInUserMenu(false);
		setIsInMembersMenu(true);
		setIsInSettingsMenu(false);
	}

	const goInSettingsMenu = () => {
		setIsInTigerMenu(false);
		setIsInRoomsMenu(false);
		setIsInMembersMenu(false);
		setIsInSettingsMenu(true);
	}

	return (
		<div>
		{userData?.token && userData?.user ? (
					chatOpen ? (
						<TotalChatDiv>
							<CloseDivOpen>
								<CloseButton onClick={() => setChatOpen(false)}> − </CloseButton>
								<CurrentRoom>{userData.user.currentRoomName === ("invite-"+userData.user.id) ? "Game Invitation" : userData.user.currentRoomName}</CurrentRoom>
							</CloseDivOpen>
							<UpDiv>
								<LeftMenuDiv>
									<IconMenuImg onClick={() => goInTigerMenu()} src={TigerIcon} title="Users List"/>
									<IconMenuImg onClick={() => goInRoomsMenu()} src={RoomIcon} title="Rooms List"/>
									<IconMenuImg onClick={() => goInMembersMenu()} src={PeopleIcon} title="Room Members List"/>
									<IconMenuImg onClick={() => goInSettingsMenu()} src={GearIcon} title="Room Settings"/>
								</LeftMenuDiv>
								<ChatMenuDiv>
									<ChatMenuButtonDiv>
									<h3>You are in: {userData.user.currentRoomName === ("invite-"+userData.user.id) ? "Game Invitation" : userData.user.currentRoomName} </h3>
									{isAdmin ? ( <IconMemberImg src={AdminIcon} title="You are admin"/> ) : ( null )}
									{isOwner ? ( <IconMemberImg src={OwnerIcon} title="You are owner"/> ) : ( null )}
									</ChatMenuButtonDiv>
								</ChatMenuDiv>
							</UpDiv>
							<DownDiv>
								<LeftDiv>
									{isInTigerMenu ?
									(
										<>
											<b>USER CONNECTED</b>
											<UsersList />
										</>
									) : (
										null
									)}
									{isInRoomsMenu ?
									(
										<>
											<b>ROOMS LIST</b>
											<RoomsList />
											</>
									) : (
										null
									)}
									{isInMembersMenu ?
									(
										<>
											<b>USER MENU</b>
											<RoomMembersList value={isInUserMenu} />
										</>
									) : (
										null
									)}
									{isInSettingsMenu ?
									(
										<>
											<b>SETTINGS</b>
											<RoomSettingsMenu props={currentRoom}/>
										</>
									) : (
										null
									)}
								</LeftDiv>
								<ChatDiv>
									<ChatMessagesList props={currentRoom} />
									{!isMute ?
									(
										<ChatForm onSubmit={newMessageSubmit}>
											<ChatMsgInput type="text" name="msg" maxlenght="50"
												placeholder="Enter your message here.."
												autocomplete="off"
												pattern="[\x20-\x7E]{1,50}"
												required defaultValue={chatMessage.msg}
												onChange={handleChange} />
											<ChatButtonInput type="submit" value="Message!" />
										</ChatForm>
									) : (
										<ChatForm>
											<ChatMsgInput placeholder="You are Muted.."/>
											<ChatButtonInput onClick={mutedAlert} value="Muted!" />
										</ChatForm>
									)}
								</ChatDiv>
							</DownDiv>
						</TotalChatDiv>
					) : (
					<TotalChatClosedDiv>
						<CloseDivClose>
							<CloseButton onClick={() => setChatOpen(true)}> + </CloseButton>
							<CurrentRoom>{userData.user.currentRoomName === ("invite-"+userData.user.id) ? "Game Invitation" : userData.user.currentRoomName}</CurrentRoom>
						</CloseDivClose>
					</TotalChatClosedDiv>
				)
		) : (
			null
		)}
		</div>
	)
}

export default Chat
