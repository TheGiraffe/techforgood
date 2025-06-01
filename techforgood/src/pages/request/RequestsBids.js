import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getBidsByRequestId } from '../../features/firebase/auth/getBids';
import { getShortlistedBidIds } from '../../features/utils/shortlist';

const RequestsBids = () => {
    const { requestId, requestTitle } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shortlistedBidIds, setShortlistedBidIds] = useState([]);
    
    // hover state management
    const [hoveredBidIndex, setHoveredBidIndex] = useState(null);
    const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);

    const requestData = location.state?.requestData || null;

    useEffect(() => {
        const fetchBidsAndShortlist = async () => {
            try {
                setLoading(true);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (requestId) {
                    const [bidsData, shortlistedIds] = await Promise.all([
                        getBidsByRequestId(requestId),
                        getShortlistedBidIds(requestId)
                    ]);
                    
                    setBids(bidsData);
                    setShortlistedBidIds(shortlistedIds);
                }
            } catch (err) {
                console.error('Error fetching bids and shortlist:', err);
                setError('Failed to load bids. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchBidsAndShortlist();
    }, [requestId, requestTitle]);

    const viewBidDetails = (bidId) => {
        navigate(`/requests/${requestId}/bids/${bidId}`, {
            state: {
                bid: bids.find(bid => bid.id === bidId),
                requestData: requestData,
                requestId: requestId
            }
        });
    };


    const isBidShortlisted = (bidId) => {
        return shortlistedBidIds.includes(bidId);
    };

    if (loading) {
        return <p>Loading bids...</p>;
    }
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <h1>Bids for request: 
                <br />{requestData?.title.charAt(0).toUpperCase() + requestData?.title.slice(1)}</h1>
            <p>Click on a bid to view what the volunteer has submitted. If you like what the volunteer has submitted in their proposal, you can shortlist them to a list of candidates.</p>
            <p>From this shortlist, you can accept a bid and request for the volunteer's contact info.</p>
            {bids.length === 0 ? (
                <p style={styles.noBids}>No bids have been submitted to this request yet.</p>
            ) : (
                <div style={styles.bidsContainer}>
                    {bids.map((bid, index) => (
                        <div
                            key={bid.id}    
                            style={{
                                ...styles.bidCard,
                                backgroundColor: hoveredBidIndex === index ? '#f5f5f5' : '#fff',
                                transform: hoveredBidIndex === index ? 'scale(1.025)' : 'scale(1)',
                                zIndex: hoveredBidIndex === index ? 2 : 1,
                                boxShadow: hoveredBidIndex === index
                                    ? '0 4px 16px rgba(0,0,0,0.15)'
                                    : '0 2px 4px rgba(0,0,0,0.1)',
                                borderLeft: isBidShortlisted(bid.id) ? '5px solid #0a8d5f' : '1px solid #e0e0e0',
                            }}
                            onMouseEnter={() => setHoveredBidIndex(index)}
                            onMouseLeave={() => setHoveredBidIndex(null)}
                        >
                            {/* shortlist indicator badge */}
                            {isBidShortlisted(bid.id) && (
                                <div style={styles.shortlistBadge}>
                                    ✓ Shortlisted
                                </div>
                            )}
                            
                            <h3>{bid.title}</h3>
                            <p style={styles.bidProposal}>
                                {bid.proposal.length > 50
                                ? (
                                    <>
                                        {bid.proposal.substring(0, 50)}
                                        <span onClick={() => viewBidDetails(bid.id)} 
                                        style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}>...See More</span>
                                    </>
                                ) 
                                    : bid.proposal
                                }
                            </p>
                            <p style={styles.timeline}>Timeline: {bid.timeline}</p>
                            
                            {/* containers to keep these on the same row as button */}
                            <div style={styles.linksButtonContainer}>
                                <div style={styles.linksContainer}>
                                    <p style={styles.links}>Links: {bid.links}</p>
                                    <p style={styles.teamMembers}>Team Members: {bid.teamMembers.join(', ')}</p>
                                </div>
                                <button
                                    style={{
                                        ...styles.seeMoreButton,
                                        backgroundColor: hoveredButtonIndex === index ? '#085a47' : '#0a8d5f', // Darker green on hover
                                        transform: hoveredButtonIndex === index ? 'scale(1.05)' : 'scale(1)', // Slight scale on hover
                                    }}
                                    onClick={() => viewBidDetails(bid.id)}
                                    onMouseEnter={() => setHoveredButtonIndex(index)}
                                    onMouseLeave={() => setHoveredButtonIndex(null)}
                                >
                                    See More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    noBids: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '40px',
    },
    bidsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '20px',
    },
    bidCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        background: '#fff',
        transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.2s',
        position: 'relative',
    },
    shortlistBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#0a8d5f',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 10,
    },
    bidProposal: {
        color: '#666',
        lineHeight: '1.5',
        marginBottom: '10px',
        textAlign: 'left',
    },
    timeline: {
        fontWeight: 'bold',
        color: '#0a8d5f',
        marginBottom: '10px',
    },
    linksButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '10px',
    },
    linksContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        flex: 1,
    },
    links: {
        color: '#1976d2',
        wordBreak: 'break-all',
        margin: '0 0 10px 0', 
        textAlign: 'left',
    },
    teamMembers: {
        textAlign: 'left',
        fontStyle: 'italic',
        color: '#555',
        margin: '0', 
    },
    seeMoreButton: {
        backgroundColor: '#0a8d5f',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s, transform 0.2s', // Added transform transition
        marginTop: '0',
        alignSelf: 'flex-start',
        flexShrink: 0,
        marginRight: '-8px',
    },
};   

export default RequestsBids;