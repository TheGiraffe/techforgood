import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';

const db = getFirestore();

const RequestDetailPage = () => {
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (values, { resetForm }) => {
        try {
            await addDoc(collection(db, "requests"), {
                requestTitle: values.requestTitle,
                requestDescription: values.requestDescription,
                created: new Date().toISOString(),
            });
            setRequestSubmitted(true);
            resetForm();
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div>
            <h1>Make a Request</h1>
            {requestSubmitted && <p>Request has been submitted, please refer to your dashboard to for user bids or to make changes to your request</p>}
            {error && <p style={{ color: 'red' }}>Error, request has not been submitted to server. Please try again later</p>}
            <Formik
                initialValues={{ requestTitle: '', requestDescription: '' }}
                validate={(values) => {
                    const errors = {};
                    if (!values.requestTitle) {
                        errors.requestTitle = 'Required';
                    }
                    if (!values.requestDescription) {
                        errors.requestDescription = 'Required';
                    }
                    return errors;
                }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <div>
                            <label htmlFor="requestTitle">Title</label>
                            <br/>
                            <Field id="requestTitle" name="requestTitle" placeholder="Request Title" />
                            {errors.requestTitle && <ErrorMessage name="requestTitle" component="div" />}
                        </div>
                        <div>
                            <label style= {{ textAlign: 'center' }} htmlFor="requestDescription">Description</label>
                            <br/>
                            <Field style={{ marginBottom: '10px', height: '100px' }}
                                id="requestDescription"
                                name="requestDescription"
                                placeholder="Describe what you need"
                                as="textarea"
                            />
                            {errors.requestDescription && <ErrorMessage name="requestDescription" component="div" />}
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

export default RequestDetailPage;


