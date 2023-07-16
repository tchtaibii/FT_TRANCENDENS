import Login from './components/Login/Login';
import './App.scss';
import Home from './components/Home/Home';
import { useEffect, useState } from 'react'
import Particle from './tools/ParticalComponent';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from "./store/store"
import {getAdmin} from "./features/adminSlice"

function App() {
// const data:any = useSelector((state:any) => state.admin)
const dispatch: AppDispatch = useDispatch();
	const [isLogin, setisLogin] = useState(false);
	useEffect(() => {
		const token = Cookies.get('isAuthenticated');
		// console.log(token);
		if (token === 'true') {
			setisLogin(true);
		}
		const fetchData = async () => {
			await dispatch(getAdmin());
			// console.log('app', data);
			// await dispatch(getNotification());
			// await dispatch(getMessage());
		};
        fetchData();
	},[]);

	return (
		<div className="App">
			<Particle />
			{
				!isLogin ? <Login /> : <Home />
			}
		</div>
	);
}

export default App;