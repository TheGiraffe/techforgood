import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../features/firebase/AuthProvider";

const database = getFirestore();

const RequestForm = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const { user, loading } = useAuth(); // Use the context values
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm();

    const onSubmit = async (values) => {
        console.log("Submitting request with values:", values);
        const titleFragments = Array.from(new Set(values.title.toLowerCase().split(/\s|\W/))).filter(item => item !== "");
        const descriptionFragments = Array.from(new Set(values.description.toLowerCase().split(/\s|\W/))).filter(item => item !== "");
        const kw = values.keywords
        console.log(kw)
        // let keywordsSquished = kw.toLowerCase().replace(/\s/, "").split(/,\s*/)
        const keywords = Array.from(new Set(kw.split(/,\s*/)));
        const keywordsFragments = Array.from(new Set(kw.toLowerCase().split(/\s|[,]/))).filter(item => item !== "");

        try {
            
            const requestDocRef = await addDoc(collection(database, "requests"), {
                title: values.title,
                briefDescription: values.briefDescription,
                description: values.description,
                uid: user.uid,
                keywords: keywords,
                created: new Date().toISOString(),
                _titleFragments: titleFragments,
                _descriptionFragments: descriptionFragments,
                _keywordsFragments: keywordsFragments
            });

            await setDoc(doc(database, "shortlist", requestDocRef.id), {
                bidIds: []
            });

            console.log("Request created with ID:", requestDocRef.id);
            console.log("Shortlist document created with same ID")

            setRequestSubmitted(true);
            reset();
        } catch (err) {
            console.error("Error creating request and shortlist:", err)
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
                            required: true,
                            maxLength: {
                                value: 75,
                            }
                        })}
                        style={{ marginBottom: '10px', width: '500px', height: '30px', borderRadius: '5px' }}
                    />
                    <span style={{ 
                        fontSize: '14px', 
                        color: 'red', 
                        position: 'absolute',
                        marginTop: '10px',
                        width: '48px',
                        transform: 'translateX(-55px)',
                        textAlign: 'right',
                    }}>
                        {watch('title','').length}/75
                    </span>
                    {/* added a character counter */}
                    {errors.title && <div>{errors.title.message}</div>}
                </div>
                <div>
                    <label style= {{ textAlign: 'center' }} htmlFor="briefDescription">Brief Description</label>
                    <br/>
                    <textarea style={{ marginBottom: '10px', width: '500px', height: '150px', borderRadius: '5px' }}
                        id="briefDescription"
                        name="briefDescription"
                        placeholder="Briefly describe what you need, this will be the first thing potential volunteers will see when they view your request."
                        maxLength={300}
                        {...register('briefDescription', { required: 'Required' })}
                    />
                    {errors.briefDescription && <div>{errors.briefDescription.message}</div>}
                </div>
                <div>
                    <label style= {{ textAlign: 'center' }} htmlFor="description">Description</label>
                    <br/>
                    <textarea style={{ marginBottom: '10px', width: '500px', height: '150px', borderRadius: '5px' }}
                        id="description"
                        name="description"
                        placeholder="Please provide a detailed description of your request, including any specific requirements or preferences you have. There is a character limit of 5000. Volunteers will be able to see this description on the expanded request page or when they click to learn more about your request. If you have trouble seeing the full description, you can click and drag the bottom right corner of the text area to resize it to your liking."
                        maxLength={5000}
                        {...register('description', { required: 'Required' })}
                    />
                    {errors.description && <div>{errors.description.message}</div>}
                </div>
                <div>
                <label style= {{ textAlign: 'center' }} htmlFor="keywords">Keywords (Separate by Commas)</label>
                    <p style= {{margin: '0px'}}>Keywords will help volunteers search for your request. <br/ > 
                    You create key words like so: as "web", "development", or "web development". <br/>
                    Be as specific as possible, and separate keywords or phrases with commas. <br/>
                    </p>
                    <br/>
                    <input style={{ marginTop: '0px', marginBottom: '10px', width: '500px', borderRadius: '5px', height: '30px' }}
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
