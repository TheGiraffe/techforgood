import { firebase_app } from "../config";
import { getAuth } from "firebase/auth";
import { getDataById } from "../getData";

const auth = getAuth(firebase_app)


export default async function getUserProfile() {
    const user = auth.currentUser;
    if (user !== null){
        const userProfile = await getDataById('users', user.uid);
        return(userProfile)
    }
}