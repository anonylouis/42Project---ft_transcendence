import { useEffect, useContext, useState } from "react"
import { UserContext } from '../main';
import styled from 'styled-components'
import Navbar from '../components/Navbar';
import Chat from '../components/chat/Chat';
import UserInfos from '../components/tabsMenu/UserInfos';
import FriendsTab from '../components/tabsMenu/FriendsTab';
import AchievementsTab from '../components/tabsMenu/AchievementsTab';
import HistoryTab from '../components/tabsMenu/HistoryTab';
import StatsTab from '../components/tabsMenu/StatsTab';
import ProfilePhoto from "../components/tabsMenu/ProfilePicture";
import { User } from "../interfaces/interfaceMain";
import { useParams } from "react-router-dom";
import { instanceAPI } from "../datas/instanceAPI";

const GlobalProfileDiv = styled.div`
	display: flex;
	justify-content: center;
`

const FullProfileDiv = styled.div`
	border:1px white solid;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.9);
	width: 1000px;
`

const InfosDiv = styled.div`
	display: flex;
	padding: 20px;
	align-items: center;
	width: 1000px;
`

const ContTabButtonDiv = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: center;
`

const TabDiv = styled.div`
	color: white;
	width: 25%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	border: 2px white solid;
	&:hover {
		border: 2px #f54000 solid;
	}
`

const ProfileTabDiv = styled.div`
	flex-wrap: nowrap;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70%;
	height: 400px;
	display: block;
	margin-top: 10px;
	margin-bottom: 10px;
`

const TabContent = styled.div`
	display: none;
	color: green;
	font-size: 30px;
	height: 100%;
	overflow: auto;
`

function Profile({editable} : { editable: boolean}) {
	const { userData, setUserData } = useContext(UserContext);
	const [ ChatOpen, setchatOpen ] = useState<boolean>(false);

	const [ userProfile, setUserProfile ] = useState<User | undefined>(undefined);

	let { id } = useParams();


	const choseTab = (tabName : string) => {
		var i;
		var tabDiv = document.getElementsByClassName("Tab");

		for(let div of tabDiv) {
			(div as HTMLElement).style.display = "none";
		}
		(document.getElementById(tabName) as HTMLElement).style.display = "block";
	}

	const getUser = async (id : string | undefined) => {
		if (userData?.token && id) {
			const user = await instanceAPI.get('myUser/profileById', {
				headers: {
					"userId": `${id}`,
					"Authorization": `Bearer ${userData.token}`
				}
			})
			if (user) {
				setUserProfile(user.data);
			}
		}
	}

	useEffect(() => {
		choseTab("Achievements");
		if (editable) {
			setUserProfile(userData?.user);
		}
		else {
			getUser(id)
		}
	}, [userData, editable, id]);

	return (
		<>
			<Navbar />
			<GlobalProfileDiv>
				<FullProfileDiv>
					<InfosDiv>
						<ProfilePhoto id={userProfile?.id}/>
						<UserInfos user={userProfile} editable={editable}/>
					</InfosDiv>
					<ContTabButtonDiv>
						<TabDiv onClick={() => choseTab("Achievements")}>Achievements</TabDiv>
						<TabDiv onClick={() => choseTab("History")}>History</TabDiv>
						{editable ?
						(
							<TabDiv onClick={() => choseTab("Friends")}>Friends</TabDiv>
						) : (
							null
						)}
					</ContTabButtonDiv>
					<ProfileTabDiv>
						<TabContent id="Achievements" className="Tab">
							<AchievementsTab id={userProfile?.id} />
						</TabContent>
						<TabContent id="History" className="Tab">
							<HistoryTab id={userProfile?.id}/>
						</TabContent>
						<TabContent id="Friends" className="Tab">
							<FriendsTab />
						</TabContent>
					</ProfileTabDiv>
				</FullProfileDiv>
			</GlobalProfileDiv>
			<Chat chatOpen={ChatOpen} setChatOpen={setchatOpen} />
		</>
	)
}

export default Profile
