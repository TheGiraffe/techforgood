import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataById } from "../../features/firebase/getData";


const SearchRequestExpanded = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State to hold the request data
    const [request, setRequest] = useState(location.state?.request || null);
    const previousResults = location.state?.previousResults;
    const previousQueryArr = location.state?.submittedQueryArr;
    const previousPage = location.state?.currentPage;
    const searchInput = location.state?.searchInput;
    
    // State to manage hover effect for buttons
    const [isApplyHovered, setIsApplyHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);

    // State to hold organization contact email and name
    const [orgContactEmail, setOrgContactEmail] = useState(null);
    const [organizationName, setOrganizationName] = useState(null);

    // Fetch the user's email when request is loaded
    useEffect(() => {
        const fetchOrganizationDetails = async () => {
        if (request && request.uid) {
            getDataById('users', request.uid).then(user => {
                if (user && user.orgContactEmail) {
                    setOrgContactEmail(user.orgContactEmail);
                }
                if (user && user.organizationName) {
                    setOrganizationName(user.organizationName);
                }
            });
        }
        };
        fetchOrganizationDetails();
    }, [request]);

    // Fetch the request data by ID when the component mounts or when ID changes
    useEffect(() => {
        const fetchRequest = async () => {
            if (!request && id && /^[a-zA-Z0-9_-]{20,}$/.test(id)) {
                getDataById('requests', id).then (data => {
                    if (data && !data.console) {
                        setRequest(data);
                    }
                });
            }
        };
        fetchRequest();
    }, [id, request]);
        
    // loads the previous search requests page with previous state, maintains search input and results
    const loadPreviousSearchRequestsResults = () => {
        navigate('/search', {
            state: {
                previousResults: previousResults,
                submittedQueryArr: previousQueryArr,
                currentPage: previousPage,
                searchInput: searchInput,
            },
        });
    };

    const makeBid = () => {
        navigate(`/bids/new?request=${id}&title=${request.title}`)
    }

    return (
        <div>
            {request && (
                <div style={styles.cardStyle}>
                    <h2 style={styles.titleStyle}>{request.title}</h2>
                    <p style={styles.descriptionStyle}>{request.description}</p>
                    <p>This opportunity was posted by: <strong>{organizationName}</strong>. 
                    <br/>If you would like to get more information about this opportunity, or would 
                    like to submit your profile, please click apply.</p>
                    <div style={styles.buttonRowStyle}>
                        <button
                            style={{
                                ...styles.applyBtn,
                                cursor: orgContactEmail ? 'pointer' : 'not-allowed',
                                backgroundColor: isApplyHovered ? '#04AA6D': '#0a8d5f'
                            }}
                            onMouseEnter={() => setIsApplyHovered(true)}
                            onMouseLeave={() => setIsApplyHovered(false)}
                            onClick = {() => {if (orgContactEmail) window.location.href = `mailto:${orgContactEmail}`;}}
                            disabled={!orgContactEmail}
                        >
                            Apply
                        </button>
                        <button
                            style={{
                                ...styles.backBtn,
                                cursor: 'pointer',
                                backgroundColor: isBackHovered ? '#1976d2' : '#1565c0'
                            }}
                            onMouseEnter={() => setIsBackHovered(true)}
                            onMouseLeave={() => setIsBackHovered(false)}
                            onClick={loadPreviousSearchRequestsResults}
                        >
                            Back to Search Requests
                        </button>
                    </div>
                </div>
            )}
            <button type='button' onClick={makeBid}>Apply</button>
            <button 
                type='button'
                onClick={loadPreviousSearchRequestsResults}>
                Back to Search Requests
            </button> 
        </div>
    );
}


const styles = {
    cardStyle:{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        maxWidth: '700px',
        margin: '32px auto',
        boxSizing: 'border-box',
    },
    titleStyle:{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        textAlign: 'center',
    },
    descriptionStyle:{
        fontSize: '16px',
        color: '#333',
        marginBottom: '24px',
        textAlign: 'left',
    },
    buttonRowStyle:{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '24px',
    },
    applyBtn:{
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 24px',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'background 0.3s ease',
    },
    backBtn: {
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 24px',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'background 0.3s ease',
        marginLeft: '8px'
    }
};


export default SearchRequestExpanded;