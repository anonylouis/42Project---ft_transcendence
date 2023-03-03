import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import ReactDOM from 'react-dom/client'
import { Buffer } from 'buffer'
import { instanceAPI } from './datas/instanceAPI';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

import Home from './pages/Home'
import Game from './pages/Game'
import Profile from './pages/Profile';
import TwoFaAuth from './pages/TwoFaAuth';
import Error from './pages/Error'

import AcceptLogin42 from './components/auth/AcceptLogin42'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Chat from './components/chat/Chat'
import EditProfile from './components/EditProfile'
import socket from './components/chat/socket'

import { LogInfo, protectedRoute_props, UserDataType } from './interfaces/interfaceMain';

export const UserContext = createContext<UserDataType>({userData: null, setUserData:null});

const root = ReactDOM.createRoot(document.getElementById('root')!)

const ProtectedRoute = ({ redirectPath = '/', children} : protectedRoute_props) => {
	const token = localStorage.getItem("auth-token");
	if (token == "" || token == null) {
		return <Navigate to={redirectPath}/>;
	}

	return children;
};

export default function App() {
	const [userData, setUserData] = useState<LogInfo>({
		token: undefined,
		user: undefined,
		avatar: undefined,
		AuthValidated: false,
	})

	useEffect(() => {
		const isLoggedIn = async () => {
			let token : string | null | undefined = localStorage.getItem("auth-token")
			if (token == null) {
				localStorage.setItem("auth-token", "");
				token = undefined;
			}

			if (token && token !== undefined) {
				try {
					const userResponse = await instanceAPI.get('myUser/user', {
						headers: { Authorization: `Bearer ${token}` }
					});
					const avatar = await instanceAPI.get('myUser/myAvatar', {
						headers: { Authorization: `Bearer ${token}` },
						responseType: "arraybuffer"
					});
					if (userResponse && avatar) {
						const buff = Buffer.from(avatar.data, 'binary');
						const base64 = buff.toString('base64');

						setUserData({
							token: token,
							user: userResponse.data,
							avatar: base64,
							AuthValidated: true
						});
					} else {
						localStorage.setItem("auth-token", "");
						setUserData({
							token: undefined,
							user: undefined,
							avatar: undefined,
							AuthValidated: false
						});
					}
				}
				catch(e) {
					localStorage.setItem("auth-token", "");
					setUserData({
						token: undefined,
						user: undefined,
						avatar: undefined,
						AuthValidated: false
					});
				}
			}
		}
		isLoggedIn()
	}, [])

	return (
		<UserContext.Provider value={{userData, setUserData}}>
			<Router>
				<Routes>
					<Route path="/" element={<Home />}/>
					<Route path="/myProfile" element={<ProtectedRoute children={<Profile editable={true}/>}/>}/>
					<Route path="/profile/:id" element={<ProtectedRoute children={<Profile editable={false}/>}/>}/>
					<Route path="/game" element={<ProtectedRoute children={<Game/>}/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/acceptLogin42/:id" element={<AcceptLogin42/>}/>
					<Route path="/twoFaAuth" element={<TwoFaAuth/>}/>
					<Route path="*" element={<Error />}/>
				</Routes>
			</Router>
		</UserContext.Provider>
	)
}

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
