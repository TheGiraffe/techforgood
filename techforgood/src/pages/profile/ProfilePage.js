import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'

const ProfilePage = () => {
    const userData = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const history = useHistory();

    if(!userData) {
        history.push('/login');
    }

    return(
    <>
        <h1>Profile Page</h1>
        <div>
            <h3>Username: @{userData.username}</h3>
            <h3>Name: {userData.name}</h3>
            <h3>Email: {userData.email}</h3>
        </div>
    </>
    )
}

export default ProfilePage
