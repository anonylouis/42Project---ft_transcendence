import { io } from "socket.io-client";

const URL = "https://" + import.meta.env.VITE_HOSTNAME + ":"
						+ 4443;

const socket = io(URL, {
	path: '/mysocket',
	autoConnect: false,
});

export default socket;
