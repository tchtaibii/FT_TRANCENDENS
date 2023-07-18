import { useEffect, useRef, useState } from 'react'
import './LeaderBoard.scss'
import { useOnClickOutside } from 'usehooks-ts';
import GradienBox from '../../../../../tools/GradienBox'
import { useDispatch } from 'react-redux';
// import trophet from './trophet.svg';
import medaille from './medaille.svg'
import defaultAvatar from '../../../../../assets/img/avatar.png'
import axios from '../../../../../Interceptor/Interceptor'
import { AppDispatch } from '../../../../../store/store'
import { setFalse, setTrue } from '../../../../../features/isLoading';
import Iaward from "../../../../../assets/img/award.svg"
// import gold from "../../../../../assets/img/Gold.svg"
import Silver from "../../../../../assets/img/silver.svg"
import Bronze from "../../../../../assets/img/bronze.svg"


const Down = () => (
    <svg width="1.188rem" height="0.813rem" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 2L8.978 10.5L16.9545 2" stroke="white" stroke-width="2.2" stroke-linecap="round" />
    </svg>

)

function LeaderBoard() {
    const ref = useRef(null);
    const [isHighest, setisHighest] = useState(true);
    const [isfilter, setisfilter] = useState(false);
    const handleClickOutside = () => { setisfilter(false) }
    useOnClickOutside(ref, handleClickOutside)
    function FiltredC() {
        return (
            <div className="filterSide">
                <div className="filterSide-C">
                    <div>
                        <input checked={!isHighest} type="radio" name="filter" id="FriendsLB" onChange={() => {
                            setisHighest((e) => !e);
                        }} />
                        <label htmlFor="FriendsLB"></label>
                        Friends
                    </div>
                    <div>
                        <input checked={isHighest} type="radio" name="filter" id="Highest-RatedLB" onChange={() => {
                            setisHighest(true);
                        }} />
                        <label htmlFor="Highest-RatedLB"></label>
                        Highest-Rate
                    </div>
                </div>
            </div>
        )
    }

    // function SelectOptions() {
    //     return (
    //         <div className='divZ' ref={ref}>
    //             <button onClick={() => {
    //                 setisfilter(!isfilter);
    //             }} className="filterC">

    //                 <div className="filterIn">
    //                     Filter by
    //                     <Down />
    //                 </div>
    //             </button>
    //             {isfilter && <FiltredC />}
    //         </div>

    //     )
    // }
    const RankC = (props:any)  => {

        return (
            <div className="RankPlayer">
                <div className="index">{props.i + 1}.</div>
                <img src={(props.i === 0 ? medaille : props.i === 1 ? Silver : props.i === 2 ? Bronze : Iaward )} alt="" className="medaille" />
                <img className='avatarRank' onError={(e:any) => {
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
    useEffect(()=>{
        dispatch(setTrue());
        const fetchData = () => {
            axios.get('/Home/Best6Players').then((resp:any) => {
                setData(resp.data);
                dispatch(setFalse());
            })
        }

        fetchData();
    },[])
    return (
        <div className="leaderboard-container">
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
                            Data.map((e,i)=> <RankC user={e} i={i} key={'user' + i} />)
                        }
                    </div>
                </GradienBox>
            </div>
        </div>
    )
}
export default LeaderBoard;