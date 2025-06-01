import { useEffect, useState } from 'react';
import { useAuth } from '../../features/firebase/AuthProvider';
import getBids from '../../features/firebase/auth/getBids';
import { Link, useNavigate } from 'react-router-dom';

const UserBids = () => {
    const { user, loading: authLoading } = useAuth();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;
    
    useEffect(() => {
        const fetchBids = async () => {
            try {
                if (user) {
                    const data = await getBids();
                    const sortedData = data.sort((a, b) => new Date(b.created) - new Date(a.created));
                    setBids(sortedData);
                } else {
                    setError(new Error('Not logged in!'));
                }
            } catch (error) {
                console.error('Error fetching bids:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchBids();
        }
    }, [user, authLoading]);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = bids.slice(indexOfFirstResult, indexOfLastResult);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading bids: {error.message}</p>;
    if (!bids.length) return <p><strong>You have no bids. Click "Search for work" to look for new volunteer opportunities.</strong></p>; // Render message if no requests


    return (
        <div>
            <h1>Here are bids that you have submitted</h1>
            <p>Click on your bid to view what you have submitted. The request you submitted the bid for can be navigated to from your expanded bid page.</p>
            <table style={styles.bidsTable}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th  style={styles.bidsTableHeader} scope='col'>Title</th>
                        <th  style={styles.bidsTableHeader} scope='col'>Request Title</th>
                        <th  style={styles.bidsTableHeader} scope='col'>Date Created</th>
                        <th  style={styles.bidsTableHeader} scope='col'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentResults.map((bids) => (
                        <tr key={bids.id}>
                            <th scope='row' style={styles.bidsTitleHeader}>{bids.title}</th>
                            <td><Link to={{ pathname: `../search/expanded/${bids.requestId}` }}>{bids.requestTitle}</Link></td>
                            <td>{new Date(bids.created).toLocaleDateString()}</td>
                            <td style={styles.actionsStyling}>
                                <button onClick={() => {navigate(`/bids/view/${bids.id}`)}}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p>Page {currentPage}</p>
                {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                {indexOfLastResult <bids.length && <button onClick={handleNextPage}>Next</button>}
            </div>
        </div>

    );
}

const styles = {
    bidsTable: {
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
    bidsTableHeader: {
        fontSize: '18px',
        padding: '10px 20px', // Add horizontal padding for spacing
    },
    bidsTitleHeader: {
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

export default UserBids;