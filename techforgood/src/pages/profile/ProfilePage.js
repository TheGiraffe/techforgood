import {useSelector, useDispatch} from 'react-redux'

const ProfilePage = () => {
    const userData = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    return(
    <>
        <h1>Profile Page</h1>
        {userData.userName || userData.name || userData.email ? (
            <div>
                <h3>Username: @{userData.username}</h3>
                <h3>Name: {userData.name}</h3>
                <h3>Email: {userData.email}</h3>
            </div>
        ) : (
            <p>You are not logged in.</p>)}
    </>
    )
}

export default ProfilePage