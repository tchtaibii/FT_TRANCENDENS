import GradienBox from '../../../../tools/GradienBox'
import "./ProfileHome.scss"
import SBadge from "../../../../assets/img/small-badge.svg"
import BBadge from "../../../../assets/img/big-badge.svg"
import { getAdmin } from "../../../../features/adminSlice"
import { useDispatch, useSelector } from 'react-redux';
// import axios from '../../../../Interceptor/Interceptor'
import { AppDispatch } from '../../../../store/store'
import { useEffect, useState } from 'react';
import defaultAvatar from '../../../../assets/img/avatar.png'
import { Link } from 'react-router-dom'

function ProfileHome() {
    const dispatch: AppDispatch = useDispatch();
    // const data: any = useSelector((state: any) => state.admin);

    // // const [data, setdata] = useState('')
    // useEffect(() => {
    //     dispatch(getAdmin());
    //     console.log('data', data);
    //     // axios.get('Home/MyProfile').then((response) => setdata(response.data))

    // }, [dispatch])
    // const dispatch: AppDispatch = useDispatch();
    const data: any = useSelector((state: any) => state.admin);

    // useEffect(() => {
    //     const fetchData = async () => {
    // 		await dispatch(getAdmin());
    // 		// await dispatch(getNotification());
    // 		// await dispatch(getMessage());
    // 	};
    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     console.log('data', data);
    // }, [data]);
    console.log('hello', data)
    return (
        <div className="myProfile">
            <GradienBox mywidth="397px" myheight="284px" myborder="40px">
                {data &&
                    <div className="profile-con">
                        <div className="profile-head">My Profile</div>
                        <div className='profile-mid'>
                            <div className='mid1'>
                                <Link to={`/profile/${data.username}`} >
                                    <img className='mid-img1' onError={(e:any) => {
                                        console.log(e.target);
                                        e.target.src = defaultAvatar;
                                    }
                                    } alt='' src={data.avatar} />
                                </Link>
                                <div className='m1-nl'>
                                    <h1 style={{ width: '6.25rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{data.username}</h1>
                                    <div className='m1-l'>
                                        <img className='mid-img2' src={SBadge} alt='' />
                                        <h3>Level <span>{data.level}</span></h3>
                                    </div>
                                </div>
                            </div>
                            <div className='mid2'>
                                <img className='mid-img3' alt='' src={BBadge} />
                            </div>
                        </div>
                        <div className="seperator" />
                        <div className="profile-fot">
                            <div className='pr'>
                                <h1 className='title-f'>Last Game</h1>
                                <h3>{data.lastGame}</h3>
                            </div>
                            <div className="sep-s" />
                            <div className='pr'>
                                <h1 className='title-f'>Status</h1>
                                {!data.status ? <h3 className='on'>Online</h3> : <h3 className='off'>Offline</h3>}
                            </div>
                            <div className="sep-s" />
                            <div className='pr'>
                                <h1 className='title-f'>Progress</h1>
                                {
                                    data.lastGame === 'won' ? <h3 className='on prog'>+120<span className='on'>pts</span></h3> :
                                        data.lastGame === 'draw' ? <h3 className='on prog'>+60<span className='on'>pts</span></h3> :
                                            data.lastGame === 'lose' ? <h3 className='off prog'>-120<span className='off'>pts</span></h3> :
                                                <h3 className='prog'>--</h3>
                                }

                            </div>
                        </div>
                    </div>
                }
            </GradienBox>
        </div>
    )
}

export default ProfileHome