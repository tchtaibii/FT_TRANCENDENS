import "./Search.scss"
import SearImg from "../../../../assets/img/search.svg"
import defaultAvatar from "../../../../assets/img/avatar.png"
import GradienBox from '../../../../tools/GradienBox'
import Awardtest from './testBadge.svg'
import { useState, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { Link } from 'react-router-dom'
import axios from '../../../../Interceptor/Interceptor'

function SearchContent(props: any) {
	const SimpeLoop = () => {
		console.log('user ound', props.userFound);
		const elements = props.userFound.map((e: any, i:number) =>
			<Link to={`/profile/${e.username}`} key={'userFound-' + i} className="found">
				<div className={'f-part1 ' + (e.status === true ? "user-active-search" : "user-desactive-search")}>
					<img onError={(e) => {
					console.log(e.target);
					e.target.src = defaultAvatar;
				}
				}  src={e.avatar} alt="" />
					<div className="textInfo">
						<h4>{e.username}</h4>
						<p>{'LEVEL ' + e.level}</p>
					</div>
				</div>
				<div className="f-part2">
					<img src={Awardtest} alt="" />
				</div>
			</Link>
		)
		return elements
	}
	return (
		<div className="SearchContent">{
			props.userFound.length > 0 ? SimpeLoop() :
			'No User Found!'
		}
		</div>
	);
}

function Search() {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(null)
	// const users: any = useSelector((state: any) => state.users.users);
	const [userFound, setUserFound] = useState([]);
	const handleClickOutside = () => {
		setIsVisible(false)
	}
	useOnClickOutside(ref, handleClickOutside);
	function handleChange(event: any) {
		const value = event.target.value;
		if (value.length == 0)
		{
			setUserFound([]);
			setIsVisible(false)
		}
		else
		{
			const newUsers = async () => {
				await axios.post('/search', {user: value}).then((resp:any) => setUserFound(resp.data))
				setIsVisible(true)
			}
			newUsers();
			// if (newUsers.length == 0)
			// 	setIsVisible(false)
			// else
			// {
			// 	setUserFound(newUsers);
			// }
		}
	}
	return (
		<>
			{
				isVisible &&
				<div ref={ref} className="searchC">
					<SearchContent userFound={userFound} />
				</div>
			}
			<div ref={ref} className="searchI  nput">
				<GradienBox className="" mywidth="369px" myheight="49px" myborder="20px">
					<div className='cont'>
						<input onChange={handleChange} type='text' placeholder='Search...' className='search-input' />
						<button className='search-btn'>
							<img src={SearImg} alt="search" />
						</button>
					</div>
				</GradienBox>
			</div>
		</>
	)

}

export default Search