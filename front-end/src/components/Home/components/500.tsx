import { useEffect } from 'react';
import guyPong from './Pg.svg'
import { AppDispatch } from '../../../store/store'
import { setFalse } from '../../../features/isLoading';
import { useDispatch } from 'react-redux';
import BackToHome from './BackToHome'
function Error500() {
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        dispatch(setFalse());
    },[])

    return (
        <div className="E404">
            <h1>500</h1>
            <img src={guyPong} alt="404"  />
            <p>Please Take A Break And Try Again!</p>
            {/* <BackToHome/> */}
        </div>
    )
}
export default Error500;