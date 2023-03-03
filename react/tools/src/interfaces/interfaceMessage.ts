export interface Message {
	id: number,
	sender: string,
	receveir: string,
	message: string,
	isWhisp: boolean,
	roomId: number,
	roomName: string,
}
