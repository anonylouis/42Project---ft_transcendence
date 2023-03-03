import { Socket } from 'socket.io-client'
import { useState, useEffect } from 'react';
import styled from 'styled-components'
import { userRoom } from '../interfaces/interfaceGame';
import { instanceAPI } from '../datas/instanceAPI';

const Name = styled.td`
	color : white;
	margin : 4%;
	font-weight: bold;
	text-transform: none;
`

const MatchCases = styled.tr`
	color : white;
	text-transform : capitalize;
	font-size: larger;
	margin: 5%;
`

const Table = styled.table`
	border : 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.7);
	width: 80%;
	margin-bottom: 5%;
	border-spacing: 15px;
`
const Title = styled.th.attrs({colSpan: 3})`
	color : rgba(210, 0, 0, 0.9);
	text-transform : capitalize;
	font-size: 1.8em;
	padding : 10px 5px;
	text-align:center;
`

const JoinSpectate = styled.button`
	border : 2.5px red solid;
	border-radius: 7px;
	font-size: 0.8em;
	background: rgba(0, 0, 0, 0.7);
	color : white;
	font-weight: bold;
	padding : 3px 15px;
	cursor:pointer;
`

interface matchList_props {
	socket : Socket,
	userId: string
}

interface Match {
	name : string,
	nb : string,
	button : string,
}

function MatchList({socket, userId} : matchList_props) {
	const [matchArray, setMatchArray] =  useState<Array<Match>>([])

	function join(name : string) 
	{
		let props : userRoom = {userId:userId, roomName:name};
		socket.emit('joinRoom', props);
	}

	function spectate(name : string)
	{
		let props : userRoom = {userId:userId, roomName:name};
		socket.emit('spectateRoom', props);
	}
	
	socket.on("updateMatchList", (MatchArray : Array<Match>) => {
		setMatchArray(MatchArray);
	});

	useEffect(() => {
		socket.emit('loadMatchList');
	}, []);

	return (
		<Table>
			<thead>
				<tr>
					<Title>Matches</Title>
				</tr>
			</thead>
			<tbody>
			{
				matchArray.map(function(match) {
						return (<MatchCases key={match.name}>
									<Name>
										{(match.name.split("******"))[0] + " 's Game"}
									</Name>
									<td>
										{match.nb} / 2
									</td>
									<td>
										<JoinSpectate onClick={() => {{match.nb == "2" ?
											(spectate((match.name.split("******"))[1])
											) : (
												join((match.name.split("******"))[1])
											)}}}>
											{match.button}
										</JoinSpectate>
									</td>
								</MatchCases>);
				})
			}
			</tbody>
		</Table>
	)
}

export default MatchList
