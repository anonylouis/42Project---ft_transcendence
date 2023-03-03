import styled from "styled-components"
import { Link } from "react-router-dom"

const GlobalDiv = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const TILTE = styled.h1`
	color : white;
	margin-top: 5%;
	margin-bottom: 5%;
	border-bottom : 4px #f54000 solid;
`
const CONTENT = styled.div`
	color: white;
	font-size: x-large;
	text-align: center;
	background: rgba(0, 0, 0, 0.9);
	padding: 20px;
	border: 2px rgba(240, 160, 160, 0.863) solid;
`

const HOMELINK = styled(Link)`
	margin-top : 5%;
	padding: 10px 15px 10px 15px;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.9);
	color: white;
	font-size: x-large;
`

function Error() {
	return (
		<GlobalDiv>
			<TILTE>404 - Page Not Found</TILTE>
			<CONTENT>
				F**k this evaluator trying to break my transcendence
				<br/>
				<br/>
				psst go back home now
			</CONTENT>
			<HOMELINK to='/'>Home</HOMELINK>
		</GlobalDiv>
	)
}

export default Error
