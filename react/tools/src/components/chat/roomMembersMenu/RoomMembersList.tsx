import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../../main';
import styled from 'styled-components';
import swal from 'sweetalert';
import socket from '../socket';
import { instanceAPI } from '../../../datas/instanceAPI';
import UserMenu from './UserMenu';
import MemberIcon from '../../../assets/member-48.png';
import AdminIcon from '../../../assets/admin-48.png';
import OwnerIcon from '../../../assets/monarch-48.png';
import { Member } from '../../../interfaces/interfaceMember';
import { UserListDiv } from '../../../styles/Chat.styled';

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

function RoomMembersList(props) {
	const { userData, setUserData } = useContext(UserContext);
	const [ membersUserList, setMembersUserList ] = useState<Member[] | null>(null);
	const [ adminsList, setAdminsList ] = useState([{}]);
	const [ ownerId, setOwnerId ] = useState<string>("");
	const [ memberSelected, setMemberSelected ] = useState({});
	const [ isInUserMenu, setIsInUserMenu ] = useState(props.value);

	const getAdmins = async () => {
		if (userData?.token && userData?.user) {
			const admins = await instanceAPI.get('admin', {
				headers: {
					"roomId": `${userData.user.currentRoomId}`,
					"Authorization": `Bearer ${userData.token}`
				}
			});
			if (admins) {
				setAdminsList(admins.data);
			}
		}
	}

	const getOwners = async () => {
		if (userData?.token && userData?.user) {
			const room = await instanceAPI.get('room/id/'
												+ userData.user.currentRoomId, {
				headers: {
					"Authorization": `Bearer ${userData.token}`
				}
			});
			if (room) {
				setOwnerId(room.data.ownerId);
			}
		}
	}

	useEffect(() => {
		setIsInUserMenu(props.value);
	}, [props]);;

	useEffect(() => {
		if (userData?.user) {
			const room = {id: userData.user.currentRoomId,
						name: userData.user.currentRoomName};
			socket.emit('membersList', room);
		}
		socket.on('membersList', (members) => {
			if (members) {
				setMembersUserList(members);
				getAdmins();
				getOwners();
			}
		});
		return () => {
			socket.off('membersList');
		};
	}, []);

	const selectMember = async (member) => {
		if (userData?.token) {
			const profile = await instanceAPI.get('myUser/profileById', {
				headers: {
					"userId": `${member.userId}`,
					"Authorization": `Bearer ${userData.token}`
				}
			});


			if (profile?.data) {
				if (profile.data.id === userData.user.id) {
					swal({title: "Don't select yourself..", icon: "warning"});
				} else {
					setMemberSelected(profile.data);
					setIsInUserMenu(true);
				}
			}
		}
	}

	return (
		<>
			{isInUserMenu ?
			(
				<UserMenu props={memberSelected} />
			) : (
				membersUserList ?
				(
					membersUserList.map((member, index) => {
						if (member.userId === userData?.user?.id)
							return(null);
						else
							return (
								<UserListDiv key={"div"+index.toString()} onClick={() => selectMember(member)}>
									<AvatarImg src={member.avatar ? `data:image/jpeg;base64,${member.avatar}` : undefined}/>
									<h4>{member.login}</h4>
									{adminsList.map((admin, index2) => {
										return (
											<div key={"member"+index.toString()+"et"+index2.toString()} >
												{(admin.userId === member.userId) ?
												(
													<img src={AdminIcon} />
												) : (
													null
												)}
											</div>
									)})}
									{(ownerId === member.userId) ?
									(
										<img src={OwnerIcon}/>
									) : (
										null
									)}
								</UserListDiv>
							)
					})
				) : (
					null
				)
			)}
		</>
	)
}

export default RoomMembersList;
