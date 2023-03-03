import { useState } from 'react'
import styled from 'styled-components'
import Chat from './Chat'

const GlobalDiv = styled.div`
	display: flex;
	height: max-content;
	padding: 31px;
	align-items: center;
	flex-direction: ${props => props.isOpen ? "row" : "row-reverse"};
`

const ToggleButton = styled.button`
	height: 80px;
	width: fit-content;
	padding: 0px;
	background: rgba(0, 0, 0, 0.8);
	border: solid rgba(255, 133, 133, 0.863);
	border-width: ${props => props.isOpen ? "2px 2px 2px 0px" : "2px 2px 2px 4px"};
	text-align: right;
	font-size: larger;
	font-weight:bold;
	color: white;
	border-radius: 0px 10px 10px 0px;
`

function OptionsChat() {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<GlobalDiv isOpen={isOpen}>
			<Chat isOpen={isOpen}/>
			<ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
				<p style={{writingMode:"vertical-lr", margin:"5px"}}>
					{isOpen ? "\\/ \\/ \\/" : "/\\ /\\ /\\"}
				</p>
			</ToggleButton>
		</GlobalDiv>
	)
}

export default OptionsChat
