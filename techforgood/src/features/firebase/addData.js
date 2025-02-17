import { firebase_app } from "./config";
import { getFirestore, doc, setDoc} from "firebase/firestore";

const database = getFirestore(firebase_app);

export default async function addData(collection, id, data){
    let result,
    error = null;

    try {
        result = await setDoc(doc(database, collection, id), data, {
            merge: true,
        });
    } catch (err) {
        error = err
    }

    return {result, error};
}