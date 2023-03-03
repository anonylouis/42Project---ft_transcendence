import styled from 'styled-components'
import { modeObj } from '../datas/gameModesOptions'
import { Menu_props } from '../interfaces/interfaceOptions'

const TitleMenu = styled.h2`
	font-size:3em;
	margin: 0%;
	color: #f54000;
	text-decoration: underline rgba(255, 133, 133, 0.863);
	text-decoration-thickness: 4px;
	text-underline-offset: 3px;
	border: solid #f54000;
	width: fit-content;
	border-width: 0px 0px 4px 0px;
`

const ContentMenu = styled.div`
	background: rgba(0, 0, 0, 0.8);
	padding: 10px;
	height: fit-content;
	display: flex;
	align-items: center;
	flex-direction: column;
	border: 2px rgba(240, 160, 160, 0.863) solid;
	border-radius : 10px 10px 25px 25px;
	transition: all 0.2s ease-in-out;
`

const ContentMenuHidden = styled(ContentMenu)`
	visibility: hidden;
`

const ButtonMenu = styled.button`
	margin: 5px;
	padding: 15px;
	width: 150px;
	border:3px rgba(240, 160, 160, 0.863) solid;
	border-radius: 5px;
	background-color: black;
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

function MenuMobile({isOpen, mode, changeMode, options, updateOptions} : Menu_props) {
	return isOpen ? (
				<ContentMenu>
					<TitleMenu>Modes</TitleMenu>
					<ul style={{display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
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
					<ul style={{display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
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
				<></>
		)
}

export default MenuMobile

