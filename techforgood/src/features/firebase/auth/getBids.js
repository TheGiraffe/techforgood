import { firebase_app } from "../config";
import { getAuth } from "firebase/auth";
import { getCollectionData, getDataByExactAttributeValue } from "../getData";


const auth = getAuth(firebase_app);

export default async function getBids() {
    const user = auth.currentUser;
    if (user !== null) {
        const { result, error } = await getDataByExactAttributeValue('bids', 'volunteerId', user.uid);
        if (error) {
            throw error;
        }
        return result;
    }

    return [];
}

export async function getBidsByRequestId(requestId) {
    const { result, error } = await getDataByExactAttributeValue('bids', 'requestId', requestId);
    if (error) {
        throw error;
    } return result;
}

export async function getIndividualBid(bidID) {
    console.log(typeof(bidID))
    const { result, error } = await getDataByExactAttributeValue('bids', 'bidId', bidID);
    if (error) {
        throw error;
    }
    return result;
}