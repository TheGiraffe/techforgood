// import { useSelector, useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import { Formik, Form, Field } from 'formik';
// import { useState } from 'react';

// const ProfilePage = () => {
//     const userData = useSelector(state => state.user.user);
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const [profilePicture, setProfilePicture] = useState(userData.profilePicture);

//     if (!userData) {
//         history.push('/login');
//     }

//     const handleSubmit = (values) => {
//         // Dispatch an action to update the profile picture in the store
//         dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: values.profilePicture });

//         // Handle the image upload logic here
//         console.log('Uploaded file:', values.profilePicture);
//         setProfilePicture(URL.createObjectURL(values.profilePicture));
//     };

//     return (
//         <>
//             <h1>Profile Page</h1>
//             <Formik
//                 initialValues={{ profilePicture: null }}
//                 onSubmit={handleSubmit}
//             >
//                 {({ setFieldValue, values }) => (
//                     <Form>
//                         <label>
//                             Profile Picture:
//                             {profilePicture ? (
//                                 <>
//                                     <img
//                                         src={profilePicture}
//                                         style={{ maxWidth: '200px', maxHeight: '200px' }}
//                                     />
//                                     <button type="button" onClick={() => setProfilePicture(null)}>Change</button>
//                                 </>
//                             ) : (
//                                 <input
//                                     type="file"
//                                     name="profilePicture"
//                                     onChange={(event) => {
//                                         setFieldValue('profilePicture', event.currentTarget.files[0]);
//                                     }}
//                                 />
//                             )}
//                         </label>
//                         <button type="submit">Upload</button>
//                     </Form>
//                 )}
//             </Formik>
//             <div>
//                 <h3>Username: @{userData.username}</h3>
//                 <h3>Name: {userData.name}</h3>
//                 <h3>Email: {userData.email}</h3>
//             </div>
//         </>
//     );
// };
import getUserProfile from "../../features/firebase/auth/getuserprofile";
import { useState } from "react";
import { useEffect } from "react";

const ProfilePage = () =>{
    const [profile, setProfile] = useState({});

    const getProfileDetails = async () => {
        const profileDetails = await getUserProfile()
        if (profileDetails){
            setProfile(profileDetails);
        }
    }

    useEffect(() => {
        getProfileDetails();
    }, [])

    return (
        <>
            <p>This is your personal Profile Page.</p>
            <p>TODO: Make public profile pages as well</p>
            <p>TODO: Maybe the login should lead to the Dashboard instead?</p>
            <p>TODO: Incorporate <a href="https://www.freecodecamp.org/news/create-full-stack-app-with-nextjs13-and-firebase/">listening for authentication changes</a> and keeping people signed in and all that.</p>
            <div>
                {Object.keys(profile).length !== 0 ? (
                    <>
                        <h3>{profile.firstName ? (<>{profile.firstName}'s </>) : (<>{profile.organizationName ? (<>{profile.organizationName}'s </>) : (<></>)}</>)}User Data</h3>
                        {Object.keys(profile).map((key, idx) => {
                            return(
                                <div key={idx}>
                                    {key} : {profile[key]}
                                </div>
                            )
                        })}
                    </>
                ) : <div style={{color:"red"}}>You are not signed in.</div>}
            </div>
        </>
    )
}

export default ProfilePage;