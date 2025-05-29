import { firebase_app } from "./config";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
// getDocs are used to pull multple documents from a collection
// query and where is used to filter the documents
// collection the collection of documents that the data is being pulled from

// query get limit
const database = getFirestore(firebase_app);

export async function getDataById(collection, id){
    let result,
    error = null;

    try {
        result = await getDoc(doc(database, collection, id));
        if (result.exists()){
            return result.data()
        }
    } catch (err) {
        error = new Error("Does not exist");
    }

    return {result, error};
}

export async function getCollectionData(collectionName, uid) {
    let result,
    error = null;

    try {
        const q = query(collection(database, collectionName), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        result = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        error = err
    }

    return {result, error};
}

export async function getDataByExactAttributeValue(collectionName, attributeName, attributeValue) {
    let result,
    error = null;

    try {
        const q = query(collection(database, collectionName), where(attributeName, "==", attributeValue));
        const querySnapshot = await getDocs(q);
        result = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        error = new Error("Does not exist");
    }

    return {result, error};
}