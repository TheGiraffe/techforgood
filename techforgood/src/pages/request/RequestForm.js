import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../features/firebase/AuthProvider";

const db = getFirestore();

const RequestForm = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const { user, loading } = useAuth(); // Use the context values
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const onSubmit = async (values) => {
        try {
            await addDoc(collection(db, "requests"), {
                title: values.title.toLowerCase(),
                description: values.description.toLowerCase(),
                created: new Date().toISOString(),
                uid: user.uid,
            });
            setRequestSubmitted(true);
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
                    <input id="title" name="title" placeholder="Request title" {...register('title', { required: 'Required' })} />
                    {errors.title && <div>{errors.title.message}</div>}
                </div>
                <div>
                    <label style= {{ textAlign: 'center' }} htmlFor="description">Description</label>
                    <br/>
                    <textarea style={{ marginBottom: '10px', height: '100px' }}
                        id="description"
                        name="description"
                        placeholder="Describe what you need"
                        {...register('description', { required: 'Required' })}
                    />
                    {errors.description && <div>{errors.description.message}</div>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default RequestForm;
