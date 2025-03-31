import { firebase_app } from "../config";
import { getAuth } from "firebase/auth";
import getData from "../getData";

const auth = getAuth(firebase_app)


export default async function getUserProfile() {
    const user = auth.currentUser;
    if (user !== null){
        const userProfile = await getData('users', user.uid);
        return(userProfile)
    }
}