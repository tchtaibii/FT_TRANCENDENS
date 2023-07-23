import { useEffect, useState } from 'react'
import './LeaderBoard.scss'
import GradienBox from '../../../../../tools/GradienBox'
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion'
import medaille from '../../../../../assets/img/Gold.svg'
import defaultAvatar from '../../../../../assets/img/avatar.png'
import axios from '../../../../../Interceptor/Interceptor'
import { AppDispatch } from '../../../../../store/store'
import { setFalse, setTrue } from '../../../../../features/isLoading';
import Iaward from "../../../../../assets/img/award.svg"
import Silver from "../../../../../assets/img/silver.svg"
import Bronze from "../../../../../assets/img/bronze.svg"



function LeaderBoard() {
    const RankC = (props: any) => {

        return (
            <div className="RankPlayer">
                <div className="index">{props.i + 1}.</div>
                <img src={(props.i === 0 ? medaille : props.i === 1 ? Silver : props.i === 2 ? Bronze : Iaward)} alt="" className="medaille" />
                <img className='avatarRank' onError={(e: any) => {
                    console.log(e.target);
                    e.target.src = defaultAvatar;
                }
                } src={props.user.avatar} alt="" />
                <div className="username">{props.user.username}</div>
                <div className="pointsRank">{props.user.XP}pts</div>
                <div className="ratingRank">{(props.user.rating !== "NaN" ? props.user.rating : '--')}</div>
            </div>
        );
    }
    const dispatch: AppDispatch = useDispatch()
    const [Data, setData] = useState([]);
    useEffect(() => {
        dispatch(setTrue());
        const fetchData = () => {
            axios.get('/Home/Best6Players').then((resp: any) => {
                setData(resp.data);
                dispatch(setFalse());
            })
        }

        fetchData();
    }, [])
    return (
        <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ duration: 0.4}}
            style={{marginTop: '5rem'}}
            className="leaderboard-container">
            <div className="headerLb">
                <h1>Ranking</h1>
                {/* <SelectOptions /> */}
            </div>
            <div className="Ranking-container">
                <div className="headerRank">
                    <div><p>Position</p><p>Username</p></div>
                    <div><p>points</p><p>rating</p></div>
                    {/* <img className='trophetR' src={trophet} alt="Ranking" /> */}
                </div>
                <GradienBox mywidth="1201px" myheight="710px" myborder="40px">
                    <div className="BigRank">
                        {
                            Data.map((e, i) => <RankC user={e} i={i} key={'user' + i} />)
                        }
                    </div>
                </GradienBox>
            </div>
        </motion.div>
    )
}
export default LeaderBoard;