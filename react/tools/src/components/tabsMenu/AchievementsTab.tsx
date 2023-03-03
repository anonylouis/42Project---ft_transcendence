import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../main'
import { instanceAPI } from '../../datas/instanceAPI';
import styled from 'styled-components'
import TrophyIcon from '../../assets/trophy-64.png';
import { Medal } from '../../interfaces/interfaceAchievements';

const AchievementsTable = styled.table`
	border-spacing: 0px 2px;
	width:100%;
	color: white;
	padding-right: 1%;
`
const AchievementsLine = styled.tr`
	width:100%;
	text-align:center;
	vertical-align: middle;
`

const AchievementsMedalLine = styled(AchievementsLine)`
	background-color: rgba(106, 187, 164, 0.4);
`

const NoAchievementsCase = styled.td`
	width:40%;
	color: rgb(234, 238, 178);
`

const AchievementsDescription = styled.td`
	width:30%;
	vertical-align: middle;
	margin-top: auto;
	text-align: center;
`
const TrophyImage = styled.td`
	width:10%;
`

const MedalTitle = styled.div`
	font-size : larger;
	color: rgb(234, 238, 178);
`
const MedalDescription = styled.div`
	font-size : initial;
`


function AchievementsTab({id} : {id : string | undefined }) {
	const { userData, setUserData } = useContext(UserContext);
	const [ userAchievements, setUserAchievements ] = useState<Array<Medal>>([]);

	useEffect(() => {
		const getUserAchievements = async() => {
			if (userData?.token && id) {
				const profile = await instanceAPI.get('medal/' + id, {
					headers: {"Authorization": `Bearer ${userData.token}` }
				})
				if (profile?.data)
					setUserAchievements(profile.data);
			}
		}
		getUserAchievements();
	}, [userData, id]);

	return (
		<AchievementsTable><tbody>
			{userAchievements.length > 0?
			(
				userAchievements.map((user, index) => {
					return (
						<AchievementsMedalLine key={index}>
							<TrophyImage>
								<div style={{float:"left", height:"70px"}}>
									<img style={{maxWidth:"100%", maxHeight:"100%", display:"block"}} src={TrophyIcon} alt="trophy"/>					
								</div>
							</TrophyImage>
							<AchievementsDescription>
								<div>
									<MedalTitle>{user.title}</MedalTitle>
									<MedalDescription>{user.description}</MedalDescription>
								</div>
							</AchievementsDescription>
							<TrophyImage>
								<div style={{float:"right", height:"70px", display:"flex", alignItems:"center"}}>
									<img style={{maxWidth:"100%", height:"100%", display:"block"}} src={TrophyIcon} alt="trophy"/>					
								</div>
							</TrophyImage>
						</AchievementsMedalLine>
					)
				})
			) : (
				<AchievementsLine><NoAchievementsCase>
					NO ACHIEVEMENTS UNLOCKED
				</NoAchievementsCase></AchievementsLine>
			)
		}
		</tbody></AchievementsTable>
	)
}

export default AchievementsTab;
