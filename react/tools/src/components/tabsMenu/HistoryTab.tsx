import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../main'
import styled from 'styled-components'
import { instanceAPI } from '../../datas/instanceAPI';
import { History } from '../../interfaces/interfaceHistory';

const HistoryTable = styled.table`
	border-spacing: 0px 2px;
	width:100%;
	color: white;
	padding-right: 1%;
`
const HistoryLine = styled.tr`
	width:100%;
	text-align:center;
	vertical-align: middle;
`

const DefeatLine = styled(HistoryLine)`
	background-color: rgba(207, 94, 99, 0.4);
`

const VictoryLine = styled(HistoryLine)`
	background-color: rgba(106, 187, 164, 0.4);
`

const HistoryResult = styled.td`
	width:40%;
	margin: 10px 5px;
	color: rgb(234, 238, 178);
`
const HistoryScore = styled.td`
	width:20%;
	margin: 10px 5px;
`
const HistoryEnemy = styled.td`
	width:30%;
	margin: 10px 5px;
	vertical-align: middle;
	margin-top: auto;
	text-align: -webkit-match-parent;
`
const HistoryEnemyImage = styled.td`
	width:10%;
	margin: 10px 5px;
	vertical-align: middle;
	margin-top: auto;
	text-align: left;
`


function HistoryTab({id} : {id : string | undefined }) {
	const { userData, setUserData } = useContext(UserContext)
	const [ userHistory, setUserHistory ] = useState<History[] | null>(null)

	useEffect(() => {
		const getUserHistory = async() => {
			if (userData?.token && id) {
				const profile = await instanceAPI.get('history', {
					headers: {"id": `${id}` , "Authorization": `Bearer ${userData.token}`}
				})
				if (profile?.data)
					setUserHistory(profile.data);
			}
		}
	getUserHistory();
	}, [userData, id])

	return (
		<HistoryTable><tbody>
			{userHistory != null && userHistory.length > 0?
			(
				userHistory.map((user, index) => {
					if ((user.userScore > user.enemyScore))
						return (
							<VictoryLine key={index}>
								<HistoryResult>
									VICTORY
								</HistoryResult>
								<HistoryScore>
									{user.userScore.toString() + " - " + user.enemyScore.toString() }
								</HistoryScore>
								<HistoryEnemy>
									{user.enemyLogin}
								</HistoryEnemy>
								<HistoryEnemyImage>
									<div style={{height:"70px", display:"flex", alignItems:"center"}}>
										<img style={{maxHeight:"80%"}}
											src={user.enemyAvatar ? `data:image/jpeg;base64,${user.enemyAvatar}` : undefined} alt="enemyAvatar"/>
									</div>
								</HistoryEnemyImage>
							</VictoryLine>
						)
					else
						return (
							<DefeatLine key={index}>
								<HistoryResult>
									DEFEAT
								</HistoryResult>
								<HistoryScore>
									{user.userScore.toString() + " - " + user.enemyScore.toString() }
								</HistoryScore>
								<HistoryEnemy>
									{user.enemyLogin}
								</HistoryEnemy>
								<HistoryEnemyImage>
									<div style={{height:"70px", display:"flex", alignItems:"center"}}>
										<img style={{maxHeight:"80%"}}
										src={user.enemyAvatar ? `data:image/jpeg;base64,${user.enemyAvatar}` : undefined} alt="enemyAvatar"/>
									</div>
								</HistoryEnemyImage>
								
							</DefeatLine>
						)
				})
			) : (
				<HistoryLine><HistoryResult>
					NO HISTORY
				</HistoryResult></HistoryLine>
			)
		}
		</tbody></HistoryTable>
	)
}

export default HistoryTab
