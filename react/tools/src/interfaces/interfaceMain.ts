export interface User {
	avatar:string,
	createdAt: string,
	currentRoomId: number,
	currentRoomName: string,
	email: string,
	hash: string,
	id: string,
	info: string,
	isConnected:boolean,
	isTwoFaAuthEnabled: boolean,
	login: string,
	loses: number,
	sessionID: string,
	updateAt: Date,
	username: string,
	victories: number
};

export interface LogInfo {
	token : string | undefined,
	user : User | undefined,
	avatar: string | undefined,
	AuthValidated: boolean
}

export interface UserDataType {
	userData : LogInfo | null,
	setUserData : React.Dispatch<React.SetStateAction<LogInfo>> | null,
}

export interface protectedRoute_props {
	redirectPath ?: string,
	children: JSX.Element
}