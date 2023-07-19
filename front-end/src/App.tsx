import Login from './components/Login/Login';
import './App.scss';
import Home from './components/Home/Home';
import { useEffect, useState } from 'react'
import Particle from './tools/ParticalComponent';
import Cookies from 'js-cookie';
import axios from './Interceptor/Interceptor'
import { seIsDown } from './features/ServerDown'
import { useSelector } from 'react-redux';
import Loading from './components/Loading';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store'
import Secure from './Secure';


function App() {
	// const data:any = useSelector((state:any) => state.admin)
	const dispatch: AppDispatch = useDispatch()
	const [isLogin, setisLogin] = useState(false);
	const [isSecure, setSecure] = useState(false);
	const [isDown, setIsDown] = useState(false);
	const isDownState = useSelector((state: any) => state.isDown);
	console.log(isDownState.isDown);
	useEffect(() => {
		const tesServer = async () => {
			if (isDownState.isDown === true) {
				await axios.get('/').then((resp) => {
					dispatch(seIsDown(false));
				}).catch(error => {
					// console.log('hgdggsdgdsg')
					// if (error.request)
					dispatch(seIsDown(true));
					// tesServer();
				})
			}

		}
		tesServer();
		const token = Cookies.get('isAuthenticated');
		// console.log(token);
		if (token === 'true') {
			setisLogin(true);
		}
	}, []);
	useEffect(() => {
		setIsDown(isDownState.isDown);
	}, [isDownState.isDown])


	useEffect(() => {
		const CheckFa = async () => {
			await axios.get('/auth/isFA-enabled').then((rsp) => setSecure(rsp.data.FA_ON))
		}
		CheckFa();
	},[isLogin])
	console.log(isDown)
	return (
		<div className="App">
			<Particle />
			{
				isDown ? <Loading /> :
					!isLogin ? <Login /> : (!isSecure ? <Home /> : <Secure setSec={setSecure} />)
			}
		</div>
	);
}

export default App;