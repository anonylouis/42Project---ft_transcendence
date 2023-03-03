import React, { useState } from 'react'
import styled from 'styled-components'
import editImage from '../../assets/edit.png'
import { User } from '../../interfaces/interfaceMain'
import EditProfile from '../EditProfile'

const Content = styled.div`
	color: green;
`

const WhiteSpan = styled.span`
	color: white;
`

const OrangeSpan = styled.span`
	color: #f54000;
`

const EditImage = styled.img`
	background-color: black;
	width: 10%;
	cursor: pointer;
`

const EditDiv = styled.div`
	display: flex;
	align-items: center;
`
const EditText = styled.p`
	padding-left: 20px;
	color: white;
`
const PopUpVisible = styled.span`
	position: fixed;
	background-color: rgba(0, 0, 0, 0.87);
	top: 17%;
	right: 20%;
	width: 40%;
	padding: 2%;
	border: solid rgba(240, 160, 160, 0.863) ;
	border-radius: 15px;
`

const PopUpHidden = styled.span`
	position: fixed;
	background-color: rgba(0, 0, 0, 0.87);
	top: 17%;
	right: 20%;
	width: 40%;
	padding: 2%;
	border: solid rgba(240, 160, 160, 0.863) ;
	border-radius: 15px;
	visibility: hidden;
`


function UserInfos({ user, editable } : { user : User | undefined, editable: boolean }) {

	const [EditOpen, setEditOpen] = useState<boolean>(false);

	function open_edit() {
		if (!EditOpen)
			setEditOpen(true);
	}

	return (
		<Content>
			<span>
				{editable ? (
					<EditDiv>
						<EditImage src={editImage} alt="edit" onClick={() => open_edit()}/>
						<EditText>Edit Profile</EditText>
						{ EditOpen ? (
							<PopUpVisible>
								<EditProfile close={setEditOpen}></EditProfile>
							</PopUpVisible>
						) : (
							<PopUpHidden>
								<EditProfile close={setEditOpen}></EditProfile>
							</PopUpHidden>
						) }
					</EditDiv>
				) : (
					null
				)}
				<br/><br/>
				<OrangeSpan>Login: </OrangeSpan>
				<WhiteSpan>{user?.login}</WhiteSpan>
				<br/><br/>
				<OrangeSpan>Victories: </OrangeSpan>
				<WhiteSpan>{user?.victories}</WhiteSpan>
				&emsp;-&emsp;
				<OrangeSpan>Loses: </OrangeSpan>
				<WhiteSpan>{user?.loses}</WhiteSpan>
				<br/><br/>
				<OrangeSpan>email: </OrangeSpan>
				<WhiteSpan>{user?.email}</WhiteSpan>
				<br/><br/>
				<OrangeSpan>Register Date: </OrangeSpan>
				<WhiteSpan>{user?.createdAt ? new Date(user?.createdAt).toDateString() : ""}</WhiteSpan>
				<br/><br/>
				<div style={{"display":"flex","gap":"2%"}}>
				<OrangeSpan>Info: </OrangeSpan>
				<WhiteSpan>{user?.info}</WhiteSpan>
				</div>
			</span>
		</Content>
	)
}

export default UserInfos
