import { useState, useEffect } from 'react';
import ProfilePage from './profile/ProfilePage';
import UserRequests from '../request/Requests';
import RequestForm from '../request/RequestForm';
import UserBids from '../bids/Bids';

// imports for useeffect to grab components needed to conditionally render buttons
import getUserProfile from "../../features/firebase/auth/getUserProfile";
import { useAuth } from '../../features/firebase/AuthProvider';

const Dashboard = () => {
    const {user, loading: authLoading} = useAuth();
    const [view, setView] = useState('');
    const [ userType, setUserType ] = useState(''); 

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.uid && !authLoading) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setView('profile'); //loads profile page as default view
                // fetches user data and sets the userType state for conditional rendering of buttons
                try {
                    const userData = await getUserProfile();
                    if (userData) {
                        setUserType(userData.accountType);
                    }
                    // console.log('userType:', userData.accountType);
                }
                catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, [user, authLoading]);


    return (
        <>
            <nav>
                <br />
                <button 
                    style={view === 'profile' ? activeButtonStyle : buttonStyle} 
                    onClick={() => setView('profile')}
                >
                    My Profile
                </button>
                {userType === 'organization' && (
                <button 
                    style={view === 'requests' ? activeButtonStyle : buttonStyle} 
                    onClick={() => setView('requests')}
                >
                    Org Requests
                </button>
                )}           

                {userType === 'organization' && (
                <button
                    style={view === 'MakeARequest' ? activeButtonStyle : buttonStyle}
                    onClick={() => setView('MakeARequest')}
                >
                    Make a request
                </button>
                )}

                {userType === 'volunteer' && (
                <button
                    style={view === 'MyBids' ? activeButtonStyle : buttonStyle}
                    onClick={() => setView('MyBids')}
                >
                    My Bids
                </button>
                )}

            </nav>

            {view === 'profile' && (
                <section>
                    <ProfilePage />
                </section>
            )}

            {view === 'requests' && userType ==='organization' && (
                <section>
                    <UserRequests />
                </section>
            )}

            {view === 'MakeARequest' && userType === 'organization' && (
                <section>
                    <RequestForm />
                </section>
            )}

            {view === 'MyBids' && userType ==='volunteer' && (
                <section>
                    <UserBids />
                </section>
            )}
        </>
    );
}

const buttonStyle = {
    cursor: 'pointer',
    margin: '5px',
};

const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d0d0d0', // Darker gray for active state
};

export default Dashboard;