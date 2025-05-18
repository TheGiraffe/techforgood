import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../features/firebase/AuthProvider";

const db = getFirestore();

const RequestForm = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [titleValue, setTitleValue] = useState("");
    const { user, loading } = useAuth(); // Use the context values
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const onSubmit = async (values) => {
        const titleFragments = Array.from(new Set(values.title.toLowerCase().split(/\s|\W/))).filter(item => item !== "");
        const descriptionFragments = Array.from(new Set(values.description.toLowerCase().split(/\s|\W/))).filter(item => item !== "");
        const kw = values.keywords
        console.log(kw)
        // let keywordsSquished = kw.toLowerCase().replace(/\s/, "").split(/,\s*/)
        const keywords = Array.from(new Set(kw.split(/,\s*/)));
        const keywordsFragments = Array.from(new Set(kw.toLowerCase().split(/\s|[,]/))).filter(item => item !== "");

        try {
            await addDoc(collection(db, "requests"), {
                title: values.title,
                description: values.description,
                created: new Date().toISOString(),
                uid: user.uid,
                keywords: keywords,
                _titleFragments: titleFragments,
                _descriptionFragments: descriptionFragments,
                _keywordsFragments: keywordsFragments
            });
            setRequestSubmitted(true);
            setTitleValue("");
            // Reset the form fields after submission
            reset();
        } catch (err) {
            setError(err);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>You must be logged in to make a request</p>;
    }

    return (
        <div>
            <h1>Make a Request</h1>
            {requestSubmitted && <p>Request has been submitted, please refer to your dashboard to for user bids or to make changes to your request</p>}
            {error && <p style={{ color: 'red' }}>Error, request has not been submitted to server. Please try again later</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">Title</label>
                    <br/>
                    <input
                        id="title"
                        name="title"
                        placeholder="Request title"
                        maxLength={75}
                        {...register('title', {
                            required: 'Required',
                            maxLength: {
                                value: 75,
                            }
                        })}
                        style={{ marginBottom: '10px', width: '500px', height: '30px', borderRadius: '5px' }}
                        // just made this easier to read and added a max length
                        value={titleValue}
                        onChange={e => {
                            setTitleValue(e.target.value);
                        }
                        }
                    />
                    <span style={{ 
                        fontSize: '14px', 
                        color: 'red', 
                        position: 'fixed',
                        marginTop: '10px',
                        width: '48px',
                        transform: 'translateX(-55px)',
                        textAlign: 'right',
                        }}>
                        {titleValue.length}/75
                    </span>
                    {/* added a character counter */}
                    {errors.title && <div>{errors.title.message}</div>}
                </div>
                <div>
                    <label style= {{ textAlign: 'center' }} htmlFor="description">Description</label>
                    <br/>
                    <textarea style={{ marginBottom: '10px', width: '500px', height: '150px', borderRadius: '5px' }}
                        id="description"
                        name="description"
                        placeholder="Describe what you need"
                        {...register('description', { required: 'Required' })}
                    />
                    {errors.description && <div>{errors.description.message}</div>}
                </div>
                <div>
                <label style= {{ textAlign: 'center' }} htmlFor="keywords">Keywords (Separate by Commas)</label>
                    <br/>
                    <input style={{ marginBottom: '10px', width: '500px', borderRadius: '5px', height: '30px' }}
                        id="keywords"
                        name="keywords"
                        placeholder="Keywords"
                        {...register('keywords', { required: 'Required' })}
                    />
                    {/* changed to input because keyword seems like it is only single line input */}
                    {errors.keywords && <div>{errors.keywords.message}</div>}
                </div>
                <button type="submit" disabled={isSubmitting} 
                    style={{color:'black', backgroundColor: '#04AA6D', 
                            borderRadius: '5px', 
                            borderColor: "black", 
                            padding: '10px 20px', 
                            fontSize: '14px', 
                            cursor: 'pointer'}}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    {/* added button styling */}
                </button>
                    <button
                        type="button" onClick={() => {
                            reset();
                            setTitleValue("");
                        }}
                        style={{
                            color: 'black',
                            backgroundColor: '#f2f2f2',
                            borderRadius: '5px',
                            borderColor: "black",
                            padding: '10px 20px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        Reset Form
                </button>

            </form>
            <style>
                {`
                    input, textarea {
                        font-family: 'Roboto', sans-serif;
                    }
                    input::placeholder, textarea::placeholder {
                        font-family: 'Roboto', sans-serif;
                    }

                `}
            </style>
        </div>
    );
};




export default RequestForm;
