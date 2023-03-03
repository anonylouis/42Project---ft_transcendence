import React, { useState, useEffect, useContext, ChangeEvent } from 'react'
import { UserContext } from '../../main'
import styled from 'styled-components'
import { instanceAPI } from '../../datas/instanceAPI';
import RedCrossIcon from '../../assets/red-cross-48.png';
import { Friend } from '../../interfaces/interfaceFriend';

const FriendTable = styled.table`
	border-spacing: 0px 2px;
	width:100%;
	color: white;
	padding-right: 1%;
`

const NoFriendLine = styled.tr`
	width:100%;
	text-align:center;
	vertical-align: middle;
`

const FriendLine = styled(NoFriendLine)`
	background-color: rgba(106, 187, 164, 0.4);
`

const NoFriendCase = styled.td`
	width:40%;
	margin: 10px 5px;
	color: rgb(234, 238, 178);
`

const FriendScore = styled.td`
	width:40%;
	margin: 10px 5px;
`
const FriendLogin = styled.td`
	width:30%;
	margin: 10px 5px;
	vertical-align: middle;
	margin-top: auto;
	text-align: -webkit-match-parent;
`
const FriendImage = styled.td`
	width:10%;
	margin: 10px 5px;
	vertical-align: middle;
	margin-top: auto;
	text-align: left;
`

const FormDiv = styled.div`
	display: flex;
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 10px;
`

const RedCrossImg = styled.img`
	margin: auto;
	&:hover {
		cursor: pointer;
	}
`

const RedCrossDiv = styled.td`
	margin: auto;
`

const AddButton = styled.button`
	margin-left: 15px;
	border: 1px red solid;
	background : rgba(234, 238, 178, 1);
	font-size: 0.5em;
	font-weight: bold;
	cursor: pointer;
	border-radius: 5px;
`

const LabelButton = styled.label`
	font-size: smaller;
	margin-left: 10px;
	color: rgba(240, 150, 150, 0.8);
`

const InputLogin = styled.input`
	width: 30%;
	margin-left: 15px;
	border: 1px red solid;
	background : rgba(234, 238, 178, 1);
	font-size: medium;
	border-radius: 5px;
`

const ListLabelDiv = styled.div`
	margin-top: 30px;
	font-size: smaller;
	margin-left: 20px;
	margin-bottom: 10px;
	color: rgba(240, 150, 150, 0.8);
	width: fit-content;
`

interface UserLogin {
	login : string;
}

function FriendsMenu() {
	const { userData, setUserData } = useContext(UserContext);
	const [ userFriends, setUserFriends ] = useState<Friend[] | null>(null);
	const [ newFriend, setNewFriend ] = useState<UserLogin>({login: ""});
	const [ userBlocked, setUserBlocked ] = useState<Friend[] | null>(null);
	const [ newBlock, setNewBlock ] = useState<UserLogin>({login: ""});

	const getUserFriends = async () => {
		if (userData?.token) {
			const friendsList = await instanceAPI.get('friend', {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			})
			setUserFriends(friendsList.data);
		}
	}

	const getUserBlocked = async () => {
		if (userData?.token) {
			const blockedList = await instanceAPI.get('block', {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			})
			setUserBlocked(blockedList.data);
		}
	}

	useEffect(() => {
		getUserFriends();
		getUserBlocked();
	}, [userData])

	const deleteFriendById = async (friendId : string) => {
		if (userData?.token) {
			const friendsList = await instanceAPI.delete('/friend/' + friendId, {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			})
			getUserFriends();
		}
	}

	const addFriend = async (login : string ) => {
		const newFriendId = await instanceAPI.get('myUser/idByLogin', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
				"userLogin": login
			}
		})

		const ret = await instanceAPI.post('friend', {
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
					"new-friend": `${newFriendId.data}`
				}
		})
		getUserFriends();
	}

	const deleteBlockById = async (blockId : string) => {
		if (userData?.token) {
			const blockList = await instanceAPI.delete('block/' + blockId, {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			})
			getUserBlocked();
		}
	}

	const blockUser = async (login : string ) => {
		const newBlockId = await instanceAPI.get('myUser/idByLogin', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
				"userLogin": login
			}
		})

		const ret = await instanceAPI.post('block', {
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
					"new-block": `${newBlockId.data}`
				}
		})
		getUserBlocked();
	}


	const handleChangeFriend = async (e : ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target

		setNewFriend({...newFriend, [e.target.name]: e.target.value})
	}

	const handleChangeBlock = async (e : ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target

		setNewBlock({...newBlock, [e.target.name]: e.target.value})
	}

	return (
			<>
				<FormDiv>
				<LabelButton>Add a friend : </LabelButton>
				<InputLogin type="text" name="login" placeholder="login" value={newFriend.login}
					onChange={handleChangeFriend}/>
				<AddButton type="submit" onClick={() => addFriend(newFriend.login)}>OK</AddButton>
				</FormDiv>

				<FormDiv>
				<LabelButton>Block a user : </LabelButton>
				<InputLogin type="text" name="login" placeholder="login" value={newBlock.login}
					onChange={handleChangeBlock}/>
				<AddButton type="submit" onClick={() => blockUser(newBlock.login)}>OK</AddButton>
				</FormDiv>

				<ListLabelDiv> Friends List : </ListLabelDiv>
				<FriendTable><tbody>
					{userFriends  && userFriends.length > 0?
					(
						userFriends.map((friend, index) => {
							return (
								<FriendLine key={index}>
									<FriendScore>
										{"Victory " + friend.victories.toString() + " - " + friend.loses.toString() + " Defeat"}
									</FriendScore>
									<FriendLogin>
										{friend.login}
									</FriendLogin>
									<FriendImage>
										<div style={{height:"70px", display:"flex", alignItems:"center"}}>
											<img style={{maxHeight:"80%"}}
												src={friend.avatar ? `data:image/jpeg;base64,${friend.avatar}` : undefined} alt="friendAvatar"/>
										</div>
									</FriendImage>
								<RedCrossDiv>
									<RedCrossImg onClick={() => deleteFriendById(friend.id.toString())} src={RedCrossIcon}/>
								</RedCrossDiv>
							</FriendLine>
							)
						})
						) : (
							<NoFriendLine><NoFriendCase>
								NO FRIEND
							</NoFriendCase></NoFriendLine>
					)}
				</tbody></FriendTable>
				<ListLabelDiv> Users Blocked List : </ListLabelDiv>
				<FriendTable><tbody>
					{userBlocked && userBlocked.length > 0?
					(
						userBlocked.map((block, index) => {
							return (
								<FriendLine key={index}>
									<FriendLogin>
										{block.login}
									</FriendLogin>
									<FriendImage>
										<div style={{height:"70px", display:"flex", alignItems:"center"}}>
											<img style={{maxHeight:"80%"}}
												src={block.avatar ? `data:image/jpeg;base64,${block.avatar}` : undefined} alt="friendAvatar"/>
										</div>
									</FriendImage>
								<RedCrossDiv>
									<RedCrossImg onClick={() => deleteBlockById(block.id.toString())} src={RedCrossIcon}/>
								</RedCrossDiv>
							</FriendLine>
							)
						})
						) : (
							<NoFriendLine><NoFriendCase>
								NO USER BLOCKED
							</NoFriendCase></NoFriendLine>
					)}
				</tbody></FriendTable>
			</>
	)
}

export default FriendsMenu
