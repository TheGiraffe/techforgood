import { firebase_app } from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import addData from "../addData";

const auth = getAuth(firebase_app)

export default async function signup(signupObj) {
    let result = null;
    let error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, signupObj.email, signupObj.password);
        const user = auth.currentUser;
        if (user){
            updateProfile(user, {displayName: signupObj.username})
            .then(() => console.log(user))
            .catch((err) => console.error(err));

            if (signupObj.accountType === "organization" || signupObj.accountType === "volunteer"){
                let uid = user.uid;
                let userData;
        
                if (signupObj.accountType === "organization"){
                    userData = {
                        id: uid,
                        signupDate: new Date().toISOString(),
                        accountType: signupObj.accountType,
                        email: signupObj.email,
                        organizationName: signupObj.organizationName,
                        website: signupObj.website,
                        profileImg: null,
                        orgContactEmail: signupObj.orgContactEmail,
                        contactFirstName: signupObj.contactFirstName,
                        contactLastName: signupObj.contactLastName,
                        privacyAgreed: signupObj.privacyAgreed
                    }
        
                } else {
                    userData = {
                        id: uid,
                        signupDate: new Date().toISOString(),
                        accountType: signupObj.accountType,
                        email: signupObj.email,
                        username: signupObj.username,
                        firstName: signupObj.firstName,
                        lastName: signupObj.lastName,
                        profileImg: null,
                        DOB: signupObj.DOB,
                        interests: signupObj.interests,
                        privacyAgreed: signupObj.privacyAgreed
                    }
                }
        
                try {
                    result = await addData('users', userData.id, userData);
                } catch (err) {
                    error = err
                }
            }
        }

    } catch (err) {
        error = err
    }
    
    return {result, error}
}