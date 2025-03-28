import { useEffect, useState } from 'react';
import getRequests from '../../features/firebase/auth/getRequests';
import deleteRequest from '../../features/firebase/auth/deleteRequest';
import { useAuth } from '../../features/firebase/AuthProvider';

const UserRequests = () => {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                if (user) {
                    const data = await getRequests();
                    // Sort requests by most recent date to least recent date
                    const sortedData = data.sort((a, b) => new Date(b.created) - new Date(a.created));
                    setRequests(sortedData);
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

    const handleDelete = async (id) => {
        try {
            await deleteRequest(id); // Ensure this deletes from the requests collection
            setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        } catch (error) {
            setError(error);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = requests.slice(indexOfFirstResult, indexOfLastResult);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading requests: {error.message}</p>;
    if (!requests.length) return <p><strong>You have no requests. Click "Make a request" to start a new one.</strong></p>; // Render message if no requests

    return (
        <div>
            <h1>Requests</h1>
            {currentResults.map((request) => (
                <div key={request.id}>
                    <h2>{request.title}</h2>
                    <p>{request.description}</p>
                    <p>Submitted on: {new Date(request.created).toLocaleDateString()}</p>
                    <button onClick={() => handleDelete(request.id)}>Delete</button> {/* Add delete button */}
                </div>
            ))}
            <div>
                <p>Page {currentPage}</p>
                {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                {indexOfLastResult < requests.length && <button onClick={handleNextPage}>Next</button>}
            </div>
        </div>
    );
};

export default UserRequests;