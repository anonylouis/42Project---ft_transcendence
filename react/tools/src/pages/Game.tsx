import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../main'
import Navbar from '../components/Navbar';
import Options from '../components/Options';
import Canvas from '../components/Canvas';
import Matchmaking from '../components/Matchmaking';
import '../styles/Game.css';
import styled from 'styled-components';
import MatchList from '../components/MatchList';
import { EndScreenInfoBack, InitData, userRoom } from '../interfaces/interfaceGame';
import EndScreenPage from '../components/EndScreenPage'
import { useMediaQuery } from 'usehooks-ts'
import socket from '../components/chat/socket';
import { modeObj, optObj } from '../datas/gameModesOptions';
import { Navigate } from 'react-router-dom';
import { UserDataType } from '../interfaces/interfaceMain';
import swal from 'sweetalert';

const MatchmakingContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
`

const StartExit = styled.button`
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

//get size screen
function getWidth() {
	const {innerWidth: width} = window;
	return {width};
}

function useWidth() {
	const [Width, setWidth] = useState(getWidth());
	useEffect(() => {
		function handleResize() {
			setWidth(getWidth());
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	return Width;
}

// rato between ScreenSize and CanvasSize
const p:number = 0.55

function Game() {
	const {userData, setUserData} : UserDataType = useContext(UserContext);

	if (socket.id == undefined || socket.connected  == false)
		return(<Navigate to={"/myProfile"} replace/>)
	if (userData == null || userData.user == undefined)
		return(<Navigate to={"/"} replace/>)

	const {width} = useWidth();
	const mobileView = useMediaQuery('(max-width: 950px)');

	let PongClass, GameDivClass;
	if (mobileView) {
		PongClass = "pongCanvasMobile";
		GameDivClass = "fullGameDivMobile";
	} else {
		PongClass = "pongCanvasPC";
		GameDivClass = "fullGameDivPC";
	}

	const canvasSize = {width:Math.round(Number(width) * p), height:Math.round(Number(width ) * p * 2/3), socket:socket, userId:userData.user.id};
	
	// true if the player is in a room
	const [inRoom, setInRoom] = useState(false);

	// true if the game started
	const [gameStarted, setGameStarted] = useState(false);

	// players room (no players = null)
	const [player1, setPlayer1] = useState<string | null>(null);
	const [player2, setPlayer2] = useState<string | null>(null);

	// if is set, print the endScreen !
	const [endScreen, setEndScreen] = useState<EndScreenInfoBack | null>(null);

	//Modes
	const [mode, changeMode] = useState<string>(modeObj[0]);

	//Options
	const [options, changeOptions] = useState<Map<string, boolean>>(optObj);
	function updateOptions(opt : string) {
		changeOptions(new Map(options.set(opt, !options.get(opt))));
	};

	//initial loading page event -- reload event
	useEffect(() => {
		socket.emit('loadGamePage', userData?.user?.id);
	}, []);

	// Rerender Matchmaking page
	socket.on("inRoom", (players : Array<string | null>) => {
		if (!inRoom) {
			setInRoom(true);
		}
		if (player1 !== players[0])
			setPlayer1(players[0]);
		if (player2 !== players[1])
			setPlayer2(players[1]);
	});
	socket.on("notInRoom", () => {
		if (inRoom) {
			setInRoom(false);
		}
		if (player1 !== null) {
			setPlayer1(null);
		}
		if (player2 !== null) {
			setPlayer2(null);
		}
	});

	// Room
	function new_room() {
		socket.emit('newRoom', userData?.user?.id);
	}
	function leave_room() {
		socket.emit('leaveRoom', userData?.user?.id);
	}
	socket.on("updateRoomFront", (roomName : string) => {
		if (userData.user) {
			let props : userRoom = {userId:userData.user.id, roomName:roomName};
			if (props.userId != undefined)
				socket.emit('updateRoomBack', props);
		}
	});

	// Game
	socket.on("startGame", () => {
		setGameStarted(true);
		socket.off('startGame')
	});
	function notReady() {
		swal({title: "2 players needed", icon: "info"});;
	}
	function ready() {
		socket.emit('initGame', {userId:userData?.user?.id, mode:mode, optionsJSON: JSON.stringify(Array.from(options))});
	}
	socket.on("gameFinished", (info : EndScreenInfoBack) => {
		setEndScreen(info);
		socket.off('gameFinished')
	});
	socket.on("resetFront", () => {
		if(endScreen !== null)
			setEndScreen(null);
		if(gameStarted !== false)
			setGameStarted(false);
		socket.emit('loadGamePage', userData?.user?.id);
	});

	return (
		<div>
			<Navbar />
			<div className="Rules">
				<h2>RULES</h2>
				Use your mouse to move your pad and return the ball! <br/>
				The first to score 5 points wins the match! <br/> <br/>
				Select your game mode and add some options to it to increase the fun!
			</div>
			<div className={GameDivClass}>
				<Options mobileView={mobileView} mode={mode} changeMode={changeMode} options={options} updateOptions={updateOptions}/>
				{
					(endScreen !== null) ? (
						<MatchmakingContainer>
							<EndScreenPage player1={endScreen.player1} player2={endScreen.player2} score1={endScreen.score1} score2={endScreen.score2} socket={socket}></EndScreenPage>
						</MatchmakingContainer>
					) : (
						gameStarted ? (
								<Canvas className={PongClass} {...canvasSize}/>
							) : (
								!inRoom ? (
									<MatchmakingContainer>
										<MatchList socket={socket} userId={userData?.user?.id}></MatchList>
										<StartExit onClick={() => new_room()}>Create Game !</StartExit>
									</MatchmakingContainer>
									) : (
										<MatchmakingContainer>
											<Matchmaking player1={player1} player2={player2}></Matchmaking>
											<div style={{display:"flex", width: "100%"}}>
												<div style={{flex:"1", textAlign:"center"}}><StartExit onClick={() => leave_room()}>Exit</StartExit></div>
												{
													player1 == userData.user.id ? (
													<div style={{flex:"1", textAlign:"center"}}><StartExit onClick={() => {{player2 === null ? notReady() : ready()}}}>Play !</StartExit></div>
													) : (
														<></>
													)
												}
											</div>
										</MatchmakingContainer>
									)
						)
					)
				}
			</div>
		</div>
	)
}

export default Game
