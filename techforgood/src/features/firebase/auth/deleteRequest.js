import { getAuth } from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const deleteRequest = async (requestId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const db = getFirestore();
        const requestRef = doc(db, "requests", requestId);

        try {
            await deleteDoc(requestRef);
            console.log('Request deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    } else {
        console.log('No user is currently signed in');
    }
};

export default deleteRequest;