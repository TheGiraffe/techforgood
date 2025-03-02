import { Formik, Form, Field } from 'formik';

const RequestDetailPage = () => {
    const handleSubmit = (values) => {
        console.log('Request submitted:', values);

    };

    return (
        <div>
            <h1>Make a Request</h1>
            <Formik
                initialValues={{ requestTitle: '', requestDescription: '' }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="requestTitle">Title</label>
                            <br/>
                            <Field id="requestTitle" name="requestTitle" placeholder="Request Title" />
                        </div>
                        <div>
                            <label style= {{ textAlign: 'center' }} htmlFor="requestDescription">Description</label>
                            <br/>
                            <Field style={{ marginBottom: '10px', height: '100px' }}
                                id="requestDescription"
                                name="requestDescription"
                                placeholder="Request Description"
                                as="textarea"
                            />
                        </div>
                        <button type="submit">Submit Request</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RequestDetailPage;
