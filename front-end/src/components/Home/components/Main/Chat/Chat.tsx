import emoji from '../../../../../assets/img/emojis.svg'
import send from '../../../../../assets/img/send.svg'
import GradienBox from '../../../../../tools/GradienBox'
import './Chat.scss'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { nanoid } from 'nanoid'
import checkBox from '../../../../../assets/img/checkbox.svg'
import axios from '../../../../../Interceptor/Interceptor'

function StartChat() {
	return (
		<div className="chatContent">
			<div className="startChat">
				hello
			</div>
		</div>
	)
}
const ThreeDots = () => {
	return (<svg width="0.313rem" height="1.125rem" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.58333 4.83329C3.72917 4.83329 4.66667 3.89579 4.66667 2.74996C4.66667 1.60413 3.72917 0.666626 2.58333 0.666626C1.4375 0.666626 0.5 1.60413 0.5 2.74996C0.5 3.89579 1.4375 4.83329 2.58333 4.83329Z" fill="white" />
		<path d="M2.58333 6.91663C1.4375 6.91663 0.5 7.85413 0.5 8.99996C0.5 10.1458 1.4375 11.0833 2.58333 11.0833C3.72917 11.0833 4.66667 10.1458 4.66667 8.99996C4.66667 7.85413 3.72917 6.91663 2.58333 6.91663Z" fill="white" />
		<path d="M0.5 15.25C0.5 14.1041 1.4375 13.1666 2.58333 13.1666C3.72917 13.1666 4.66667 14.1041 4.66667 15.25C4.66667 16.3958 3.72917 17.3333 2.58333 17.3333C1.4375 17.3333 0.5 16.3958 0.5 15.25Z" fill="white" />
	</svg>
	)
}

const SearchChat = () => {
	return (<svg width="0.875rem" height="0.875rem" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L12.4697 13.5303ZM6.68421 11.6184C3.95912 11.6184 1.75 9.4093 1.75 6.68421H0.25C0.25 10.2377 3.13069 13.1184 6.68421 13.1184V11.6184ZM1.75 6.68421C1.75 3.95912 3.95912 1.75 6.68421 1.75V0.25C3.13069 0.25 0.25 3.13069 0.25 6.68421H1.75ZM6.68421 1.75C9.4093 1.75 11.6184 3.95912 11.6184 6.68421H13.1184C13.1184 3.13069 10.2377 0.25 6.68421 0.25V1.75ZM11.6184 6.68421C11.6184 8.04696 11.067 9.27949 10.1732 10.1732L11.2339 11.2339C12.3974 10.0703 13.1184 8.46076 13.1184 6.68421H11.6184ZM10.1732 10.1732C9.27949 11.067 8.04696 11.6184 6.68421 11.6184V13.1184C8.46076 13.1184 10.0703 12.3974 11.2339 11.2339L10.1732 10.1732ZM10.1732 11.2339L12.4697 13.5303L13.5303 12.4697L11.2339 10.1732L10.1732 11.2339Z" fill="white" />
	</svg>

	)
}

function TypeGroup(props: any) {
	return (
		<div className="theType">
			<div onClick={() => {
				if (props.type === 'private')
					props.setType({ protected: false, private: true, public: false })
				if (props.type === 'public')
					props.setType({ protected: false, private: false, public: true })
				if (props.type === 'protected')
					props.setType({ protected: true, private: false, public: false })
			}} className={props.typeGroup[props.type] ? "checkbox isTrue" : "checkbox"}>
				<img src={checkBox} />
			</div>
			<p>{props.type}</p>
		</div>
	)
}

function ChatContent(params: any) {

	const [threDots, setThreDots] = useState(false)
	const ref = useRef(null)
	const handleClickOutside = () => { setThreDots(false) }
	useOnClickOutside(ref, handleClickOutside)

	const converastionWith = (): userType | undefined => {
		return params.users.length > 0 ? params.users.filter((e: userType) => e.login === params.pageOf)[0] : undefined;
	};
	const [AllMsg, setAllMsg] = useState<MessageType[]>(params.messages);
	const [oneTime, setOnetime] = useState(true);
	if (params.messages.length > 0 && oneTime === true) {
		setOnetime(false);
		setAllMsg(params.messages);
	}
	const [messageTyping, setMessageTyping] = useState<string>('');
	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (messageTyping.length > 0) {
				setAllMsg([{
					id: params.messages.length + 1,
					from: params.admin.login,
					to: params.pageOf,
					message: messageTyping,
					date: Date.now(),
					isLast: false
				}, ...AllMsg])
			}
			setMessageTyping('');
		}
	}
	return (
		<div className="chatContent">
			<div className="header">
				<div className="infoUser">
					<img src={converastionWith() !== undefined ? converastionWith()?.avatar : ''} alt="" />
					<div className="nameAndStatus">
						<h1>{converastionWith() !== undefined ? converastionWith()?.login : 'Guest'}<span className={(converastionWith() !== undefined ? converastionWith()?.status === true ? 'activeUser' : '' : '')}></span></h1>
						<p>{converastionWith() !== undefined && converastionWith()?.status === true ? 'Active Now' : 'Disconnected'}</p>
					</div>
				</div>
				<div ref={ref} >
					{
						threDots && <div className="threedots">
							<button>Invite to play</button>
							<button className='Block'>Block</button>
						</div>
					}
					<button onClick={() => {
						setThreDots(!threDots);
					}} className="more"><ThreeDots /></button>
				</div>

			</div>
			<div className="content">
				<div className="messageSend">
					<button><img src={emoji} alt="" /></button>
					<textarea onKeyDown={handleKeyPress} value={messageTyping} onChange={(e: any) => {
						setMessageTyping(e.target.value);
					}} placeholder='Type a message ...' name="" id=""></textarea>
					<button onClick={() => {
						if (messageTyping.length > 0) {
							setAllMsg([{
								id: params.messages.length + 1,
								from: params.admin.login,
								to: params.pageOf,
								message: messageTyping,
								date: Date.now(),
								isLast: false
							}, ...AllMsg])
							setMessageTyping('');
						}

					}} className='send'><img src={send} alt="" /></button>
				</div>
				<div className="messages">
					{AllMsg.filter((e: any) => params.pageOf === e.from || params.pageOf === e.to).map((e: MessageType) => {
						return (
							<div key={nanoid()} className={e.from === params.pageOf ? 'messageShow' : "myMessage messageShow"}>
								<img src={e.from === params.pageOf ? converastionWith()?.avatar : params.admin.avatar} alt="" />
								<p className='theTextMsg'>{e.message}</p>
							</div>
						);

					})}
				</div>
			</div>
		</div>
	)
}
type CreateRoomT = {
	name: string,
	password: string | null,
	type: string
}
function Chat(props: any) {
	const [isNewGroup, setNewGroup] = useState(false)
	const [isDm, setDm] = useState(true);
	const [isError, setError] = useState(false);
	const [isPopup, setPopUp] = useState(false);
	const [typeGroup, setType] = useState({ protected: true, private: false, public: false });
	function truncateString(str: string): string {
		if (str.length > 30) {
			return str.slice(0, 30 - 3) + '...';
		}
		return str;
	}
	const [CreateRoom, setRoom] = useState<CreateRoomT>({
		name: "",
		password: "",
		type: "protected"
	})
	const handleChangeName = (e: any) => {
		setRoom({ ...CreateRoom, name: e.target.value });
	}
	const handleChangePassword = (e: any) => {
		setRoom({ ...CreateRoom, password: e.target.value });
	}
	useEffect(() => {
		if (!typeGroup.protected) {
			if (typeGroup.private)
				setRoom({ ...CreateRoom, type: 'private', password: null });
			else
				setRoom({ ...CreateRoom, type: 'public', password: null });
		}
		else
			setRoom({ ...CreateRoom, type: 'protected' });
	}, [typeGroup])
	return (
		<div style={{ marginTop: '5rem' }} className="main-core">
			<GradienBox mywidth="1201px" myheight="850px" myborder="40px">
				<div className="chatContainer">
					<div className="chatUsers">
						<div className="chatUsersmesage">
							<div className="headerLeftChat">
								<div className="chatSearch">
									<input type="text" placeholder='Search for a Message...' />
									<button><SearchChat /></button>
								</div>
							</div>
							<div className="button-switch">
								<div className={!isDm ? "switch-back friend-active-btn" : 'switch-back all-active-btn'} />
								<button onClick={() => !isDm && setDm(true)} className='all-btn'>DM's</button>
								<button onClick={() => isDm && setDm(false)} className='friends-btn'>Groups</button>
							</div>
							<div className="newClear">
								<button onClick={() => {
									setNewGroup(true);
									setPopUp(true);
								}} className='new'>New Group</button>
							</div>
							<div className="lastMessage">
								{
									isDm &&
									<Link to={'/chat/' + 'tchtaibi'} key={nanoid()} className="chatUser">
										<img src={''} alt="" />
										<div className="textUserChat">
											<h1>{'tchtaibi'}</h1>
											<p>{truncateString('tdgudbhdshsdhudsuyuygdsyucdsyhuds')}</p>
										</div>
									</Link>
								}
								<AnimatePresence mode='wait'>
									{
										isPopup && <motion.div
											key='chat-popup'
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="popupChat">
											{
												isNewGroup && <motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="newGroup">
													<div className="newGroupC">
														<div onClick={() => {

														}} className="newGroupHeader">New Group</div>
														<div className="contentNewGroup">
															<div className="inputContainer"><input onChange={handleChangeName} type="text" placeholder='Name of Group' /></div>
															<div style={{ width: '15.625rem', height: '2.188rem' }}>
																{
																	typeGroup.protected && <div className="inputContainer"><input onChange={handleChangePassword} type="password" placeholder='Password' /></div>
																}
															</div>
															<div className="typeGroup">
																<TypeGroup typeGroup={typeGroup} setType={setType} type={'protected'} />
																<TypeGroup typeGroup={typeGroup} setType={setType} type={'public'} />
																<TypeGroup typeGroup={typeGroup} setType={setType} type={'private'} />
															</div>
															<div className="buttonNewGroup">
																<button onClick={async () => {
																	console.log(CreateRoom);
																	await axios.post('/room/create', { room: CreateRoom }).then((resp) => {
																		if (resp) {
																			setNewGroup(false);
																			setPopUp(false);
																		}
																		else {
																			setError(true);
																		}
																	});

																}} className='btnNewGrp' disabled={CreateRoom.type === 'protected' && (CreateRoom.password?.length === 0 || CreateRoom.password === null)}>Done</button>
																<button onClick={() => {
																	setNewGroup(false);
																	setPopUp(false);
																}} className='btnNewGrp cancel'>Cancel</button>
																{isError && <p className='Error statusInput ChatError'>Something Wrong!</p>}
															</div>
														</div>
													</div>
												</motion.div>
											}
										</motion.div>
									}
								</AnimatePresence>

							</div>
						</div>
					</div>
					{
						// props.params == false ? <StartChat /> : <ChatContent users={users} admin={admin} pageOf={login} />
					}
				</div>
			</GradienBox>
		</div>
	)
}
export default Chat;