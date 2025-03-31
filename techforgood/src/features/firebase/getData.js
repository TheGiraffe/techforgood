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

// firestore is limited, we can only search for exact matches or ranges of values. we cannot search for partial matches.
// this function searches for documents in the requests collection that have a title or description that starts with the searchQuery string
// if user uses a partial search, e.g., uses the 2nd word of a title or description, it will not return any results. Can be an issue because this limits the search functionality
// of the entire DB
export async function getDataWithoutAuth(searchQuery) {
    console.log(`Searching requests collection with query: ${searchQuery}`);

    const titleQuery = query(
        collection(database, "requests"),
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + '\uf8ff'),
    );
    const descriptionQuery = query(
        collection(database, "requests"),
        where("description", ">=", searchQuery),
        where("description", "<=", searchQuery + '\uf8ff')
    );
    const [titleSnapshot, descriptionSnapshot] = await Promise.all ([
        getDocs(titleQuery),
        getDocs(descriptionQuery),
    ]);
    const result = new Map(); //stores results of the query in to an array
    
    titleSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });
    descriptionSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });    

    return Array.from(result.values());
}