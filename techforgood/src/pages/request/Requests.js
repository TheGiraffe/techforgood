import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getRequests from '../../features/firebase/auth/getRequests';
import deleteRequest from '../../features/firebase/auth/deleteRequest';
import { useAuth } from '../../features/firebase/AuthProvider';
import UpdateRequestModal from './UpdateRequestModal'; // Import the modal component

const UserRequests = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect

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
    
    const viewBids = (requestId) => {
        navigate(`/bids/request?=${requestId}`);
    };

    const handleEdit = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
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
            <h1>Requests you or your organization have made</h1>
            {successMessage && (
                <p
                    style={{
                        color: 'green',
                        marginBottom: '10px',
                        opacity: fadeOut ? 0 : 1, // Apply fade-out effect
                        transition: 'opacity 1s ease-in-out', // Smooth transition
                    }}
                >
                    {successMessage}
                </p>
            )}
                <table style={styles.requestTable}>
                    <thead>
                        <tr style={styles.tableHeaderRow}>
                            <th  style={styles.requestTableHeader} scope='col'>Title</th>
                            <th  style={styles.requestTableHeader} scope='col'>Description</th>
                            <th  style={styles.requestTableHeader} scope='col'>Keywords</th>
                            <th  style={styles.requestTableHeader} scope='col'>Date Created</th>
                            <th  style={styles.requestTableHeader} scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentResults.map((request) => (
                            <tr key={request.id}>
                                <th scope='row' style={styles.requestTitleHeader}>{request.title}</th>
                                <td>
                                    {request.description.length > 50 ? (
                                        <span
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                            onClick={() => handleEdit(request)}
                                        >
                                            {request.description.substring(0, 100)}...
                                        </span>
                                    ) : (
                                        request.description
                                    )}
                                </td>
                                <td>{request.keywords ? request.keywords.join(', ') : 'N/A'}</td>
                                <td>{new Date(request.created).toLocaleDateString()}</td>
                                <td style={styles.actionsStyling}>
                                    <button onClick={() => handleEdit(request)}>Edit</button>
                                    <button onClick={() => handleDelete(request.id)}>Delete</button>
                                    <button onClick={() => viewBids(request.id)}>View Bids</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            <div>
                <p>Page {currentPage}</p>
                {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                {indexOfLastResult < requests.length && <button onClick={handleNextPage}>Next</button>}
            </div>
            {isModalOpen && (
                <UpdateRequestModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    modalContent={selectedRequest} // Ensure selectedRequest is passed here
                    onSubmit={(updatedRequest) => {
                        setRequests((prevRequests) =>
                            prevRequests.map((request) =>
                                request.id === updatedRequest.id ? updatedRequest : request
                            )
                        );
                        setSuccessMessage('Your request has been updated'); // Set success message
                        console.log('Request updated successfully'); // Log message to console
                        setFadeOut(false); // Reset fade-out state
                        setTimeout(() => setFadeOut(true), 9000); // Start fade-out after 9 seconds
                        setTimeout(() => setSuccessMessage(''), 10000); // Clear the message after 10 seconds
                        closeModal();
                    }}
                />
            )}
        </div>
    );
};

const styles = {
    requestTable: {
        collumns: '10',
        borderTop: '1px solid black',
        borderBottom: '1px solid black',
        margin: '0 auto',
        width: '60%',
        borderCollapse: 'collapse',
    },
    tableHeaderRow: {
        backgroundColor: '#f2f2f2',
        borderBottom: '1px solid black',
    },
    requestTableHeader: {
        fontSize: '18px',
        padding: '10px 20px', // Add horizontal padding for spacing
    },
    requestTitleHeader: {
        textTransform: 'capitalize',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'left', // Align text to the left
        verticalAlign: 'bottom', // Justify content to the left
    },
    actionsStyling: {
        gap: '5px',
        padding: '5px 20px', // Add horizontal padding for spacing
    },
};

export default UserRequests;