import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const SubmittedRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const q = query(collection(db, "requests"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRequests(requestsData);
                } else {
                    setError(new Error("User not authenticated"));
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading requests: {error.message}</p>;

    return (
        <div>
            <h2>Your Submitted Requests</h2>
            <ul>
                {requests.map(request => (
                    <li key={request.id}>
                        <h3>{request.title}</h3>
                        <p>{request.description}</p>
                        <p>Submitted on: {new Date(request.created).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubmittedRequestsPage;
