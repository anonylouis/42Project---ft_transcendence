import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../main'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useMediaQuery } from 'usehooks-ts'
import Logout from '../components/auth/Logout';

const Header = styled.header`
	margin: 10px;
	padding: 20px;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	border-radius: 15px;
`

const LeftDiv = styled.div`
`

const RightDivPC = styled.div`
	flex: 4;
	display: flex;
	align-items: center;
	justify-content: right;
	text-align: right;
`

const RightDivMobile = styled.div`
	flex: 4;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: right;
	text-align: right;
`

const HomeOrange = styled.p`
	color: #f54000;
	font-size: 30px;
	text-decoration: underline rgba(240, 160, 160, 0.863);
	text-decoration-thickness: 2px;
	text-underline-offset: 3px;
	border: solid #f54000;
	width: fit-content;
	border-width: 0px 0px 4px 0px;
	font-size:2em;
`

const HomeWhite = styled.p`
	color: white;
	font-size: 30px;
`
const NavButton = styled.button`
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

function Navbar() {
	const mobileView = useMediaQuery('(max-width: 950px)');
	let path = "/";
	const { userData, setUserData } = useContext(UserContext);

	if (userData?.user) {
		path = "/user/"+userData.user.id;
	}

	return (<Header>
				<LeftDiv>
					<Link to="/">
						<HomeOrange>Tiger-Pong.io</HomeOrange>
					</Link>
				</LeftDiv>
				{mobileView ?
					<RightDivMobile>
						<div style={{flexBasis: "100%"}}>
							<Link to="/game">
								<NavButton>Game</NavButton>
							</Link>
						</div>
						<div>
							<Link to="/myProfile">
								<NavButton>Profile</NavButton>
							</Link>
							<Link to="/">
								<Logout />
							</Link>
						</div>
					</RightDivMobile>
					:
					<RightDivPC>
						<Link to="/game">
							<NavButton>Game</NavButton>
						</Link>
						<Link to="/myProfile">
							<NavButton>Profile</NavButton>
						</Link>
						<Link to="/">
							<Logout />
						</Link>
					</RightDivPC>
				}
			</Header>
	)
}

export default Navbar;
