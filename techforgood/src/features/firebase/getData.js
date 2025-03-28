import { firebase_app } from "./config";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
// getDocs are used to pull multple documents from a collection
// query and where is used to filter the documents
// collection the collection of documents that the data is being pulled from
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

export async function getDataWithoutAuth(searchQuery) {
    console.log(`Searching requests collection with query: ${searchQuery}`);
    const q = query(
        collection(database, "requests"),
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + '\uf8ff'),
        where("description", ">=", searchQuery),
        where("description", "<=", searchQuery + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push(doc.data());
    });
    return result;
}