
import "./Home.scss"
import LeftBar from './components/LeftBar'
import Main from './components/Main'
import { BrowserRouter as Router, Outlet } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "../../store/store"
import { getAdmin } from "../../features/adminSlice"
import { get2FA } from "../../features/2FA"
import { useEffect } from 'react'
function Home() {

  const dispatch: AppDispatch = useDispatch();
  const DataLoader = useSelector((state:any)=> state.admin).isLoader;
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAdmin());
      await dispatch(get2FA());
      if (!DataLoader)
        fetchData();
    };
    fetchData();
  }, []);
  var IsLoading = useSelector((state: any) => (state.isLoading)).isLoading;
  return (
    <div className='Home'>
      <Router>
        {IsLoading && DataLoader && <Loading />}
        <div className="container-home">
          <LeftBar />
          <Main />
          <Outlet />
        </div>
      </Router>
    </div>
  );
}

export default Home