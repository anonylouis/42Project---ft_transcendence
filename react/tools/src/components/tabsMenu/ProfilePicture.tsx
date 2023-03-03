import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../main'
import styled from 'styled-components'
import { instanceAPI } from '../../datas/instanceAPI';
import { Buffer } from 'buffer'

const Photo = styled.img`
	margin: 20px;
	margin-left: 15%;
	margin-right: 15%;
	width: 250px;
	height: 250px;
	border-radius: 50%;
	border: 3px white solid;
	object-fit: cover;
`

function ProfilePhoto({id} : { id : string | undefined}) {
	const { userData, setUserData } = useContext(UserContext);
	const [ Image, setImage ] = useState<string | null>(null);

	useEffect(() => {
		const getAvatar = async() => {
			if (userData?.token && userData.user && id) {
				const avatar = await instanceAPI.get('myUser/avatarById', {
					headers: {
						Authorization: `Bearer ${userData.token}`,
						'id' : `${id}`
					}, 
					responseType: "arraybuffer"
				})
				if (avatar?.data) {
					setImage(Buffer.from(avatar.data, 'binary').toString('base64'));
				}
			}
		}
		getAvatar();
	}, [userData, id]);

	return (
		<Photo src={Image ? `data:image/jpeg;base64,${Image}` : undefined} alt="ProfilePicture"/>
	)
}

export default ProfilePhoto;
