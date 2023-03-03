import styled from 'styled-components'
import { modeObj } from '../datas/gameModesOptions'
import { Menu_props } from '../interfaces/interfaceOptions'

const TitleMenu = styled.h2`
	font-size:3em;
	color: #f54000;
	text-decoration: underline rgba(255, 133, 133, 0.863);
	text-decoration-thickness: 4px;
	text-underline-offset: 3px;
	border: solid #f54000;
	width: fit-content;
	border-width: 0px 0px 4px 0px;
`

const ContentMenu = styled.div`
	padding: 31px;
	width: 200px;
	height: fit-content;
	display: flex;
	flex-direction: column;
	border-radius : 0% 10px 25px 0%;
	transition: all 0.2s ease-in-out;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	background: rgba(0, 0, 0, 0.8);
`
const ContentMenuHidden = styled(ContentMenu)`
	visibility: hidden;
`

const ButtonMenu = styled.button`
	margin: 1%;
	padding: 8%;
	width: 100%;
	border:3px rgba(240, 160, 160, 0.863) solid;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.8);
	color: white;
	text-transform: uppercase;
	&:hover {
		border:3px #f54000 solid;
		color: #f54000;
	}
	cursor: pointer;
`
const Selected = styled(ButtonMenu)`
	border:3px #f54000 solid;
	color: #f54000;
`

function MenuPC({isOpen, mode, changeMode, options, updateOptions} : Menu_props) {

	return isOpen ? (
		<ContentMenu>
			<TitleMenu>Modes</TitleMenu>
			<ul>
				{
					modeObj.map((name) => (
						name == mode ? (
							<Selected key={name + "0"} onClick={() => changeMode(name)}> {name} </Selected>		
						) : (
							<ButtonMenu key={name + "1"} onClick={() => changeMode(name)}> {name} </ButtonMenu>
						)
					))
				}
			</ul>
			<TitleMenu>Bonus</TitleMenu>
			<ul>
				{
					[...options.keys()].map((opt) => (
						options.get(opt) ? (
							<Selected key={opt + "0"} onClick={() => updateOptions(opt)}>{opt}</Selected>
						) : (
							<ButtonMenu key={opt + "1"} onClick={() => updateOptions(opt)}>{opt}</ButtonMenu>
						)
					))
				}
			</ul>
		</ContentMenu>
		) : (
			<ContentMenuHidden>
			<TitleMenu>Modes</TitleMenu>
			<ul>
				{
					modeObj.map((name) => (
						name == mode ? (
							<Selected key={name + "0"} onClick={() => changeMode(name)}> {name} </Selected>		
						) : (
							<ButtonMenu key={name + "1"} onClick={() => changeMode(name)}> {name} </ButtonMenu>
						)
					))
				}
			</ul>
			<TitleMenu>Bonus</TitleMenu>
			<ul>
				{
					[...options.keys()].map((opt) => (
						options.get(opt) ? (
							<Selected key={opt + "0"} onClick={() => updateOptions(opt)}>{opt}</Selected>
						) : (
							<ButtonMenu key={opt + "1"} onClick={() => updateOptions(opt)}>{opt}</ButtonMenu>
						)
					))
				}
			</ul>
		</ContentMenuHidden>
		)

}

export default MenuPC

