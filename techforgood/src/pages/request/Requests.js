import { useEffect, useState } from 'react';
import getRequests from '../../features/firebase/auth/getRequests';
import { useAuth } from '../../AuthProvider';

const UserRequests = () => {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if (user) {
                    const data = await getRequests();
                    setRequests(data);
                } else {
                    setError(new Error('Not logged in!'));
                }
            }
            catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchRequests();
        }
    }, [user, authLoading]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading requests: {error.message}</p>;

    return (
        <div>
            <h1>Requests</h1>
            {requests.map((request) => (
                <div key={request.id}>
                    <h2>{request.title}</h2>
                    <p>{request.description}</p>
                    <p>Submitted on: {new Date(request.created).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default UserRequests;