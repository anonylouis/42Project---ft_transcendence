import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { UserContext } from '../main';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../styles/Home.css';
import Logout from '../components/auth/Logout';
import { UserDataType } from '../interfaces/interfaceMain';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Header = styled.header`
	display: flex;
	justify-content: flex-end;
`

const ButtonDiv = styled.div`
	display: flex;
	justify-content: center;
`


const GlobalDiv = styled.div`
	position: relative;
`

const BodyDiv = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`

const HomeDiv = styled.div`
	border:3px rgba(240, 160, 160, 0.863) solid;
	border-radius: 5px;
	background-color: rgba(0, 0, 0, 0.87);
	text-align: center;
	color: white;
	flex : 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 2%;
`

const FormDiv = styled.div`
	flex : 1;
	justify-content: center;
	display: flex;
	height: 400px;
`

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

function Home() {
	const {userData, setUserData} : UserDataType = useContext(UserContext);
	const [LogPage, setLogPage] = useState<boolean>(true);

	return (
		<GlobalDiv>
			<Header>
				{ userData?.token  && userData.AuthValidated ?
				(
					<ButtonDiv>
						<Link to="/myProfile">
							<Button>Profile</Button>
						</Link>
						<Link to="/">
							<Logout />
						</Link>
					</ButtonDiv>
				) : (
					<ButtonDiv>
						<Button onClick={() => setLogPage(true)} >Log in</Button>
						<Button onClick={() => setLogPage(false)}>Register</Button>
					</ButtonDiv>
				)}
			</Header>
			<BodyDiv>
				<HomeDiv>
					<p>Welcome On Tiger-Pong</p>
					<p>Made by :</p>
					<div style={{display:"flex"}}>
						<figure>
							<img src="https://cdn.intra.42.fr/users/97229b7e002660a43d0ea9b75e9f1ac4/melperri.jpg"
								alt="melperri" width="100px"/>
							<figcaption>Melvin Perrin</figcaption>
						</figure>
						<figure>
							<img src="https://cdn.intra.42.fr/users/02881adfb568247353812a551a37f606/rvalton.jpg"
								alt="rvalton" width="100px%"/>
							<figcaption>Remi Valton</figcaption>
						</figure>
						<figure>
							<img src="https://cdn.intra.42.fr/users/6415457ebd4d78c96ce62a8c71dec40f/lcalvie.jpg"
								alt="lcalvie" width="100px%"/>
							<figcaption>Louis Calvie</figcaption>
						</figure>
					</div>				
				</HomeDiv>
				<FormDiv>
					{(LogPage) ? (
							<Login/>
						) : (
							<Register/>
					)}
				</FormDiv>
			</BodyDiv>
		</GlobalDiv>
	)
}

export default Home
