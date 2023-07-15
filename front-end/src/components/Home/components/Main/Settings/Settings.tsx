import './Settings.scss'
import GradienBox from '../../../../../tools/GradienBox'
import axios from '../../../../../Interceptor/Interceptor'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useEffect, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../store/store'
import { motion, AnimatePresence } from 'framer-motion'
import { setFalse, setTrue } from '../../../../../features/isLoading';
import { getAdmin, setUsername as setUSer, setStatus as statusSet } from '../../../../../features/adminSlice'
import Blockedlist from './BlockedList'


const BackHome = () => {
    return (
        <svg width="0.938rem" height="0.938rem" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.26941 0.309043C4.10711 0 5.15474 0 7.25 0C9.34526 0 10.3929 0 11.2306 0.309043C12.6029 0.815313 13.6847 1.89711 14.191 3.26941C14.5 4.10711 14.5 5.15474 14.5 7.25C14.5 9.34526 14.5 10.3929 14.191 11.2306C13.6847 12.6029 12.6029 13.6847 11.2306 14.191C10.3929 14.5 9.34526 14.5 7.25 14.5C5.15474 14.5 4.10711 14.5 3.26941 14.191C1.89711 13.6847 0.815313 12.6029 0.309044 11.2306C0 10.3929 0 9.34526 0 7.25C0 5.15474 0 4.10711 0.309044 3.26941C0.815313 1.89711 1.89711 0.815313 3.26941 0.309043ZM7.10515 5.08259C7.39804 4.78969 7.39804 4.31482 7.10514 4.02193C6.81225 3.72904 6.33737 3.72904 6.04448 4.02194L3.34681 6.71966C3.05392 7.01255 3.05392 7.48742 3.34681 7.78031L6.04449 10.478C6.33738 10.7709 6.81225 10.7709 7.10515 10.478C7.39804 10.1851 7.39804 9.71022 7.10515 9.41733L5.6878 7.99998H10.6213C11.0355 7.99998 11.3713 7.6642 11.3713 7.24998C11.3713 6.83577 11.0355 6.49998 10.6213 6.49998H5.68778L7.10515 5.08259Z" fill="#F9C690" />
        </svg>

    )
}
const Pen = () => {
    return (<svg width="1.938rem" height="1.938rem" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.642 7.2809C17.7388 6.18414 19.517 6.18414 20.6138 7.2809L22.6467 9.31381C23.7435 10.4106 23.7434 12.1888 22.6467 13.2855L12.7368 23.1954C12.5613 23.3709 12.3232 23.4696 12.0749 23.4696H7.39415C6.87713 23.4696 6.45801 23.0505 6.45801 22.5334V17.8527C6.45801 17.6044 6.55664 17.3663 6.7322 17.1907L16.642 7.2809ZM19.2899 8.60481C18.9243 8.23922 18.3315 8.23922 17.966 8.60481L17.304 7.94286L17.966 8.60481L8.3303 18.2405V21.5973H11.6871L21.3228 11.9616C21.6884 11.596 21.6884 11.0033 21.3228 10.6377L19.2899 8.60481L19.9518 7.94286L19.2899 8.60481Z" fill="white" />
    </svg>
    )
}
const IconName = () => {
    return (
        <svg width="1.125rem" height="1.375rem" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4.75C4 2.12665 6.12665 0 8.75 0C11.3734 0 13.5 2.12665 13.5 4.75C13.5 7.37335 11.3734 9.5 8.75 9.5C6.12665 9.5 4 7.37335 4 4.75Z" fill="white" />
            <path d="M5.7 12C2.55198 12 0 14.552 0 17.7V17.7C0 19.7987 1.70132 21.5 3.8 21.5H13.7C15.7987 21.5 17.5 19.7987 17.5 17.7V17.7C17.5 14.552 14.948 12 11.8 12H5.7Z" fill="white" />
        </svg>
    )
}
const Email = () => (
    <svg width="1.375rem" height="1.25rem" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M2.73005 0.544967C3.79961 0 5.19974 0 8 0H13.5C16.3003 0 17.7004 0 18.77 0.544967C19.7108 1.02433 20.4757 1.78924 20.955 2.73005C21.5 3.79961 21.5 5.19974 21.5 8V11.5C21.5 14.3003 21.5 15.7004 20.955 16.77C20.4757 17.7108 19.7108 18.4757 18.77 18.955C17.7004 19.5 16.3003 19.5 13.5 19.5H8C5.19974 19.5 3.79961 19.5 2.73005 18.955C1.78924 18.4757 1.02433 17.7108 0.544967 16.77C0 15.7004 0 14.3003 0 11.5V8C0 5.19974 0 3.79961 0.544967 2.73005C1.02433 1.78924 1.78924 1.02433 2.73005 0.544967ZM5.16603 5.12596C4.82138 4.8962 4.35573 4.98933 4.12596 5.33397C3.8962 5.67862 3.98933 6.14427 4.33397 6.37404L5.33397 7.0407L5.45034 7.11829L5.45034 7.1183C6.94864 8.11738 7.84026 8.71194 8.80274 9.00192C10.0727 9.38456 11.4273 9.38456 12.6973 9.00192C13.6597 8.71194 14.5514 8.11738 16.0496 7.1183L16.0497 7.11829L16.166 7.0407L17.166 6.37404C17.5107 6.14427 17.6038 5.67862 17.374 5.33397C17.1443 4.98933 16.6786 4.8962 16.334 5.12596L15.334 5.79263C13.6837 6.89281 12.9867 7.34812 12.2645 7.56569C11.2768 7.8633 10.2232 7.8633 9.23547 7.56569C8.51334 7.34812 7.8163 6.89281 6.16603 5.79263L6.16597 5.79259L5.16603 5.12596Z" fill="white" />
    </svg>

)
const Edit = () => {
    return (
        <svg width="1.313rem" height="1.313rem" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.8787 0.878679C14.0503 -0.292895 15.9497 -0.292891 17.1213 0.878681L19.2929 3.05025C20.4645 4.22183 20.4645 6.12132 19.2929 7.29289L11.7071 14.8787C11.5196 15.0662 11.2652 15.1716 11 15.1716H6C5.44772 15.1716 5 14.7239 5 14.1716V9.17157C5 8.90636 5.10536 8.652 5.29289 8.46447L12.8787 0.878679ZM15.7071 2.29289C15.3166 1.90237 14.6834 1.90237 14.2929 2.29289L7 9.58579V13.1716H10.5858L17.8787 5.87868C18.2692 5.48815 18.2692 4.85499 17.8787 4.46447L15.7071 2.29289L16.2283 1.77173L15.7071 2.29289ZM5 2.17157C3.34315 2.17157 2 3.51472 2 5.17157V15.1716C2 16.8284 3.34315 18.1716 5 18.1716H15C16.6569 18.1716 18 16.8284 18 15.1716V12.1716C18 11.6193 18.4477 11.1716 19 11.1716C19.5523 11.1716 20 11.6193 20 12.1716V15.1716C20 17.933 17.7614 20.1716 15 20.1716H5C2.23858 20.1716 0 17.933 0 15.1716V5.17157C0 2.41015 2.23858 0.171574 5 0.171574H8C8.55228 0.171574 9 0.619289 9 1.17157C9 1.72386 8.55228 2.17157 8 2.17157H5Z" fill="white" fillOpacity="0.5" />
        </svg>
    )

}
const Exit = () => (
    <svg width="0.75rem" height="0.75rem" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.7126 0.357436C11.1891 0.834018 11.1891 1.60671 10.7126 2.08329L7.26085 5.535L10.7126 8.98671C11.1891 9.46329 11.1891 10.236 10.7126 10.7126C10.236 11.1891 9.46329 11.1891 8.98671 10.7126L5.535 7.26086L2.08329 10.7126C1.60671 11.1891 0.834018 11.1891 0.357437 10.7126C-0.119145 10.236 -0.119145 9.46329 0.357437 8.98671L3.80915 5.535L0.357436 2.08329C-0.119145 1.60671 -0.119145 0.834019 0.357436 0.357438C0.834018 -0.119144 1.60671 -0.119144 2.08329 0.357438L5.535 3.80915L8.98671 0.357436C9.46329 -0.119145 10.236 -0.119145 10.7126 0.357436Z" fill="white" />
    </svg>

);
type Info = {
    avatar: string,
    username: string,
    email: string
}
function Settings() {
    const dispatch: AppDispatch = useDispatch()
    const Admin = useSelector((state: any) => state.admin);
    const [LinkGoogle, setLinkGoogle] = useState(true);
    const [isDelete, setDeleteTab] = useState(false);
    const [isBlockedList, setBlockedTab] = useState(false);
    const [isPopUp, setPopUp] = useState(false);
    const [imgChange, setImgChange] = useState<File | null>(null);
    const [UsernameStatus, setStatus] = useState<boolean | undefined>(undefined);
    const [isOff, setisOff] = useState<boolean | null>(null);
    const [username, setUsername] = useState("");
    const [myInfo, setInfo] = useState<Info>({ avatar: "", username: "", email: "" });
    const [updateS, setUpdate] = useState(false);
    const handleChange = (event: any) => {
        setLinkGoogle(current => !current);
    };
    useEffect(() => {
        dispatch(setTrue());
        dispatch(getAdmin());
        const FetchData = async () => {
            await axios.get("/setting/account").then((resp) => {
                setInfo(resp.data);
                setUsername(resp.data.username);

            })
            if (isOff === null) {
                axios.get("/setting/status").then((resp) => {
                    setisOff(!resp.data.status);
                    console.log("status", isOff)
                })
            }
            dispatch(setFalse());
            // setTimeout(() => {},2000)

        }
        FetchData()
    }, [])
    const deleteAccount = () => {
        axios.post("/setting/DeleteAccount").catch((resp) => {
        }).then(() => {
            window.location.reload(false);
        })
    }
    const divStyle = {
        backgroundImage: imgChange === null ? `url(${myInfo.avatar})` : `url(${URL.createObjectURL(imgChange)})`,

    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImgChange(file);
    };
    const handleStatus = async () => {
        dispatch(setTrue());
        await axios.post("/setting/updateStatus", !isOff).then((resp) => console.log(resp))
        setisOff(!isOff)
        // setTimeout(() => {
        // console.log('hello');
        dispatch(setFalse());
        // }, 200);

    }
    const HandleImg = async (event: any) => {

        if (imgChange !== null) {
            event.preventDefault();
            const data = new FormData();
            data.append('file', imgChange);
            console.log(imgChange);
            const headers = {
                'Content-Type': 'multipart/form-data'
            };
            dispatch(setTrue());
            await axios.post("/setting/UpdatePicture", data, { headers: headers as any }).then((res) => {
                console.log(res.statusText);
            });
            dispatch(getAdmin());
            dispatch(setFalse());
        }
    }
    const handleSave = async (event: any) => {
        dispatch(setTrue());
        if (username !== myInfo.username) {
            await axios
                .post("/setting/updateUsername", { username })
                .then((resp) => {
                    setStatus(true);
                    setInfo((prev: Info) => ({ ...prev, username }));
                    setUpdate(!updateS);
                })
                .catch((err) => {
                    setImgChange(null);
                    setStatus(false);
                });
        }
        dispatch(setFalse());
    }
    useEffect(() => {
        // if (username !== myInfo.username)
        {
            // dispatch(setTrue());
            dispatch(setUSer(username));
            // dispatch(setFalse());
        }
        if (isOff !== null)
            dispatch(statusSet(isOff));
    }, [updateS, isOff])
    return (
        <div className="settings-Container">
            <div className="header-settings">
                <h1>Settings</h1>
                <div className='backHome-cont'>
                    <Link to='/' className="backHome">
                        <BackHome />
                        <p>Back to home</p>
                    </Link>
                </div>
            </div>
            <GradienBox mywidth="1201px" myheight="365px" myborder="40px">
                <div className="AccountSettings">
                    <h2>Account</h2>
                    <div className="account-set">
                        <div style={divStyle} className="image-pro-settings">
                            <div className="editAv">EDIT<br />AVATAR</div>
                            <input onChange={handleFileChange} accept=".png, .jpg, .jpeg" type="file" name="" id="" style={{ width: "100%", height: "10.375rem", cursor: 'pointer', zIndex: "9999999999999", opacity: 0, position: "relative", transform: "translateY(-10.2rem)" }} />
                            <button onClick={HandleImg} style={{ zIndex: "999999999999999999999999999999" }} className='Pen'><div className="penC"><Pen /></div></button>
                        </div>
                        <div className="edit-NEP">
                            <div className="input-settings">
                                <GradienBox mywidth="59px" myheight="59px" myborder="25px">
                                    <div className="icon-edit">
                                        <IconName />
                                    </div>
                                </GradienBox>
                                <GradienBox mywidth="480px" myheight="59px" myborder="25px">
                                    <div className="inputContent"><input onChange={(event) => {
                                        setUsername(event.target.value);
                                    }} placeholder={myInfo.username} type="text" /><button><Edit /></button></div>
                                </GradienBox>
                            </div>
                            <div className="input-settings">
                                <GradienBox mywidth="59px" myheight="59px" myborder="25px">
                                    <div className="icon-edit">
                                        <Email />
                                    </div>
                                </GradienBox>
                                <GradienBox mywidth="480px" myheight="59px" myborder="25px">
                                    <div className="inputContent"><input style={{ color: "gray", cursor: "not-allowed" }} value={myInfo.email} type="text" disabled /><button style={{ cursor: "not-allowed" }}><Edit /></button></div>
                                </GradienBox>
                            </div>
                            <button className='saveBtn' style={{}} onClick={handleSave}>Save</button>
                            {
                                (UsernameStatus !== undefined && (UsernameStatus === false ? <p className='Error statusInput'>Something Wrong!</p> : <p className='validate statusInput'>Update Success!</p>))
                            }
                        </div>
                    </div>
                </div>
            </GradienBox>
            <div className="con-act">
                <GradienBox mywidth="559px" myheight="338px" myborder="40px">
                    <div className="con-act-cont">
                        <h1>Account Connectivity</h1>
                        <div className="center-cont-act">
                            <h2>Link Account with Google</h2>
                            <label className="switch" htmlFor="checkbox">
                                <input onChange={handleChange} className='toogleInput' type="checkbox" id="checkbox" />
                                <div className="slider round"></div>
                            </label>
                        </div>
                        <div className="bottom-cont bottom-update">
                            <h2>Default Status</h2>
                            {
                                // isOff === null &&
                                <div className="button-switch">
                                    <div className={isOff ? "switch-back offline-active-btn" : 'switch-back online-active-btn'} />
                                    <button onClick={handleStatus} className='online-btn'>Offline</button>
                                    <button onClick={handleStatus} className='offline-btn'>Online</button>
                                </div>
                            }

                        </div>
                    </div>
                </GradienBox>
                <GradienBox mywidth="559px" myheight="338px" myborder="40px">
                    <div className="con-act-cont">
                        <h1>Account Management</h1>
                        <div className="center-cont-act">
                            <h2>Blocked Accounts</h2>
                            <button onClick={() => {
                                setPopUp(true);
                                setBlockedTab(true);
                            }} className="showListC">
                                <div className='showlist' style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>Show list</div>
                            </button>
                        </div>
                        <div onClick={() => {
                            setPopUp(true);
                            setDeleteTab(true);
                        }} className="bottom-cont">
                            <button className="deleteAccount">
                                <div className="deleteAcountU">Delete Account</div>
                            </button>
                        </div>
                    </div>
                </GradienBox>
            </div>
            <AnimatePresence mode='wait'>
                {isPopUp &&
                    <motion.div
                        key='delete-pop'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="deleteFull">
                        {
                            isDelete &&
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                key={'delete-side'}
                                transition={{ ease: "easeInOut", duration: 0.2 }} className='DeleteAccount'>
                                <div className="delete-cont">
                                    <h4>Delete Account</h4>
                                    <p>This action will permanently delete your account and all associated data. You will lose access to your profile, settings, and any content or information associated with your account. This cannot be undone.</p>
                                    <div className="buttns">
                                        <button onClick={deleteAccount} className="imsure btnDelet">I'm sure</button>
                                        <button onClick={() => {
                                            setDeleteTab(false);
                                            setPopUp(false);
                                        }} className="cancel btnDelet">Cancel</button>
                                    </div>
                                </div>
                            </motion.div>
                        }
                        {
                            isBlockedList &&

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                key={'Block-Side'}
                                transition={{ ease: "easeInOut", duration: 0.2 }}
                            >
                                <button onClick={() => {
                                    setPopUp(false);
                                    setBlockedTab(false);
                                }} className='exitblocke'>
                                    <Exit />
                                </button>
                                <Blockedlist />
                            </motion.div>

                        }

                    </motion.div>
                }
            </AnimatePresence>

        </div>
    )
}
export default Settings;