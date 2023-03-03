import { useState } from 'react'
import styled from 'styled-components'
import { Options_props } from '../interfaces/interfaceOptions'
import MenuMobile from './MenuMobile'
import MenuPC from './MenuPC'

interface css_props {
	isOpen : boolean
}

const DivMenuPC = styled.div`
	display: flex;
	height: max-content;
	padding: 31px;
	align-items: center;
	flex-direction: ${(props : css_props) => props.isOpen ? "row" : "row-reverse"};
`
const DivMenuMobile = styled.div`
	display: flex;
	height: max-content;
	padding: 20px;
	flex-direction: ${(props : css_props) => props.isOpen ? "column" : "column-reverse"};
`

const ToggleButtonPC = styled.button`
	height: 80px;
	width: fit-content;
	padding: 0px;
	background: rgba(0, 0, 0, 0.8);
	border: solid rgba(255, 133, 133, 0.863);
	border-width: ${(props : css_props) => props.isOpen ? "2px 2px 2px 0px" : "2px 2px 2px 4px"};
	text-align: right;
	font-size: larger;
	font-weight:bold;
	color: white;
	border-radius: 0px 10px 10px 0px;
	cursor: pointer;
`

const ToggleButtonMobile = styled.button`
	height: fit-content;
	margin: auto;
	width: 75px;
	background: rgba(0, 0, 0, 0.8);
	border: solid rgba(255, 133, 133, 0.863);
	border-width: ${(props : css_props) => props.isOpen ? "0px 2px 2px 2px" : "4px 2px 2px 2px"};
	text-align: center;
	font-size: larger;
	font-weight:bold;
	color: white;
	border-radius: 0px 0px 10px 10px;
	cursor: pointer;
`

function Options({mobileView, mode, changeMode, options, updateOptions} : Options_props) {
	const [isOpen, setIsOpen] = useState(true);

	return mobileView ? (
				<DivMenuMobile isOpen={isOpen}>
					<MenuMobile isOpen={isOpen} mode={mode} changeMode={changeMode} options={options} updateOptions={updateOptions}/>
					<ToggleButtonMobile isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? "/\\ /\\ /\\" : "\\/ \\/ \\/"}
					</ToggleButtonMobile>
				</DivMenuMobile>
			) : (
				<DivMenuPC isOpen={isOpen}>
					<MenuPC isOpen={isOpen} mode={mode} changeMode={changeMode} options={options} updateOptions={updateOptions}/>
					<ToggleButtonPC isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>	
						<p style={{writingMode:"vertical-lr", margin:"5px"}}>
							{isOpen ? "\\/ \\/ \\/" : "/\\ /\\ /\\"}
						</p>
					</ToggleButtonPC>
				</DivMenuPC>
		)
}

export default Options

