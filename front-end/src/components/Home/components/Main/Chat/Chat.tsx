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
import grpsImg from '../../../../../assets/img/groups.jpeg'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useNavigate } from "react-router-dom";


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
	const myData = useSelector((state: any) => state.admin);
	const [Checker, setCheck] = useState<boolean | null>(null);
	const [threDots, setThreDots] = useState(false);
	const [AllMsgs, setMessages] = useState<any>([]);
	const [Socket, setSocket] = useState<any>(null);
	const [Data, setData] = useState<any>({ isChannel: false, avatar: '', name: '', status: false, type: '' });
	const ref = useRef(null)
	const token = useSelector((state: any) => state.token).token;
	useEffect(() => {
		if (token) {
			const socket = io('http://localhost:3001/chat', {
				extraHeaders: {
					Authorization: `Bearer ${token}`,
				}
			});
			setSocket(socket);
		}
	}, [token, params.userId]);
	useEffect(() => {
		if (Socket) {
			Socket.on('connect', () => {
				console.log('chat is connected')
			});
			Socket.emit('joinRoom', params.userId);
			Socket.on('message', (data: any) => {
				setMessages((state: any) => [data, ...state]);
			});
			Socket.on('disconnect', () => {
			});
			return () => {
				Socket.disconnect();
			};
		}
	}, [Socket])
	const handleClickOutside = () => { setThreDots(false) }
	useOnClickOutside(ref, handleClickOutside)
	const [messageTyping, setMessageTyping] = useState<string>('');
	const handleButtonClick = () => {
		if (Socket)
			Socket.emit('message', { RoomId: params.userId, message: messageTyping });
	};
	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (messageTyping.length > 0) {
				handleButtonClick();
				setMessageTyping('');
			}
		}
	}

	useEffect(() => {
		const checkMember = async () => {
			await axios.post(`/room/checkmember/${params.userId}`).then((rsp) => setCheck(rsp.data));
		}
		checkMember();
	}, [])
	useEffect(() => {
		if (Checker === false) {
			params.setPop(true);
			params.setDisplay({ display: true, name: Data.name, roomId: params.userId, type: Data.type, password: null });
		}
	}, [Checker, Data])


	useEffect(() => {
		const FetchData = async () => {
			await axios.get(`/room/${params.userId}/messages`).then((rsp) => setMessages(rsp.data.reverse()));
			await axios.get(`/room/${params.userId}/RoomData`).then((rsp) => setData(rsp.data));
		}
		FetchData();

	}, [params.userId]);
	const navigate = useNavigate();
	return (
		<div className="chatContent">
			{
				Checker &&
				<>
					<div className="header">
						<div className="infoUser">
							{/* userImg */}
							<div style={{ backgroundImage: `url(${!Data.isChannel ? Data.avatar : grpsImg})` }} className="img"></div>
							<div className="nameAndStatus">
								<h1>{Data.name}<span className={!Data.isChannel ? (Data.status === true ? 'activeUser' : '') : 'room'}></span></h1>
								<p>{!Data.isChannel ? (Data.status === true ? 'Active Now' : 'Disconnected') : ''}</p>
							</div>
						</div>
						<div ref={ref} >
							{
								threDots && params.roomData &&
								<div className="threedots">
									{params.roomData.isChannel === false && <button>Invite to play</button>}
									{params.roomData.isChannel === false && <button>invite Profile</button>}
									{params.roomData.isChannel === false && <button onClick={async () => {
										await axios.post('/Profile/blockUser', {
											blockedUser: Data.name
										})
										navigate('/');
										window.location.reload();

									}} className='Block'>Block</button>}
									{params.roomData.isChannel === true && <button onClick={() => {
										params.setIsPop(true);
										params.setisMembers(true);
									}} >Members</button>}
									{(params.roomData.isChannel === true && params.roomData.Type === 'protected' && (params.roomData.UserRole === 'Owner' || params.roomData.UserRole === 'Admin')) && <button onClick={() => {

									}} className='Securite'>Securité</button>}
									{(params.roomData.isChannel === true) && <button onClick={() => {
									}} className='Block'>Leave Room</button>}

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
									handleButtonClick();
									setMessageTyping('');
								}
							}} className='send'><img src={send} alt="" /></button>
						</div>
						<div className="messages">
							{AllMsgs.map((e: any) => {
								return (
									<div key={nanoid()} className={e.UserId === myData.UserId ? "myMessage messageShow" : 'messageShow'}>
										<img src={e.UserId === myData.UserId ? myData?.avatar : e.user.avatar} alt="" />
										<p className='theTextMsg'>{e.Content}</p>
									</div>
								);
							})}
						</div>
					</div>
				</>
			}

		</div>
	)
}
type CreateRoomT = {
	name: string,
	password: string | null,
	type: string
}

function UserMember({ e, UserId, UserRole }: any) {
	const userRef = useRef(null);
	const handleClickOutside = () => {
		setUserO(false);
	}
	useOnClickOutside(userRef, handleClickOutside);
	const [UserO, setUserO] = useState(false);
	return (
		<div ref={userRef} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => {
			setUserO(!UserO);
		}} className="userSection">
			{UserO && UserId !== e.member.UserId && (UserRole === 'Owner' || UserRole === 'Admin') && <div key={e.member.UserId + '-options'} className="optionsUser">
				<h3 className={e.isMuted ? '' : 'Danger'}>{e.isMuted ? 'Unmute' : 'Mute'}</h3>
				<h3 className='Danger'>Kick</h3>
				<h3 className={e.isBanned ? '' : 'Danger'}>{e.isBanned ? 'Unbanne' : 'Banne'}</h3>
				{(e.Role !== 'Owner' || e.Role !== 'Admin') && <h3>Set Admin</h3>}
			</div>}
			<div className="contUserSect">
				<img src={e.member.avatar} />
				<p>{e.member.username}</p>
			</div>
		</div>
	)
}

function Chat(props: any) {
	type DisplayIt = {
		display: boolean,
		name: string
		roomId: string
		type: string
		password: string | null
	}
	const { userId } = useParams();
	const navigate = useNavigate();
	const [Dms, setTheDms] = useState([]);
	const [Grps, setGrps] = useState([]);
	const [isNewGroup, setNewGroup] = useState(false)
	const [isDm, setDm] = useState(true);
	const [isError, setError] = useState(false);
	const [isPopup, setPopUp] = useState(false);
	const [isMemeber, setmember] = useState(false);
	const [UsernameAddMember, setUsernameAddMember] = useState<any>('');
	const [ADDmember, setAddMember] = useState(false);

	const myData = useSelector((state: any) => state.admin);

	const [shouldJoin, setShouldJoin] = useState<DisplayIt>({ display: false, name: '', roomId: '', type: '', password: null });
	const [typeGroup, setType] = useState({ protected: true, private: false, public: false });
	function truncateString(str: string): string | null {
		if (str && str.length > 30) {
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

	useEffect(() => {
		const FetchDms = async () => {
			await axios.get('/room/dms').then((resp: any) => setTheDms(resp.data));
			await axios.get('/room/rooms').then((resp: any) => setGrps(resp.data));
		}
		FetchDms();
	}, [])
	console.log(Grps);
	const [RoomData, setRoomData] = useState<any | null>(null)
	useEffect(() => {
		if (props.params) {
			const FetchData = async () => {
				await axios.get(`/room/${userId}/getdetails`).then((rsp: any) => setRoomData(rsp.data));
			}
			FetchData();
		}
	}, [userId, isMemeber])

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
								<AnimatePresence mode='wait'>
									{
										isDm ? (
											Dms.length > 0 &&
											Dms.map((e: any, i: number) => {
												let j = i;
												if (i > 5)
													j = 0;
												return (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ delay: 0.07 * j, duration: 0.1 }}
														key={e.roomid + '-user'}
													>
														<Link to={'/chat/' + e.roomid} className="chatUser">
															<img src={e.avatar ? e.avatar : ''} />
															<div className="textUserChat">
																<h1>{e.name}</h1>
																<p>{!e.lastMessage ? `Say Hi to ${e.name}` : truncateString(e.lastMessage.content)}</p>
															</div>
														</Link>
													</motion.div>
												)
											})
										) : (

											Grps.length > 0 &&
											Grps.map((e: any, i: number) => {
												let j = i;
												if (i > 5)
													j = 0;
												return (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ delay: 0.07 * j, duration: 0.1 }}
														key={e.roomid + '-group'}
													>
														{/* to={'/chat/' + e.roomid}  */}
														<button onClick={async () => {
															await axios.post(`/room/checkmember/${e.roomid}`).then((rsp) => {
																if (rsp.data) {
																	navigate('/chat/' + e.roomid);
																}
																else {
																	setPopUp(true);
																	setShouldJoin({ display: true, name: e.name, roomId: e.roomid, type: e.type, password: null });
																}
															});

														}} className="chatUser">
															<img src={grpsImg} />
															<div className="textUserChat">
																<h1>{e.name}</h1>
																<p>{`Say in ${e.name}`}</p>
															</div>
														</button>
													</motion.div>
												)
											}))

									}
									{
										isPopup && <motion.div
											key='chat-popup'
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="popupChat">
											{
												isNewGroup &&
												<motion.div
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
																	await axios.post('/room/create', { room: CreateRoom }).then(async (resp) => {
																		if (resp) {
																			// await axios.get('/room/rooms').then((resp: any) => setGrps(resp.data));
																			setNewGroup(false);
																			setPopUp(false);
																			window.location.reload();
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
											{
												shouldJoin.display
												&&
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="newGroup displayIt">
													<div className="newGroupC displayitC">
														<div className="contentNewGroup">
															<h1 className='h1Displ'>{`Join ${shouldJoin.name} Room?`}</h1>
															<div style={{ width: '10', height: '2.188rem' }}>
																{
																	shouldJoin.type === 'protected' && <div className="inputContainer"><input onChange={(e: any) => {
																		setShouldJoin({ ...shouldJoin, password: e.target.value })
																	}} type="password" placeholder='Password' /></div>
																}
															</div>
															<div className="buttonNewGroup">
																<button onClick={async () => {
																	await axios.post(`/room/${shouldJoin.roomId}/joinroom`, { roomId: shouldJoin.roomId, password: shouldJoin.password }).then((rsp) => {
																		if (rsp.data.is) {
																			setShouldJoin({ display: false, name: '', roomId: '', type: '', password: null });
																			setPopUp(false);
																			setError(false);
																			window.location.reload();
																		}
																		else {
																			setError(true);
																		}
																	})
																}} className='btnNewGrp' disabled={(shouldJoin.type === 'protected' && (shouldJoin.password !== null && shouldJoin.password.length <= 0))} >join</button>
																<button onClick={() => {
																	setShouldJoin({ display: false, name: '', roomId: '', type: '', password: null });
																	setPopUp(false);
																	setError(false);
																}} className='btnNewGrp cancel'>Cancel</button>
																{isError && <p className='Error statusInput ChatError'>Something Wrong!</p>}
															</div>
														</div>
													</div>
												</motion.div>
											}
											{
												isMemeber && RoomData &&
												<motion.div
													key='setting-popup'
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="newGroup"
													style={{ width: '43.875rem', height: '21.438rem' }}
												>
													<div className="closeMemebers" onClick={() => {
														setPopUp(false)
														setmember(false)
													}}>
														<svg width="0.75rem" height="0.75rem" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path fillRule="evenodd" clipRule="evenodd" d="M10.7126 0.357436C11.1891 0.834018 11.1891 1.60671 10.7126 2.08329L7.26085 5.535L10.7126 8.98671C11.1891 9.46329 11.1891 10.236 10.7126 10.7126C10.236 11.1891 9.46329 11.1891 8.98671 10.7126L5.535 7.26086L2.08329 10.7126C1.60671 11.1891 0.834018 11.1891 0.357437 10.7126C-0.119145 10.236 -0.119145 9.46329 0.357437 8.98671L3.80915 5.535L0.357436 2.08329C-0.119145 1.60671 -0.119145 0.834019 0.357436 0.357438C0.834018 -0.119144 1.60671 -0.119144 2.08329 0.357438L5.535 3.80915L8.98671 0.357436C9.46329 -0.119145 10.236 -0.119145 10.7126 0.357436Z" fill="white" />
														</svg>

													</div>
													<div className="newGroupC">
														<div className="settingHeader">Members</div>
														<div className="membersEdit">
															<div className="members">
																{
																	RoomData.members.map((e: any) => (
																		<div key={e.member.UserId} >
																			<UserMember e={e} UserId={myData.UserId} UserRole={RoomData.UserRole} />
																		</div>
																	))
																}
															</div>
															{(RoomData.UserRole === "Owner" || RoomData.UserRole === "Admin") && <div className="butnsAdd">
																<button onClick={() => {
																	setmember(false);
																	setAddMember(true);
																}}>Add Member</button>
															</div>}
														</div>
													</div>

												</motion.div>
											}
											{
												ADDmember &&
												<motion.div
													key='setting-popup'
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0 }}
													className="newGroup"
													style={{ width: '26.25rem', height: '15rem' }}
												>
													<div className="addMember">
														<h2>Add New Member!</h2>
														<div className="inputContainer2"><input onChange={(e: any) => {
															setUsernameAddMember(e.target.value);
														}} type="text" placeholder='Username..' /></div>
														<div className="btnsAdding">
															<button disabled={UsernameAddMember.length <= 0} onClick={async () => {
																// UsernameAddMember
																await axios.post(`/room/${userId}/addmember`, { userName: UsernameAddMember }).then((rsp) => {
																	if (rsp.data) {
																		setAddMember(false);
																		setmember(true);
																	}
																	else {
																		setError(true);
																	}
																})

															}}>Add</button>
															{isError && <p className='Error statusInput ChatError'>Something Wrong!</p>}
															<button style={{ background: '#ED5152' }} onClick={() => {
																setAddMember(false);
																setmember(true);
															}}>Cancel</button>
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
						props.params == false ? <StartChat /> : <ChatContent setIsPop={setPopUp} setisMembers={setmember} roomData={RoomData} userId={userId} setPop={setPopUp} setDisplay={setShouldJoin} />
					}
				</div>
			</GradienBox>
		</div>
	)
}
export default Chat;