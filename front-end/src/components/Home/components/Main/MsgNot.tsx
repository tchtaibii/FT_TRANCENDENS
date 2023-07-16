import { useState, useRef, useEffect } from 'react'
import test from '../../../../assets/img/test.svg'
import "./MsgNot.scss"
import inviFriend from "../../../../assets/img/invitation-friend.svg"
import BellImg from "../../../../assets/img/bell.svg"
import burger from "../../../../assets/img/burger.svg"
import GradienBox from '../../../../tools/GradienBox'
import { NavLink } from 'react-router-dom'
import { useOnClickOutside } from 'usehooks-ts'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../store/store'
import { getNotification } from '../../../../features/notificationsSlice'
import { ReactSVG } from 'react-svg';
import axios from '../../../../Interceptor/Interceptor'
import LogoutImg from "../../../../assets/img/Logout.svg";
import HomeImg from "../../../../assets/img/Home.svg";
import ProfImg from "../../../../assets/img/profile.svg";
import SetfImg from "../../../../assets/img/Settings.svg";
import ChatImg from "../../../../assets/img/chat.svg";
import Stream from "../../../../assets/img/stream.svg";
import LeaderBoard from "../../../../assets/img/leaderBoard.svg";
import { motion, AnimatePresence } from 'framer-motion'

function MsgNot(props: any) {
	const [isVisible, setIsVisible] = useState(false);
	const [isNav, setNavMo] = useState(false);
	const ref = useRef(null)
	const [Login, setLogin] = useState('')
	useEffect(() => {
		axios.get('/Home/Hero').then((response) => setLogin(response.data))
		// console.log('hey', Login)
	}, [])
	const handleClickOutside = () => {
		setIsVisible(false)
	}
	useOnClickOutside(ref, handleClickOutside)
	return (
		<div className='msgNot-cont' >
			<GradienBox mywidth="49px" myheight="49px" myborder="10px">
				<button className='btn-msgnot'><img style={{ width: '1.5rem' }} src={inviFriend} alt='' /></button>
			</GradienBox>
			<div ref={ref}>
				<GradienBox mywidth="49px" myheight="49px" myborder="10px">
					<button onClick={() => setIsVisible(!isVisible)} className='btn-msgnot'><img style={{ width: '1.5rem' }} alt='' src={BellImg} /></button>
				</GradienBox>
			</div>

			{
				isVisible && <div style={{ position: 'absolute', top: '4.7rem', width: 'fit-content', transform: 'translateX(-9rem)' }}>
					<NotificationCont data={props.noti} isN={true} />
				</div>
			}
			<div style={{ position: 'absolute', top: '4.7rem', width: 'fit-content', transform: 'translateX(-15rem)' }}>
				<NotificationCont data={props.invi} isN={false} />
			</div>

			<div onClick={() => setNavMo(true)} className='burger'>
				<GradienBox mywidth="49px" myheight="49px" myborder="10px">
					<button className='btn-msgnot'><img style={{ width: '1.5rem' }} src={burger} alt='' /></button>
				</GradienBox>
			</div>
			<AnimatePresence mode='wait'>
				{isNav &&
					<motion.div className="nav-mobile"
						key='nav-mobile.'
						initial={{ x: '100vh' }}
						animate={{ x: 0 }}
						exit={{ x: '100vh' }}
					>
						<button onClick={() => setNavMo(false)}>X</button>
						<ul>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to='/'>
								<ReactSVG src={HomeImg} />
								{/* <img style={{ width: '1.5rem' }} src={HomeImg} alt="Home" /> */}
							</NavLink>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to={'profile/' + Login}>
								<ReactSVG src={ProfImg} />
								{/* <img style={{ width: '1.5rem' }} src={ProfImg} alt="Profile" /> */}
							</NavLink>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to='chat'>
								<ReactSVG src={ChatImg} />
								{/* <img style={{ width: '1.5rem' }} src={ChatImg} alt="Chat" /> */}
							</NavLink>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to='stream'>
								<ReactSVG src={Stream} />
								{/* <img style={{ width: '1.5rem' }} src={Stream} alt="Stream" /> */}
							</NavLink>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to='leaderBoard'>
								<ReactSVG src={LeaderBoard} />
								{/* <img style={{ width: '1.5rem' }} src={LeaderBoard} alt="Leader Board" /> */}
							</NavLink>
							<NavLink onClick={() => setNavMo(false)} className={({ isActive }) =>
								isActive ? 'nav-icon-act nav-mobile-icon' : 'nav-icon nav-mobile-icon'
							} to='settings'>
								<ReactSVG src={SetfImg} />
								{/* <img style={{ width: '1.5rem' }} src={SetfImg} alt="Settings" /> */}
							</NavLink>
							<a style={{ paddingTop: '10rem' }} href="http://localhost:3001/auth/logout" className='logout'>
								<img style={{ width: '15rem' }} src={LogoutImg} alt="" />
							</a>
						</ul>
					</motion.div>
				}
			</AnimatePresence>
		</div>
	)
}
function Notification(props: any) {
	const handleClick = () => {
		props.onClick();
	};

	return (
		<div id={props.id} className="notification" onClick={handleClick}>
			<div className={!props.isRead ? "no-read" : ""}>
				<img src={props.img} alt="" />
			</div>
			<div className="noti-text">{props.text}</div>
		</div>
	);
}
function Invitation(props:any) {
	return (
		<div className='invitation-user'>
			<div className="info">
				<img src={props.data.avatar} />
				<div className="who">
					<h4>{props.data.username}</h4>
					<p>Send a request to you</p>
				</div>
			</div>
			<div className="btn">
				<button><div className="text decline">Decline</div></button>
				<button><div className="text ">Accept</div></button>
			</div>
		</div>
	)
}
function NotificationCont(props: any) {

	// const [isEffect, setIsEffect] = useState(false);
	// const DataNotifications: any = useSelector((state: any) => state.notification);
	// // console.log('notification :', DataNotifications);
	// const notifi = DataNotifications.notifications;

	// const dispatch: AppDispatch = useDispatch()

	// const markAllAsRead = async () => {
	// 	const updatedNotifications = notifi
	// 		.filter((not: any) => not.isRead === 0)
	// 		.map((not: any) => ({
	// 			...not,
	// 			isRead: 1,
	// 		}));
	// 	try {
	// 		for (const notification of updatedNotifications) {
	// 			const response = await axios.patch(`http://localhost:3001/notifications/${notification.id}`, {
	// 				isRead: 1,
	// 			});
	// 			// console.log(response.data);
	// 		}
	// 		setIsEffect(!isEffect);
	// 		// console.log('updated notifications:', updatedNotifications);
	// 	} catch (error) {
	// 		// console.error(error);
	// 	}
	// };
	// const handleNotificationClick = async (objectId: number) => {
	// 	try {
	// 		const updatedData = {
	// 			isRead: 1,
	// 		};
	// 		const response = await axios.patch(`http://localhost:3001/notifications/${objectId}`, updatedData);
	// 		setIsEffect(!isEffect);
	// 		// console.log(response.data);
	// 	} catch (error) {
	// 		// console.error(error);
	// 	}


	// };
	// useEffect(() => {
	// 	dispatch(getNotification());
	// }, [isEffect]);


	useEffect(() => {

	}, [])
	console.log('invi from msg',props.invi);
	return (

		<GradienBox absolute={1} mywidth="316px" myheight="408.98px" myborder="20px">
			<div className="notification-container">
				<div className="head-noti-container">
					<div className="notication-head">{props.isN === true ? 'NOTIFICATIONS' : 'NEW REQUESTS'}</div>
					<span className='notifi-num'>{4}</span>
					{/* notifi.filter((not: any) => not.isRead === 0).length */}
				</div>
				<div className="main-noti">

					{
						(props.invi !== undefined || props.noti !== undefined ) && props.isN === false && props.invi.map((e:any, i:number) => <Invitation key={'invi- '+ i} data={e} />) 
						
						// :
						// props.noti.map((e: any, index: number) => {
						// 		return (<Notification key={'noti-' + index} isRead={e.isRead} img={e.avatar} text={e.text} />);
						// })
						// onClick={() => handleNotificationClick(index + 1)}
						// props.isN === true ? notifi.map((e: any, index: number) => {
						// 	return (<Notification onClick={() => handleNotificationClick(index + 1)} key={'noti-' + index} isRead={e.isRead} img={test} text={e.text} />);
						// });
					}
				</div>
				<div className="fot-notification">
					{
						props.isN === true ? <button className='mark-read'>Mark all as read</button> : <button className='mark-read dec'>Decline all</button>
						// onClick={markAllAsRead}
					}

				</div>
			</div>
		</GradienBox>

	)
}


export default MsgNot