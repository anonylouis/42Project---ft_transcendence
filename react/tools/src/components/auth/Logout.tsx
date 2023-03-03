import React, { useContext } from 'react'
import { UserContext } from '../../main'
import styled from 'styled-components';

const Button = styled.button`
	margin: 15px;
	height: 55px;
	width: 125px;
	border:3px rgba(240, 160, 160, 0.863) solid;
	border-radius: 5px;
	background-color: black;
	color: white;
	&:hover {
		border:3px #f54000 solid;
		color: #f54000;
	}
	cursor: pointer;
	font-size: larger;
`

function Logout () {
	const {userData, setUserData} = useContext(UserContext);

	const logOut = () => {
		if (setUserData) {
			setUserData({
				token: undefined,
				user: undefined,
				avatar: undefined
			})
			localStorage.setItem("sessionID", "")
			localStorage.setItem("auth-token", "")
		}
	}

	return (<Button onClick={logOut}>Log out</Button>)
}

export default Logout
