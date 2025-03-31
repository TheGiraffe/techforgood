import { firebase_app } from "./config";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

const database = getFirestore(firebase_app);


// New set of search / lookup functions that may come in handy as future utilities

// Look up requests by title fragments, description fragments, or keywords.
export async function searchRequests(searchQuery){
    const formattedQueryArray = searchQuery.toLowerCase().split(/\W/);

    console.log(`Searching requests collection with query: ${searchQuery}`);
    const titleQuery = query(
        collection(database, "requests"),
        where("title", ">=", searchQuery.toLowerCase()),
        where("title", "<=", searchQuery.toLowerCase() + '\uf8ff'),
    );
    const titleFragmentsQuery = query(
        collection(database, "requests"),
        where("_titleFragments", "array-contains-any", formattedQueryArray)
    );
    const keywordsFragmentsQuery = query(
        collection(database, "requests"),
        where("_keywordsFragments", "array-contains-any", formattedQueryArray)
    );

    // Not sure if description should be included or not, depending upon how long and how many words it would match.
    const descriptionQuery = query(
        collection(database, "requests"),
        where("description", ">=", searchQuery.toLowerCase()),
        where("description", "<=", searchQuery.toLowerCase() + '\uf8ff')
    );
    const descriptionFragmentsQuery = query(
        collection(database, "requests"),
        where("_descriptionFragments", "array-contains-any", formattedQueryArray)
    )

    const [titleSnapshot, titleFragmentsSnapshot, keywordsFragmentsSnapshot, descriptionSnapshot, descriptionFragmentsSnapshot] = await Promise.all ([
        getDocs(titleQuery),
        getDocs(titleFragmentsQuery),
        getDocs(keywordsFragmentsQuery),
        getDocs(descriptionQuery),
        getDocs(descriptionFragmentsQuery)
    ]);
    const result = new Map(); //stores results of the query in to an array
    
    titleSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });
    titleFragmentsSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });    
    keywordsFragmentsSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });    
    descriptionSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });  
    descriptionFragmentsSnapshot.forEach((doc) => {
        result.set(doc.id, doc.data());
    });  


    return Array.from(result.values());
}

// Look up a specific user or organization
export async function searchUsers(){
    return
}

// Look up bids from a specific user or on a specific request
export async function searchBids(searchQuery){

}

// Look up comments from a specific user or comments relating to particular bids, etc, helpful especially for users trying to find their own comments.
export async function searchComments(){
    return
}

// Look up Users, Bids, Requests, and Comments. Just a global search. Added as an idea here just in case it is useful.
export async function searchAll(){
    return
}

// Left the previous search function untouched for right now while I'm doing testing.

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