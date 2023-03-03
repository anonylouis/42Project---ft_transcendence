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
import QrCodeTwoFaAuth from "../components/auth/QrCodeTwoFaAuth";
import { User } from "../interfaces/interfaceMain";
import { useParams } from "react-router-dom";
import { instanceAPI } from "../datas/instanceAPI";

const GlobalProfileDiv = styled.div`
	display: flex;
	justify-content: center;
	border:1px white solid;
	background: rgba(0, 0, 0, 0.9);
	width: fit-content;
	margin: auto;
`

function TwoFaAuth() {
	const { userData, setUserData } = useContext(UserContext);

	if ((userData?.token && userData?.AuthValidated == false)) {
		return (
			<>
				<Navbar/>
				<GlobalProfileDiv>
							<QrCodeTwoFaAuth />
				</GlobalProfileDiv>
			</>
		)
	} else {
		return (<Navbar/>)
	}
}

export default TwoFaAuth
