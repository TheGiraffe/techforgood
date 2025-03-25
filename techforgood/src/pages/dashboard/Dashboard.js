import { useState } from 'react';
import ProfilePage from '../profile/ProfilePage';
import SubmittedRequestsPage from '../request/SubmittedRequestsPage'; // Import the new component

const Dashboard = () => {
    const [view, setView] = useState('profile');

    return (
        <>
            <nav>
                <button onClick={() => setView('profile')}>Profile</button>
                <button onClick={() => setView('requests')}>Requests</button>
            </nav>

            {view === 'profile' && (
                <section>
                    <h2>Profile Information</h2>
                    <ProfilePage />
                </section>
            )}

            {view === 'requests' && (
                <section>
                    <h2>Your Requests</h2>
                    <SubmittedRequestsPage /> {/* Add submitted requests display logic here */}
                </section>
            )}
        </>
    );
}

export default Dashboard;