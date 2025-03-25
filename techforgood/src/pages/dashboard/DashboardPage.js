import { useState, useEffect } from 'react';
import ProfilePage from '../profile/ProfilePage';
import RequestsPage from '../request/Requests'; // Import the new component

const Dashboard = () => {
    const [view, setView] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            // Simulate fetching user data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setView('profile'); // Set default view after fetching user data
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Add logout logic here
        console.log('User logged out');
    };

    return (
        <>
            <nav>
                <button 
                    style={view === 'profile' ? activeButtonStyle : buttonStyle} 
                    onClick={() => setView('profile')}
                >
                    Profile
                </button>
                <button 
                    style={view === 'requests' ? activeButtonStyle : buttonStyle} 
                    onClick={() => setView('requests')}
                >
                    Requests
                </button>
                <button 
                    style={buttonStyle} 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </nav>

            {view === 'profile' && (
                <section>
                    <ProfilePage />
                </section>
            )}

            {view === 'requests' && (
                <section>
                    <RequestsPage />
                </section>
            )}
        </>
    );
}

const buttonStyle = {
    cursor: 'pointer',
};

const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d0d0d0', // Darker gray for active state
};

export default Dashboard;