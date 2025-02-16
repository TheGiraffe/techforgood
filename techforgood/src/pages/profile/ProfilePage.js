import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';

const ProfilePage = () => {
    const userData = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const [profilePicture, setProfilePicture] = useState(userData.profilePicture);

    if (!userData) {
        history.push('/login');
    }

    const handleSubmit = (values) => {
        // Dispatch an action to update the profile picture in the store
        dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: values.profilePicture });

        // Handle the image upload logic here
        console.log('Uploaded file:', values.profilePicture);
        setProfilePicture(URL.createObjectURL(values.profilePicture));
    };

    return (
        <>
            <h1>Profile Page</h1>
            <Formik
                initialValues={{ profilePicture: null }}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <label>
                            Profile Picture:
                            {profilePicture ? (
                                <>
                                    <img
                                        src={profilePicture}
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                    <button type="button" onClick={() => setProfilePicture(null)}>Change</button>
                                </>
                            ) : (
                                <input
                                    type="file"
                                    name="profilePicture"
                                    onChange={(event) => {
                                        setFieldValue('profilePicture', event.currentTarget.files[0]);
                                    }}
                                />
                            )}
                        </label>
                        <button type="submit">Upload</button>
                    </Form>
                )}
            </Formik>
            <div>
                <h3>Username: @{userData.username}</h3>
                <h3>Name: {userData.name}</h3>
                <h3>Email: {userData.email}</h3>
            </div>
        </>
    );
};

export default ProfilePage;