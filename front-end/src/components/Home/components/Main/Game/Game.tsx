import './Game.scss'
import Table from './Table'
import Hk from '../../../../../assets/img/Hk.webp'
import GradienBox from '../../../../../tools/GradienBox'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

function Game({isBlackHole} : {isBlackHole : boolean}) {

    const admin = useSelector((state: any) => state.admin);
    const [leftscore, setLeftScore] = useState(0);
    const [rightscore, setRightScore] = useState(0);

    const scoreL = Array.from({ length: leftscore / 2 }, (_, index) => (
        <div key={index + '-goal'} className="goal"></div>
    ));
    const scoreR = Array.from({ length: rightscore / 2 }, (_, index) => (
        <div key={index + '-goal'} className="goal"></div>
    ));
    useEffect(() => {
        const handleArrowKeys = (e:any) => {
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
    return (
        <div className='GameContainer'>
            <GradienBox mywidth="1201px" myheight="815px" myborder="40px">
                <div className="gameContent">
                    <div className="gameHeader">
                        <div className="Player">
                            <img src={admin.avatar} />
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
        </div >

    )
}
export default Game;