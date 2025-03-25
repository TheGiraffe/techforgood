import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from "../../AuthProvider";

const db = getFirestore();

const RequestForm = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const { user, loading } = useAuth(); // Use the context values

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await addDoc(collection(db, "requests"), {
                title: values.title,
                description: values.description,
                created: new Date().toISOString(),
                uid: user.uid,
            });
            setRequestSubmitted(true);
            resetForm();
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
            <Formik
                initialValues={{ title: '', description: '' }}
                validate={(values) => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = 'Required';
                    }
                    if (!values.description) {
                        errors.description = 'Required';
                    }
                    return errors;
                }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <div>
                            <label htmlFor="title">Title</label>
                            <br/>
                            <Field id="title" name="title" placeholder="Request title" />
                            {errors.title && <ErrorMessage name="title" component="div" />}
                        </div>
                        <div>
                            <label style= {{ textAlign: 'center' }} htmlFor="description">Description</label>
                            <br/>
                            <Field style={{ marginBottom: '10px', height: '100px' }}
                                id="description"
                                name="description"
                                placeholder="Describe what you need"
                                as="textarea"
                            />
                            {errors.description && <ErrorMessage name="description" component="div" />}
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RequestForm;
