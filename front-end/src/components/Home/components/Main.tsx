import { useEffect, useState } from 'react'
import Search from './Main/Search'
import MsgNot from './Main/MsgNot'
import GamesMode from './Main/GamesMode'
import BestPlayers from './Main/BestPlayers'
import Hero from './Main/Hero'
import ProfileHome from './Main/ProfileHome'
import { Route, Routes } from 'react-router-dom'
import "./Main.scss"
import GradienBox from '../../../tools/GradienBox'
import Chat from './Main/Chat/Chat'
import Profile, { ProfileProfile, ProfileDown } from './Main/Profile/Profile'
import Settings from './Main/Settings/Settings'
import LeaderBoard from './Main/LeaderBoard/LeaderBoard'
import axios from '../../../Interceptor/Interceptor'
import { Link } from 'react-router-dom'
import defaultAvatar from '../../../assets/img/avatar.png'
import Error404 from './404'
import { motion, AnimatePresence } from 'framer-motion';

function ActivityContent(props: any) {
	return (

		<motion.div
			initial={{ x: (props.side + '110%') }}
			animate={{ x: 0 }}
			exit={{ x: (props.side + '110%') }}
			transition={{ delay: ((props.id / 10) + 0.1), duration: 0.1 }}
			className="activity-x">
			<div className="part1">
				<Link to={'/profile/' + props.p1}><img src={props.avatar1} onError={(e: any) => {
					console.log(e.target);
					e.target.src = defaultAvatar;
				}
				} alt="" /></Link>

				<p>{props.p1}<span>{' ' + (props.isDraw === false ? 'won against ' : 'had a draw with ')}</span>{props.p2}</p>
				{/* <img src={props.avatar2} alt="" /> */}
			</div>
			<div className="time-act">{(props.isDraw === true ? '+60pts' : '+120pts')}</div>
		</motion.div>
	)
}
function Activity() {
	const [isAll, setIsALL] = useState({ boolAll: true });
	const [data, seData] = useState([]);
	console.log(data)
	useEffect(() => {
		axios.get('Home/RecentActivity').then((response) => seData(response.data));
	}, [])
	const calc = 555;
	return (
		<motion.div
		initial={{ x: '100vw'}}
		animate={{ x: 0 }}
		exit={{  x: '100vw'}}
		transition={{delay: 0.2, duration: 0.5 }} className="recentActivity">
			<div className='box-box-cont'>
				<h1 className='title-h1'>Recent activity</h1>
				<div className='box-cont'>
					<GradienBox minh={'505px'} vh={calc} mywidth="397px" myheight="573px" myborder="40px">
						<div className="activity">
							<div className="activity-head">
								<div className="button-switch">
									<div className={!isAll.boolAll ? "switch-back friend-active-btn" : 'switch-back all-active-btn'} />
									<button onClick={() => !isAll.boolAll && setIsALL({ boolAll: true })} className='all-btn'>All</button>
									<button onClick={() => isAll.boolAll && setIsALL({ boolAll: false })} className='friends-btn'>Friends</button>
								</div>

							</div>
							<div className="activity-content">
								<AnimatePresence mode='sync'>
									{
										isAll.boolAll ?
											(data && data.map((e: any, i) => {
												return (
													e.IsDraw === false ?
														<ActivityContent side={'-'} id={i} key={'activ-' + i} p1={e.Player1} p2={e.Player2} isDraw={e.IsDraw} avatar1={e.Player1Avatar} />
														: <>
															<ActivityContent side={'-'} id={i} key={'activ-' + i} p1={e.Player1} p2={e.Player2} isDraw={e.IsDraw} avatar1={e.Player1Avatar} />
															<ActivityContent side={'-'} id={i} key={'activ-' + i + '2'} p1={e.Player2} p2={e.Player1} isDraw={e.IsDraw} avatar1={e.Player2Avatar} />
														</>
												)
											})) : (data && data.filter((e: any) => e.AreFriends === true)
												.map((e: any, i) => {
													var index = i;
													if (i > 6)
														index = 6;
													return (
														e.IsDraw === false ?
															<ActivityContent side={''} id={index} key={'activ-' + 'firends' + i} p1={e.Player1} p2={e.Player2} isDraw={e.IsDraw} avatar1={e.Player1Avatar} />
															: <>
																<ActivityContent side={''} id={index} key={'activ-' + 'firends' + i + 'draw'} p1={e.Player1} p2={e.Player2} isDraw={e.IsDraw} avatar1={e.Player1Avatar} />
																<ActivityContent side={''} id={index} key={'activ-' + 'firends' + i + 'draw2'} p1={e.Player2} p2={e.Player1} isDraw={e.IsDraw} avatar1={e.Player2Avatar} />
															</>
													)
												}
												))
									}
								</AnimatePresence>
							</div>
							<button className="activity-footer">
								View more activity
								<svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M5.49979 6.32707C5.37201 6.32707 5.25222 6.30727 5.14042 6.26765C5.02861 6.22804 4.92479 6.16 4.82896 6.06353L0.396665 1.63124C0.220971 1.45554 0.137276 1.23577 0.145582 0.971905C0.153887 0.708044 0.245568 0.488585 0.420623 0.313529C0.596318 0.137835 0.819929 0.0499871 1.09146 0.0499871C1.36298 0.0499871 1.5866 0.137835 1.76229 0.313529L5.49979 4.05103L9.26125 0.28957C9.43694 0.113876 9.65672 0.0298625 9.92058 0.0375292C10.1844 0.0451958 10.4039 0.137196 10.579 0.313529C10.7547 0.489224 10.8425 0.712835 10.8425 0.984363C10.8425 1.25589 10.7547 1.4795 10.579 1.6552L6.17062 6.06353C6.07479 6.15936 5.97097 6.22741 5.85917 6.26765C5.74736 6.30791 5.62757 6.32771 5.49979 6.32707Z" fill="#00887A" />
								</svg>
							</button>
						</div>
					</GradienBox>
				</div>
			</div>
		</motion.div>
	);
}



function Side2(props: any) {
	return (
		<AnimatePresence mode='wait'>
			<div className='side2'>
				{
					props.isN === 1 ? <> <ProfileHome /><Activity /></> :
						<ProfileProfile />
				}
			</div>
		</AnimatePresence>
	)
}



function Main(props: any) {

	return (
		<div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'auto' }}>
			<div className='main'>
				<div className="side1">
					<div className='top'>
						<Search />
						<MsgNot socketInvi={props.socketInvi} />
					</div>
					<Routes>
						<Route path="/" element={<AnimatePresence mode='wait'><Hero /><GamesMode /><BestPlayers /></AnimatePresence>} />
						<Route path="chat" element={<Chat params={false} />} />
						<Route path="chat/:login" element={<Chat params={true} />} />
						<Route path="profile/:login" element={<><Profile /></>} />
						<Route path="settings/" element={<><Settings /></>} />
						<Route path="/leaderBoard" element={<LeaderBoard />} />
						<Route path="/404" element={<Error404 />} />
						<Route path="*" element={<Error404 />} />


					</Routes>
				</div>
				<Routes>
					<Route path="/" element={<Side2 isN={1} />} />
					<Route path="/settings" element={<Side2 isN={1} />} />
					<Route path="/leaderBoard" element={<Side2 isN={1} />} />
					<Route path="chat" element={<Side2 isN={1} />} />
					<Route path="chat/:login" element={<Side2 isN={1} />} />
					<Route path="/profile/:login" element={<Side2 isN={0} />} />
					<Route path="/404" element={<Side2 isN={1} />} />
					<Route path="*" element={<Side2 isN={1} />} />
				</Routes>

			</div>
			<Routes>
				<Route path="/profile/:login" element={<ProfileDown />} />
			</Routes>
		</div>
	)
}

export default Main