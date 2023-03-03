import styled from 'styled-components';

export const WhiteSpan = styled.span`
	color: white;
`

export const OrangeSpan = styled.span`
	color: #f54000;
`

export const UserListDiv = styled.div`
	border: 1px rgba(0, 0, 0, 0) solid;
	&:hover {
		border-top: 1px black solid;
		border-bottom: 1px black solid;
		border-right: 1px black solid;
		cursor: pointer;
	}
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 16px;
`

export const IconMenuImg = styled.img`
	&:hover {
		border: 1px black solid;
		cursor: pointer;
	}
`
