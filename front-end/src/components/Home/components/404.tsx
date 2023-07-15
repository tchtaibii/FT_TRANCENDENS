import { useEffect } from 'react';
import guyPong from './Pg.svg'
import { AppDispatch } from '../../../store/store'
import { setFalse } from '../../../features/isLoading';
import { useDispatch } from 'react-redux';
import BackToHome from './BackToHome'
function Error404() {
    const dispatch: AppDispatch = useDispatch()
    useEffect(() => {
        dispatch(setFalse());
    },[])

    return (
        <div className="E404">
            <h1>404</h1>
            <img src={guyPong} alt="404"  />
            <p>OOPS!! Something Went Wrong.</p>
            <BackToHome/>
        </div>
    )
}
export default Error404;