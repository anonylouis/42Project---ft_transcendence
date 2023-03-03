import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { instanceAPI } from '../datas/instanceAPI'
import { UserContext } from '../main'
import Loading from './Loading'
import { Buffer } from 'buffer'

const Container = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`

const Player = styled.div`
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

const PlayerNumber = styled.div`
	color : red;
	font-size: x-large;
	margin-top : 6%;
	font-weight: bold;
	-webkit-text-stroke: black 0.5px;
`

const PlayerName = styled.div`
	
	color : white;
	text-transform : capitalize;
	font-size: larger;
	margin-bottom: 5%;
`

const PlayerImage = styled.div`
	margin-top : 6%;
	margin-bottom : 9%;
	width : 60%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
`
const Versus = styled.div`
	
	color : red;
	text-transform : capitalize;
	font-size: 2.7vw;
	text-shadow:0 3.5px 1px rgba(240, 160, 160, 0.863), 0 -4px 0.5px #FFFFFF, 0 -10px 4px #FEF70D;
`

interface matchmaking_props {
	player1 : string | null;
	player2 : string | null;
}

function Matchmaking({player1 , player2} : matchmaking_props) {
	const { userData, setUserData } = useContext(UserContext);
	
	const [ ImagePlayer1, setImagePlayer1 ] = useState<string | null>(null);
	const [ ImagePlayer2, setImagePlayer2 ] = useState<string | null>(null);

	const [ LoginPlayer1, setLoginPlayer1 ] = useState<string | null>(null);
	const [ LoginPlayer2, setLoginPlayer2 ] = useState<string | null>(null);


	useEffect(() => {
		const getAvatar = async(id : string, updateImage : React.Dispatch<React.SetStateAction<string | null>>) => {
				const avatar = await instanceAPI.get('myUser/avatarById', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
						'id': `${id}`
					}, 
					responseType: "arraybuffer"
				})
				if (avatar?.data) {
					updateImage(Buffer.from(avatar.data, 'binary').toString('base64'));
				}
		}
		if (player1)
			getAvatar(player1, setImagePlayer1);
		if (player2)
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

	return (
	<Container>
		<Player>
			<PlayerNumber>Challenger 1</PlayerNumber>
			<PlayerImage>
				{player1 == null ?
					<Loading></Loading>
					:
					<img style={{maxWidth:"100%", maxHeight:"100%", borderRadius: "20px"}} src={ImagePlayer1 ? `data:image/jpeg;base64,${ImagePlayer1}` : undefined} alt="player1"/>
				}
			</PlayerImage>
			<PlayerName>{(player1 == null) ? "searching...." : LoginPlayer1}</PlayerName>
		</Player>
		<Versus>̲V̲̲s̲</Versus>
		<Player>
			<PlayerNumber>Challenger 2</PlayerNumber>
			<PlayerImage>
				{player2 == null ?
					<Loading></Loading>
					:
					<img style={{maxWidth:"100%", maxHeight:"100%", borderRadius: "20px"}} src={ImagePlayer2 ? `data:image/jpeg;base64,${ImagePlayer2}` : undefined} alt="player2"/>
				}
			</PlayerImage>
			<PlayerName>{(player2 == null) ? "searching...." : LoginPlayer2}</PlayerName>
		</Player>
	</Container>
	)
}

export default Matchmaking
