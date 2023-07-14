import './Settings.scss'
function UserB() {
    return (
        <div className="userBlocked">
            <div className="infoUser">
                <img src="" alt="" />
                <p>npetter</p>
            </div>
            <button>
                <div className="unblockBTN">Unblock</div>
            </button>
        </div>
    )
}
function Blockedlist() {
    return (
        <div className='BlockedList'>
            <div className="Blocked-cont">
                <h1>Blocked Account</h1>
                <div className="blockedListC">
                    <div className="usersBlocked">
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                        <UserB />
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Blockedlist;