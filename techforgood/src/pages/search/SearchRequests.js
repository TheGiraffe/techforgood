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
    
    // Load previous search results if available
    // This is used when the user navigates back from the expanded request page, either using the 
    // back button or the "Back to Search Requests" button
    // This is also used to check if the page was refreshed, if page was refreshed, state will not be restored
    // and the user will have to search again
    useEffect(() => {
        // check for browser refresh
        let isRefresh = false;

        // for modern browsers
        if (performance.getEntriesByType) {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                isRefresh = navigationEntries[0].type === 'reload';
            }
        }

        // for older browsers
        if(typeof performance.navigation !== 'undefined') {
            isRefresh = performance.navigation.type === 1;
        }

        // search page state is restored if the page is not reloaded
        if (!isRefresh && location.state?.previousResults) {
            setResults(location.state.previousResults);
            setSubmittedQueryArr(location.state.submittedQueryArr);
            setCurrentPage(location.state.currentPage);
            setSubmitted(true);
            setSearchInput(location.state.searchInput || '');
            setValue('searchQuery', location.state.searchInput || '');
        }
    }, [location.state, setValue]);

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
                                            <td>{result.description.split(/\s/).map((word, idx) => {
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
                                                <button onClick={() =>{
                                                    navigate(`/search/expanded/${result.id}`, { 
                                                        state: { 
                                                            request: result,
                                                            previousResults: results,
                                                            submittedQueryArr: submittedQueryArr,
                                                            currentPage: currentPage,
                                                            indexOfLastResult: indexOfLastResult,
                                                            searchInput: getValues('searchQuery'),
                                                        }
                                                    })   
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
