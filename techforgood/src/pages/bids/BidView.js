import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { useAuth } from '../../features/firebase/AuthProvider';
import { getDataByExactAttributeValue } from "../../features/firebase/getData";


export default function BidView() {
    const { user, loading: authLoading } = useAuth();
    const { id } = useParams();
    const [bid, setBid] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchBid = async () => {
            try {
                if (user) {
                    const data = await getDataByExactAttributeValue('bids', 'id', id);
                    console.log(data.result[0])
                    setBid(data.result[0]);
                } else {
                    setError(new Error('Not logged in!'));
                }
            } catch (error) {
                console.error('Error fetching bid:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchBid();
        }
    }, [user, authLoading])

    return (
        <div className="my-2">
            {bid?.id ? (
                <div>
                    <h1>{bid?.title}</h1>
                    {bid?.volunteerName && <h4>Volunteer Name: {bid?.volunteerName}</h4>}
                    <h2 className="mt-4">Proposal:</h2>
                    <p>{bid?.proposal}</p>
                    <h2 className="mt-4">Timeline:</h2>
                    <p>{bid?.timeline}</p>
                    <h2 className="mt-4">Links:</h2>
                    <p>{bid?.links}</p>
                    <button className="mt-4" onClick={() => {setEmail(bid.contactEmail); console.log(email)}}>View Contact Email</button>
                    <div>{email}</div>
                </div>
            ) : <>Bid not found</>}

        </div>
    )
}