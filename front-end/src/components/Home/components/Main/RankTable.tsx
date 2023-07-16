import PlayerRank from './PlayerRank'
import "../Main.scss"
import Iaward from "../../../../assets/img/award.svg"
import gold from "../../../../assets/img/Gold.svg"
import Silver from "../../../../assets/img/silver.svg"
import Bronze from "../../../../assets/img/bronze.svg"
import intero from "../../../../assets/img/interogation.svg"
import { useEffect, useState, useRef } from 'react'
import axios from '../../../../Interceptor/Interceptor'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store'
import { setFalse, setTrue } from '../../../../features/isLoading';
function  	RankTable() {

	const dispatch: AppDispatch = useDispatch()
	const [rankData, setBestPlayers] = useState([])
	useEffect(() => {
		if (rankData.length === 0) {
			dispatch(setTrue());
			console.log('outside')
			axios.get('/Home/Best6Players').then((response) => {
				setBestPlayers(response.data);
				dispatch(setFalse());
			})
		}
	}, [])
	var noPlayer = {
		login: "--",
		level: 0,
		lastGame: "--",
		avatar: intero,
		points: 0,
		status: false,
		admin: false,
		award: Iaward
	}
	var newObject: any[] = [];
	for (let index = 0; index < 10; index++) {
		if (rankData[index] === undefined)
			newObject.push(noPlayer);
		else {
			newObject.push(
				{
					login: rankData[index].username,
					level: rankData[index].level,
					lastGame: "--",
					avatar: rankData[index].avatar,
					points: rankData[index].XP,
					award:
						index === 0 ? gold :
							index === 1 ? Silver :
								index === 2 ? Bronze :
									Iaward,
				})
		}
	}
	return (
		<>
			{/* <Loading/> */}
			<div className="bp">
				<div className='bp-head'>
					<div className="head-">
						<h3 style={{ right: '-4rem', position: 'relative' }}>#</h3>
						<h3 style={{ right: '-10.5rem', position: 'relative' }}>player</h3>
						<h3 style={{ right: '-35rem', position: 'relative' }}>points</h3>
						<h3 style={{ right: '-50.5rem', position: 'relative' }}>Level</h3>
					</div>
				</div>
				<div className="rank">
					{
						newObject.map((e, index) => {
							// if (index < 1)
								return <PlayerRank key={(index + 1) + 'player'} award={e.award} avatar={e.avatar} login={e.login} points={e.points} level={e.level} />
						})}
				</div>
			</div>
		</>
	)
}

export default RankTable