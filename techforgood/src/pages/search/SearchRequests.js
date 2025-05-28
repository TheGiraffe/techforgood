import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { searchRequests } from '../../features/firebase/search';
import { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchRequests() {
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
    const [searchInput, setSearchInput] = useState('');
    const [results, setResults] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [submittedQueryArr, setSubmittedQueryArr] = useState([])
    const resultsPerPage = 5;
    const navigate = useNavigate();
    const location = useLocation();

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
        // Detect if this is a browser refresh
        let isRefresh = false;
        if (performance.getEntriesByType) {
            const nav = performance.getEntriesByType('navigation');
            if (nav.length > 0) isRefresh = nav[0].type === 'reload';
        }
        if (typeof performance.navigation !== 'undefined') {
            isRefresh = performance.navigation.type === 1;
        }

        // Restore state
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
                        <>
                            <table className="request-table" style={styles.requestTable}>
                                <thead>
                                    <tr className="table-header-row" style={styles.tableHeaderRow}>
                                        <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Title</th>
                                        <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Description</th>
                                        <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Keywords</th>
                                        <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Date Created</th>
                                        <th className="request-table-header" style={styles.requestTableHeader} scope='col'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentResults.map((result, index) => (
                                        <tr style={styles.tableRow} key={index}>
                                            <th>{result.title.split(/\s/).map((word, idx) => {
                                                if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                                    return <Fragment key={idx}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>
                                                } else {
                                                    return <Fragment key={idx}>{word} </Fragment>
                                                }
                                            })}</th>
                                            <td>{(result.briefDescription || '').split(/\s/).map((word, idx) => {
                                                if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                                    return <Fragment key={idx}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>
                                                } else {
                                                    return <Fragment key={idx}>{word} </Fragment>
                                                }
                                            })}</td>
                                            {result.keywords ? (
                                                <td>Keywords: {result.keywords.map((words, idx) => {
                                                    const words_split = words.split(/\s/)
                                                    const pieces = []
                                                    for (const word of words_split){
                                                        if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                                            pieces.push(<Fragment key={`kw-${idx}-${word}`}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>)
                                                        } else {
                                                            pieces.push(<Fragment key={`kw-${idx}-${word}`}>{word} </Fragment>)
                                                        }
                                                    }  
                                                    {idx===result.keywords.length - 1 ? pieces.push(<Fragment key={`kw-${idx}`}></Fragment>) : pieces.push(<Fragment key={`kw-${idx}`}>, </Fragment>)}
                                                    return pieces
                                                })}</td>
                                            ) : (
                                                <></>
                                            )}
                                            <td>{new Date(result.created).toLocaleDateString()}</td>
                                            <td className='actionsStyling' style={styles.actionsStyling}>
                                                <button 
                                                    type='button'
                                                    onClick={() => {
                                                        // Validate the ID before navigating
                                                        if (/^[a-zA-Z0-9_-]{20,}$/.test(result.id)) {
                                                            console.log(`Validated request ID: ${result.id}`);
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
                                                        } else {
                                                            alert("Invalid request ID.");
                                                        }
                                                    }}>
                                                    Learn More
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <p>Page {currentPage}</p>
                                {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                                {indexOfLastResult < results.length && <button onClick={handleNextPage}>Next</button>}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

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
    tableRow: {
        
        
        
    },
    actionsStyling: {
        gap: '5px',
        padding: '5px',
    },
};


export default SearchRequests;
