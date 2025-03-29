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
            <h1>Requests your or your org have made</h1>
                <table className="request-table" style={styles.requestTable}>
                    <thead>
                        <tr className="table-header-row" style={styles.tableHeaderRow}>
                            <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Title</th>
                            <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Description</th>
                            <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Date Created</th>
                            <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* looking in to createPortal. Without using react strap, we can create a modal to open to
                        might be better to display lengthy information like request descrition this way */}
                    {currentResults.map((request) => (
                        <tr key={request.id}>
                            <th scope='row' className='requestTitleHeader' style={styles.requestTitleHeader}>{request.title}</th>
                            <td>{request.description}</td>
                            <td>{new Date(request.created).toLocaleDateString()}</td>
                            <td className='actionsStyling' style={styles.actionsStyling}>
                                <button >Edit</button> 
                                {/* onClick={() => handleEdit(request.id)} */}
                                <button onClick={() => handleDelete(request.id)}>Delete</button>
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
        padding: '10px',
    },
    requestTitleHeader: {
        textTransform: 'capitalize',
        padding: '10px',
        fontWeight: 'bold',
    },
    actionsStyling: {
        display: 'flex',
        justifyContent: 'center',
        gap: '5px',
        padding: '5px',
    },
};

export default UserRequests;