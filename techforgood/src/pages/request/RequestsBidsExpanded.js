import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addBidToShortlist, isBidShortlisted, removeBidFromShortlist } from '../../features/utils/shortlist';

const RequestsBidsExpanded = () => {
    const {requestId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const bid = location.state?.bid;
    const requestData = location.state?.requestData;
    
    const [isShortlisting, setIsShortlisting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [shortlistMessage, setShortlistMessage] = useState('');
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    // check for bid shortlist status on load
    useEffect(() => {
        const checkShortlistStatus = async () => {
            if (requestId && bid?.id) {
                try {
                    setIsCheckingStatus(true);
                    const isAlreadyShortlisted = await isBidShortlisted(requestId, bid.id);
                    setIsShortlisted(isAlreadyShortlisted);
                } catch (error) {
                    console.error('Error checking shortlist status:', error);
                } finally {
                    setIsCheckingStatus(false);
                }
            } else {
                setIsCheckingStatus(false);
            }
        };

        checkShortlistStatus();
    }, [requestId, bid?.id]);

    const goBack = () => {
        navigate(`/requests/${requestId}/bids`, {
            state: {
                requestData: requestData
            }
        });
    }

    const handleShortlist = async () => {
        try {
            setIsShortlisting(true);
            setShortlistMessage('');
            
            // console.log('Adding bid to shortlist:', bid.id, 'for request:', requestId);
            
            await addBidToShortlist(requestId, bid.id);
            
            setIsShortlisted(true);
            setShortlistMessage('Volunteer added to shortlist!');
            
            setTimeout(() => {
                setShortlistMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('Error shortlisting bid:', error);
            if (error.message.includes('already in shortlist')) {
                setShortlistMessage('This volunteer is already in your shortlist.');
                setIsShortlisted(true);
            } else {
                setShortlistMessage('Failed to add to shortlist. Please try again.');
            }
            
            setTimeout(() => {
                setShortlistMessage('');
            }, 3000);
        } finally {
            setIsShortlisting(false);
        }
    };

    const handleRemoveFromShortlist = async () => {
        try {
            setIsRemoving(true);
            setShortlistMessage('');
            
            // console.log('Removing bid from shortlist:', bid.id, 'for request:', requestId);
            
            await removeBidFromShortlist(requestId, bid.id);
            
            setIsShortlisted(false);
            setShortlistMessage('Volunteer removed from shortlist.');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setShortlistMessage('');
            }, 3000);
            
        } catch (error) {
            console.error('Error removing bid from shortlist:', error);
            setShortlistMessage('Failed to remove from shortlist. Please try again.');
            
            setTimeout(() => {
                setShortlistMessage('');
            }, 3000);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={goBack} style={styles.backButton}>← Back to Bids</button>
                <h2 style={styles.pageTitle}>Bid Details for request: {requestData?.title.charAt(0).toUpperCase() + requestData?.title.slice(1)}</h2>
            </div>
            
            {/* Success/Error Message */}
            {shortlistMessage && (
                <div style={{
                    ...styles.message,
                    backgroundColor: shortlistMessage.includes('added') || shortlistMessage.includes('shortlist!') ? '#d4edda' : '#f8d7da',
                    color: shortlistMessage.includes('added') || shortlistMessage.includes('shortlist!') ? '#155724' : '#721c24',
                    borderColor: shortlistMessage.includes('added') || shortlistMessage.includes('shortlist!') ? '#c3e6cb' : '#f5c6cb'
                }}>
                    {shortlistMessage}
                </div>
            )}
            
            {bid ? (
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h1 style={styles.bidTitle}>{bid.title}</h1>
                    </div>
                    
                    <div style={styles.cardContent}>
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Proposal</h3>
                            <p style={styles.sectionContent}>{bid.proposal}</p>
                        </div>

                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Timeline</h3>
                            <p style={styles.timelineContent}>{bid.timeline}</p>
                        </div>

                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Links</h3>
                            <a href={bid.links} target="_blank" rel="noopener noreferrer" style={styles.linkContent}>
                                {bid.links}
                            </a>
                        </div>

                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Team Members</h3>
                            <p style={styles.sectionContent}>
                                {bid.teamMembers?.join(', ') || 'None specified'}
                            </p>
                        </div>
                    </div>

                    <div style={styles.cardFooter}>
                        {/* shows shortlist button if bid not on shortlist */}
                        {!isShortlisted && (
                            <button 
                                style={{
                                    ...styles.shortlistButton,
                                    cursor: isShortlisting || isCheckingStatus ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handleShortlist}
                                disabled={isShortlisting || isCheckingStatus}
                            >
                                {isCheckingStatus ? 'Checking...' : 
                                 isShortlisting ? 'Adding...' : 'Shortlist Volunteer'}
                            </button>
                        )}

                        {/* shows remove from shortlist button only if bid is shortlisted */}
                        {isShortlisted && (
                            <button 
                                style={{
                                    ...styles.removeButton,
                                    cursor: isRemoving || isCheckingStatus ? 'not-allowed' : 'pointer'
                                }}
                                onClick={handleRemoveFromShortlist}
                                disabled={isRemoving || isCheckingStatus}
                            >
                                {isCheckingStatus ? 'Checking...' : 
                                 isRemoving ? 'Removing...' : 'Remove from Shortlist'}
                            </button>
                        )}

                        <button style={styles.contactButton}>Request Contact Info</button>
                    </div>
                </div>
            ) : (
                <div style={styles.errorCard}>
                    <h2>Bid Not Found</h2>
                    <p>The bid details could not be loaded.</p>
                </div>
            )}
        </div>
    );  
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    pageTitle: {
        margin: '0',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#495057',
        transition: 'background-color 0.2s',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        border: '1px solid #e1e5e9',
    },
    cardHeader: {
        backgroundColor: '#f8f9fa',
        padding: '24px 32px',
        borderBottom: '1px solid #e1e5e9',
    },
    bidTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '0',
        lineHeight: '1.3',
    },
    cardContent: {
        padding: '32px',
    },
    section: {
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f1f3f4',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#34495e',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    sectionContent: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#5a6c7d',
        margin: '0',
        whiteSpace: 'pre-wrap',
    },
    timelineContent: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#0a8d5f',
        fontWeight: '500',
        margin: '0',
    },
    linkContent: {
        fontSize: '16px',
        color: '#1976d2',
        textDecoration: 'none',
        wordBreak: 'break-all',
    },
    cardFooter: {
        backgroundColor: '#f8f9fa',
        padding: '24px 32px',
        borderTop: '1px solid #e1e5e9',
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-end',
    },
    shortlistButton: {
        backgroundColor: '#0a8d5f',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    contactButton: {
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    errorCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid #e1e5e9',
    },
    message: {
        padding: '12px 16px',
        borderRadius: '4px',
        border: '1px solid',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500',
    },
};

export default RequestsBidsExpanded;