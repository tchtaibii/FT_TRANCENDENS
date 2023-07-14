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

function MsgNot() {
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
		<div className='msgNot-cont' ref={ref}>
			{/* <GradienBox mywidth="49px" myheight="49px" myborder="10px">
				<button className='btn-msgnot'><img style={{ width: '1.5rem' }} src={inviFriend} alt='' /></button>
			</GradienBox> */}
			<GradienBox mywidth="49px" myheight="49px" myborder="10px">
				<button onClick={() => setIsVisible(!isVisible)} className='btn-msgnot'><img style={{ width: '1.5rem' }} alt='' src={BellImg} /></button>
			</GradienBox>
			{
				isVisible && <div style={{ position: 'absolute', top: '4.7rem', width: 'fit-content',transform: 'translateX(-7rem)' }}>
					<NotificationCont />
				</div>
			}
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
function NotificationCont() {

	const [isEffect, setIsEffect] = useState(false);
	const DataNotifications: any = useSelector((state: any) => state.notification);
	// console.log('notification :', DataNotifications);
	const notifi = DataNotifications.notifications;

	const dispatch: AppDispatch = useDispatch()

	const markAllAsRead = async () => {
		const updatedNotifications = notifi
			.filter((not: any) => not.isRead === 0)
			.map((not: any) => ({
				...not,
				isRead: 1,
			}));
		try {
			for (const notification of updatedNotifications) {
				const response = await axios.patch(`http://localhost:3001/notifications/${notification.id}`, {
					isRead: 1,
				});
				// console.log(response.data);
			}
			setIsEffect(!isEffect);
			// console.log('updated notifications:', updatedNotifications);
		} catch (error) {
			// console.error(error);
		}
	};
	const handleNotificationClick = async (objectId: number) => {
		try {
			const updatedData = {
				isRead: 1,
			};
			const response = await axios.patch(`http://localhost:3001/notifications/${objectId}`, updatedData);
			setIsEffect(!isEffect);
			// console.log(response.data);
		} catch (error) {
			// console.error(error);
		}


	};
	useEffect(() => {
		dispatch(getNotification());
	}, [isEffect]);
	return (

		<GradienBox absolute={1} mywidth="316px" myheight="408.98px" myborder="20px">
			<div className="notification-container">
				<div className="head-noti-container">
					<div className="notication-head">NOTIFICATIONS</div>
					<span className='notifi-num'>{notifi.filter((not: any) => not.isRead === 0).length}</span>
				</div>
				<div className="main-noti">
					{notifi.map((e: any, index: number) => {
						return (<Notification onClick={() => handleNotificationClick(index + 1)} key={'noti-' + index} isRead={e.isRead} img={test} text={e.text} />);
					})}
				</div>
				<div className="fot-notification">
					<button onClick={markAllAsRead} className='mark-read'>Mark all as read</button>
				</div>
			</div>
		</GradienBox>

	)
}


export default MsgNot