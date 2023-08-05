import './Game.scss'
import Table from './Table'
import Hk from '../../../../../assets/img/Hk.webp'
import GradienBox from '../../../../../tools/GradienBox'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import defaultAvatar from '../../../../../assets/img/avatar.png'
import emojiLose from '../../../../../assets/img/lose.svg'
import emojiWin from '../../../../../assets/img/win.svg'
import { useNavigate } from 'react-router-dom'


function Game({ isBlackHole }: { isBlackHole: boolean }) {

    const admin = useSelector((state: any) => state.admin);
    const [leftscore, setLeftScore] = useState(0);
    const [rightscore, setRightScore] = useState(0);

    const scoreL = Array.from({ length: Math.floor(leftscore / 2) }, (_, index) => (
        <div key={index + '-goal'} className="goal"></div>
    ));
    const scoreR = Array.from({ length: Math.floor(rightscore / 2) }, (_, index) => (
        <div key={index + '-goal'} className="goal"></div>
    ));
    useEffect(() => {
        const handleArrowKeys = (e: any) => {
            // Disable arrow key scrolling (left, right, up, down)
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
            }
        };

        // Add the event listener when the component mounts
        window.addEventListener('keydown', handleArrowKeys);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleArrowKeys);
        };
    }, []);
    const [isDone, setDone] = useState(false);

    const [isWin, setWin] = useState(false);
    useEffect(() => {
        if (Math.floor(leftscore / 2) === 5 || Math.floor(rightscore / 2) === 5) {
            setWin((Math.floor(leftscore / 2) ) === 5);
            setDone(true);
        }
    }, [leftscore, rightscore])
    const navigate = useNavigate();
    return (
        <div style={{ position: 'relative' }} className='GameContainer'>
            <GradienBox mywidth="1201px" myheight="815px" myborder="40px">
                <div className="gameContent">
                    <div className="gameHeader">
                        <div className="Player">
                            <img src={admin.avatar ? admin.avatar : defaultAvatar} />
                            <div className="scoreUser">
                                <p>{admin.username}</p>
                                <div className="score">
                                    {scoreL}
                                </div>
                            </div>
                        </div>
                        <div className="Player Player2">
                            <img src={Hk} />
                            <div className="scoreUser">
                                <p style={{ display: 'flex', flexDirection: 'row-reverse' }}>HK-47</p>
                                <div style={{ flexDirection: 'row-reverse' }} className="score">
                                    {scoreR}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="Tablecont">
                        <div className="TableC">
                            <Table isBlackHole={isBlackHole} leftscore={leftscore} setLeftScore={setLeftScore} rightscore={rightscore} setRightScore={setRightScore} />
                        </div>
                    </div>
                </div>
            </GradienBox >
            {
                isDone &&
                <div className="gamePopup">
                    <div style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className={isWin ? "statusGame" : "statusGame lose"}>
                        <img style={{ width: '6.25rem', height: '6.25rem' }} className='emoji' src={(isWin ? emojiWin : emojiLose)} alt="" />
                        <h1>{(isWin ? 'WIN' : 'LOSE')}</h1>
                        <div style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className="vs">
                            <div className="player">
                                <img src={admin.avatar ? admin.avatar : defaultAvatar} alt="" />
                                <p>{admin.username}</p>
                            </div>
                            <div style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className="vsC">VS</div>
                            <div style={{ flexDirection: 'row-reverse' }} className="player">
                                <img src={Hk} alt="" />
                                <p>HK-47</p>
                            </div>
                        </div>
                        <div className="scoreN">
                            <div style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className="numberScore">{Math.floor(leftscore / 2)}</div>
                            <div style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className="numberScore">{Math.floor(rightscore / 2)}</div>
                        </div>
                        <div style={{ color: (isWin ? '#25B2A4' : '#E15253') }} className="pointsScore">{isWin ? '+0 Points' : '-0 Points'}</div>
                        <button onClick={() => {
                            navigate('/')
                        }} style={{ borderColor: (isWin ? '#25B2A4' : '#E15253') }} className='returnFromGame'>Return Home</button>
                    </div>
                </div>
            }

        </div >

    )
}
export default Game;