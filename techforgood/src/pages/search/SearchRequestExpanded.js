import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataById } from "../../features/firebase/getData";

const SearchRequestExpanded = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [request, setRequest] = useState(location.state?.request || null);
    const previousResults = location.state?.previousResults;
    const previousQueryArr = location.state?.submittedQueryArr;
    const previousPage = location.state?.currentPage;
    const searchInput = location.state?.searchInput;

    useEffect(() => {
        if (!request && id && /^[a-zA-Z0-9_-]{20,}$/.test(id)) {
            getDataById('requests', id).then (data => {
                if (data && !data.console) {
                    setRequest(data);
                }
            });
        }
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

    return (
        <div>
            <h1>Expanded request page</h1>
            {/* Render request details if available */}
            {request && (
                <div>
                    <h2>{request.title}</h2>
                    <p>{request.description}</p>
                    {/* Add more fields as needed */}
                </div>
            )}
            <button 
                type='button'
                onClick={loadPreviousSearchRequestsResults}>
                Back to Search Requests
            </button>
        </div>
    );
}

export default SearchRequestExpanded;