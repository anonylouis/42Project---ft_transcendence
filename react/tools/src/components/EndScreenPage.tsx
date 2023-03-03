import styled from 'styled-components'
import { EndScreenInfoFront } from '../interfaces/interfaceGame'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../main'
import { instanceAPI } from '../datas/instanceAPI'
import { Buffer } from 'buffer'
import { Socket } from 'socket.io-client'

const Container = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`

const Winner = styled.div`
	flex : 1;
	margin : 2%;
	border-radius : 10px;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
const WinnerNumber = styled.div`
	color : red;
	font-size: x-large;
	margin-top : 6%;
	font-weight: bold;
	-webkit-text-stroke: black 0.5px;
`

const WinnerName = styled.div`
	color : white;
	text-transform : capitalize;
	font-size: x-large;
	margin-bottom: 5%;
`

const WinnerImage = styled.div`
	margin-top : 6%;
	width : 60%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Loser = styled.div`
	height: 70%;
	width: 40%;
	flex : 1;
	margin : 2%;
	border-radius : 10px;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const LoserTilte = styled.div`
	color : red;
	font-size: x-large;
	margin-top : 6%;
	font-weight: bold;
	-webkit-text-stroke: black 0.5px;
`
const LoserImage = styled.div`
	margin-top : 6%;
	width : 42%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
`
const LoserName = styled.div`
	color : white;
	text-transform : capitalize;
	font-size: x-large;
	margin-bottom: 5%;
`

const LoserScore = styled.div`
	font-weight: bold;
	font-style: italic;
	color: #C0C0C0;
	font-family: system-ui;
	font-size: 2.4em;
	margin-bottom : 4%;
`
const WinnerScore = styled.div`
	font-weight: bold;
	font-style: italic;
	color: #D1B000;
	font-family: system-ui;
	font-size: 2.4em;
	margin-bottom : 4%;
`
const Comment = styled.div`
	color : #C0C0C0;
	margin-top: 1%;
`
const Reset = styled.button`
	padding-top : 0.5%;
	padding-bottom : 0.5%;
	padding-right: 2%;
	padding-left: 2%;
	color : red;
	text-transform : capitalize;
	font-size: x-large;
	background: rgba(0, 0, 0, 0.9);
	border-radius: 25px 10px 25px 10px;
	cursor: pointer;
`


function EndScreenPage({ player1, player2, score1, score2, socket}: EndScreenInfoFront) {
	const { userData, setUserData } = useContext(UserContext);

	const [ ImagePlayer1, setImagePlayer1 ] = useState<string | null>(null);
	const [ ImagePlayer2, setImagePlayer2 ] = useState<string | null>(null);

	const [ LoginPlayer1, setLoginPlayer1 ] = useState<string | null>(null);
	const [ LoginPlayer2, setLoginPlayer2 ] = useState<string | null>(null);

	if (score1 < score2) {
		[player1, player2] = [player2, player1];
		[score1, score2] = [score2, score1];
	}

	useEffect(() => {
		const getAvatar = async(id : string, updateImage : React.Dispatch<React.SetStateAction<string | null>>) => {
			if (userData?.token) {
				const avatar = await instanceAPI.get('myUser/avatarById', {
					headers: {
						Authorization: `Bearer ${userData.token}`,
						'id': `${id}`
					}, 
					responseType: "arraybuffer"
				})
				if (avatar?.data) {
					updateImage(Buffer.from(avatar.data, 'binary').toString('base64'));
				}
			}
		}
		getAvatar(player1, setImagePlayer1);
		getAvatar(player2, setImagePlayer2);
	}, [userData, player1, player2]);

	useEffect(() => {
		const getLogin = async(id : string, updateLogin : React.Dispatch<React.SetStateAction<string | null>>) => {
				const login = await instanceAPI.get('myUser/loginById', {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
							'id': `${id}`
						}
				});
				if (login?.data) {
					updateLogin(login.data);
				}
		}
		if (player1)
			getLogin(player1, setLoginPlayer1);
		if (player2)
			getLogin(player2, setLoginPlayer2);
	}, [userData, player1, player2]);

	function reset_game()
	{
		socket.emit('resetBack');
	}

	return (
		<div>
			<Reset onClick={() => reset_game()}> back </Reset>
			<Container>
				<Winner>
					<WinnerNumber> 🥳🥳 &emsp;!! WINNER !!&emsp; 🥳🥳 </WinnerNumber>
					<Comment>trop bg ce correcteur &lt;3 &lt;3</Comment>
					<WinnerImage>
						<img style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "20px" }} src={ImagePlayer1 ? `data:image/jpeg;base64,${ImagePlayer1}` : undefined} alt="player1" />
					</WinnerImage>
					<WinnerScore>{score1}</WinnerScore>
					<WinnerName>{LoginPlayer1 ? LoginPlayer1 : "Player"}</WinnerName>
				</Winner>
				<Loser>
					<LoserTilte> 👎 &ensp; LOSER &ensp; 👎 </LoserTilte>
					<Comment>boouuuuuhhh retourne travailler</Comment>
					<LoserImage>
						<img style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "20px" }} src={ImagePlayer2 ? `data:image/jpeg;base64,${ImagePlayer2}` : undefined} alt="player2" />
					</LoserImage>
					<LoserScore>{score2}</LoserScore>
					<LoserName>{LoginPlayer2 ? LoginPlayer2 : "Player"}</LoserName>
				</Loser>
			</Container>
		</div>
	)
}

export default EndScreenPage
