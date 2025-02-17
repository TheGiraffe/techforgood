import { firebase_app } from "./config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const database = getFirestore(firebase_app);

export default async function getData(collection, id){
    let result,
    error = null;

    try {
        result = await getDoc(doc(database, collection, id));
        if (result.exists()){
            return result.data()
        }
    } catch (err) {
        error = err
    }

    return {result, error};
}