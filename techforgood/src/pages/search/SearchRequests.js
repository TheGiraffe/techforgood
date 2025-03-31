import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDataWithoutAuth, searchRequests } from '../../features/firebase/search';
import { Fragment } from 'react';

function SearchRequests() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [results, setResults] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [submittedQueryArr, setSubmittedQueryArr] = useState([])
    const resultsPerPage = 5;

    const onSubmit = async data => {
        if (!data.searchQuery) {
            return;
        }
        let formattedQueryArray = data.searchQuery.toLowerCase().split(/\W/);

        // In case we want to exclude certain linking words at some point to prevent too many random matches
        // const exclude = ["the", "a"];
        // formattedQueryArray = formattedQueryArray.filter((item) => !(exclude.includes(item)));

        if (formattedQueryArray.length > 0){
            const [result, queryArr] = await searchRequests(data.searchQuery, formattedQueryArray);
            setSubmittedQueryArr(queryArr);
            console.log(result);
            // Sort results by most recent date to least recent date
            const sortedResult = result.sort((a, b) => new Date(b.created) - new Date(a.created));
            setResults(sortedResult);
            setSubmitted(true);
            setCurrentPage(1); // Reset to first page on new search
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
    const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("searchQuery", { required: true })} placeholder="Search requests" />
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
                            {currentResults.map((result, index) => (
                                <div key={index}>
                                    <h3>{result.title.split(/\s/).map((word, idx) => {
                                        if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                            return <Fragment key={idx}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>
                                        } else {
                                            return <Fragment key={idx}>{word} </Fragment>
                                        }
                                    })}</h3>
                                    <p>{result.description.split(/\s/).map((word, idx) => {
                                        if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                            return <Fragment key={idx}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>
                                        } else {
                                            return <Fragment key={idx}>{word} </Fragment>
                                        }
                                    })}</p>
                                    <p>Submitted on: {new Date(result.created).toLocaleDateString()}</p>
                                    {result.keywords ? (
                                        <p>Keywords: {result.keywords.map((words, idx) => {
                                            const words_split = words.split(/\s/)
                                            const pieces = []
                                            for (const word of words_split){
                                                if (submittedQueryArr.includes(word.replace(/\W/, "").toLowerCase())){
                                                    pieces.push(<Fragment key={`kw-${idx}-${word}`}><span style={{backgroundColor: "yellow"}}>{word}</span> </Fragment>)
                                                } else {
                                                    pieces.push(<Fragment key={`kw-${idx}-${word}`}>{word} </Fragment>)
                                                }
                                            }  
                                            {idx==result.keywords.length - 1 ? pieces.push(<Fragment key={`kw-${idx}`}></Fragment>) : pieces.push(<Fragment key={`kw-${idx}`}>, </Fragment>)}
                                            return pieces
                                        })}</p>
                                    ) : (
                                        <></>
                                    )}
                                    
                                </div>
                            ))}
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

export default SearchRequests;
