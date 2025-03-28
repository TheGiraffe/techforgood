import { firebase_app } from "../config";
import { getAuth } from "firebase/auth";
import { getCollectionData } from "../getData";


const auth = getAuth(firebase_app);


export default async function getRequests() {
    const user = auth.currentUser;
    if (user !== null) {
        const {result, error} = await getCollectionData('requests', user.uid);
        if (error){
            throw error;
        }
        return result;
    }

    return [];
}

