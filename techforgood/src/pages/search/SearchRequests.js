import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { searchRequests } from '../../features/firebase/search';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDateTime } from '../../features/utils/formatDateTime'

function SearchRequests() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [submittedQueryArr, setSubmittedQueryArr] = useState([])
    const resultsPerPage = 5;

    // managing hover state
    const [hoveredCardIndex, setHoveredCardIndex] = useState(false);
    const [hoveredKeywordIndex, setHoveredKeywordIndex] = useState(false);
    const [hoveredLearnMoreIndex, setHoveredLearnMoreIndex] = useState(false);
    const [hoveredPreviousButton, setHoveredPreviousButton] = useState(false);
    const [hoveredNextButton, setHoveredNextButton] = useState(false);

    const onSubmit = async data => {
        if (!data.searchQuery) {
            return;
        }
        setSearchInput(data.searchQuery);
        let formattedQueryArray = data.searchQuery.toLowerCase().split(/\W/);

        // In case we want to exclude certain linking words at some point to prevent too many random matches
        // const exclude = ["the", "a"];
        // formattedQueryArray = formattedQueryArray.filter((item) => !(exclude.includes(item)));

        if (formattedQueryArray.length > 0){
            const [result, queryArr] = await searchRequests(data.searchQuery, formattedQueryArray);
            setSubmittedQueryArr(queryArr);
            const resultsWithId = result.map(doc => ({
                id: doc.id,
                ...doc
            }));
            // Sort results by most recent date to least recent date
            const sortedResult = resultsWithId.sort((a, b) => new Date(b.created) - new Date(a.created));
            setResults(sortedResult);
            setSubmitted(true);
            setCurrentPage(1); // Reset to first page on new search
        }
        
    };
    
    useEffect(() => {
    
        //preventing refresh on back
        let isRefresh = false;
        if (performance.getEntriesByType) {
            const nav = performance.getEntriesByType('navigation');
            if (nav.length > 0) isRefresh = nav[0].type === 'reload';
        }
        
        if (!isRefresh && location.state?.previousResults) {
            const { previousResults, submittedQueryArr, currentPage, searchInput } = location.state;
            setResults(previousResults);
            setSubmittedQueryArr(submittedQueryArr);
            setCurrentPage(currentPage);
            setSubmitted(true);
            setSearchInput(searchInput || '');
            setValue('searchQuery', searchInput || '');
        } else if (isRefresh) {
            const saved = localStorage.getItem('searchPageState');
            if (saved) {
                const { results, submittedQueryArr, currentPage, searchInput } = JSON.parse(saved);
                setResults(results);
                setSubmittedQueryArr(submittedQueryArr);
                setCurrentPage(currentPage);
                setSubmitted(true);
                setSearchInput(searchInput || '');
                setValue('searchQuery', searchInput || '');
            }
        }
    }, [location.state, setValue]);

    useEffect(() => {
        // Save state on change
        if (submitted) {
            localStorage.setItem('searchPageState', JSON.stringify({
                results,
                submittedQueryArr,
                currentPage,
                searchInput
        }));
        }
    }, [results, submittedQueryArr, currentPage, searchInput, submitted]);
    
    useEffect(() => {
        // Clear state only on real page reload or close
        const clearState = () => {
            localStorage.removeItem('searchPageState');
        };
        window.addEventListener('beforeunload', clearState);
        return () => {
            window.removeEventListener('beforeunload', clearState);
        };
    }, []);

    useEffect(() => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = mobileCardStyle;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);
    
    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    {...register("searchQuery", { required: true })} 
                    placeholder="Search requests" 
                    value={searchInput}
                    onChange={e => {
                        setSearchInput(e.target.value)
                        setValue('searchQuery', e.target.value);
                    }}
                />
                <button type="submit">Search</button>
                {errors.searchQuery && <p style={{ color: 'red' }}>Please enter the type of work you are looking for.</p>}
            </form>
            {submitted && (
                <div>
                    <h2>Results</h2>
                    {results.length === 0 ? (
                        <p>No results found</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {currentResults.map((result, index) => (
                                <div 
                                    key={index} 
                                    style={{
                                        ...styles.card,
                                        backgroundColor: hoveredCardIndex === index ? '#f5f5f5' : '#fff', 
                                        transform: hoveredCardIndex === index ? 'scale(1.025)' : 'scale(1)',
                                        zIndex: hoveredCardIndex === index ? 2 : 1,
                                        boxShadow: hoveredCardIndex === index
                                            ? '0 4px 16px rgba(0,0,0,0.10)'
                                            : styles.card.boxShadow,
                                    }}
                                    onMouseEnter={() => setHoveredCardIndex(index)}
                                    onMouseLeave={() => setHoveredCardIndex(null)}
                                    className="search-card">
                                    <h3 style={styles.title}>
                                        {result.title
                                            ? result.title.charAt(0).toUpperCase() + result.title.slice(1)
                                            : ''}
                                    </h3>
                                    <p style={styles.description}>
                                        {result.briefDescription
                                            ? result.briefDescription.charAt(0).toUpperCase() + result.briefDescription.slice(1)
                                            : <em>No description provided.</em>
                                        }
                                    </p>
                                    <div style={styles.time}>
                                        <span style={styles.timePosted}>
                                            {formatDateTime(result.created)}
                                        </span>
                                    </div>
                                    <div style={styles.keywordRow}>
                                        <div style={styles.keywords}>
                                            {result.keywords && result.keywords.map((kw, idx) => (
                                                <span 
                                                    key={idx}
                                                    style={{
                                                        ...styles.keyword,
                                                        backgroundColor: hoveredKeywordIndex.card === index && hoveredKeywordIndex.idx === idx ? '#e0f7fa' : '#f1f1f1',
                                                        transform: hoveredKeywordIndex.card === index && hoveredKeywordIndex.idx === idx ? 'scale(1.05)' : 'scale(1)',
                                                        zIndex: hoveredKeywordIndex.card === index && hoveredKeywordIndex.idx === idx ? 2 : 1,
                                                    }}
                                                    onMouseEnter={() => setHoveredKeywordIndex({card: index, idx})}
                                                    onMouseLeave={() => setHoveredKeywordIndex({card: null, idx: null})}
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.learnMoreButton,
                                                backgroundColor: hoveredLearnMoreIndex === index ? '#04AA6D' : '#0a8d5f',
                                                cursor: `/search/expanded/${result.id}` ? 'pointer' : 'not-allowed',
                                            }}
                                            onMouseEnter={() => setHoveredLearnMoreIndex(index)}
                                            onMouseLeave={() => setHoveredLearnMoreIndex(null)}
                                            onClick={() => {
                                                if (/^[a-zA-Z0-9_-]{20,}$/.test(result.id)) {
                                                    navigate(`/search/expanded/${result.id}`, {
                                                        state: {
                                                            request: result,
                                                            previousResults: results,
                                                            submittedQueryArr: submittedQueryArr,
                                                            currentPage: currentPage,
                                                            indexOfLastResult: indexOfLastResult,
                                                            searchInput: getValues('searchQuery'),
                                                        }
                                                    });
                                                }
                                            }}
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <br />
                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        {currentPage} of {Math.ceil(results.length / resultsPerPage)}
                    </div>
                    <div>
                        <button
                            type="button"
                            style={{
                                ...styles.paginationButton,
                                ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
                                    backgroundColor: hoveredPreviousButton ? '#04AA6D': '#0a8d5f',
                            }}
                            onMouseEnter={() => setHoveredPreviousButton(true)}
                            onMouseLeave={() => setHoveredPreviousButton(false)}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            style={{
                                ...styles.paginationButton,
                                ...(currentPage === Math.ceil(results.length / resultsPerPage) ? styles.paginationButtonDisabled : {}),
                                backgroundColor: hoveredNextButton ? '#04AA6D': '#0a8d5f',
                            }}
                            onMouseEnter={() => setHoveredNextButton(true)}
                            onMouseLeave={() => setHoveredNextButton(false)}
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(results.length / resultsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


const styles = {
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      position: 'relative',
      width: '75%', // Adjusted width for better responsiveness
      margin: '0 auto',
      maxWidth: '800px',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.2s',
    },
    time: {
      display: 'flex',
      justifyContent: 'flex-end', // Align content to the right
      fontSize: '12px',
      color: '#888',
      marginBottom: '8px',
    },
    timePosted: {
      fontWeight: 'bold',
    },
    iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#aaa',
    },
    title: {
      margin: '0 0 8px 0',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    description: {
      fontSize: '15px',
      color: '#333',
      marginBottom: '10px',
      textAlign: 'left',
    },
    keywordRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start', // Align to top
      marginTop: '10px',
      minHeight: '56px', 
      gap: '10px',
    },
    keywords: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      flex: 1, // Take up available space
    },
    keyword: {
      borderRadius: '12px',
      padding: '4px 12px',
      fontSize: '13px',
      color: '#555',
      transition: 'background-color 0.1s, transform 0.1s, box-shadow 0.1s',
      cursor: 'pointer',
    },
    learnMoreButton: {
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      alignSelf: 'flex-start', // keeps button at top of keyword ow
      minWidth: '120px', // keeps button dimensions consistent
      minHeight: '40px', 
      marginLeft: '16px',
      transition: 'background-color 0.3s ease',
    },
    pagination: {
      marginTop: '20px',
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      borderRadius: '5px',
    },
    paginationButton: {
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      minWidth: '120px',
      minHeight: '40px',
      margin: '0 5px',
      transition: 'background-color 0.3s ease',
    },
    paginationButtonDisabled: {
      background: '#ccc',
      color: '#666',
      cursor: 'not-allowed',
    },
  };


const mobileCardStyle = `
@media (max-width: 600px) {
  .search-card {
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}
`;



export default SearchRequests;
