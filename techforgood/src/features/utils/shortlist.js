import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const database = getFirestore();

export const addBidToShortlist = async (requestId, bidId) => {
    try {
        const shortlistDocRef = doc(database, "shortlist", requestId);

        const shortlistDoc = await getDoc(shortlistDocRef);

        if (!shortlistDoc.exists()) {
            throw new Error('No shortlist document found')
        }

        const currentBidIds = shortlistDoc.data().bidIds;
        if (currentBidIds.includes(bidId)) {
            throw new Error('You have already shortlisted this bid')
        }

        await updateDoc(shortlistDocRef, {
            bidIds: arrayUnion(bidId)
        });

        console.log(`Bid ${bidId} added to shortlist for request ${requestId}`);
    } catch (error) {
        console.error("Error adding bid to shortlist:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};

export const isBidShortlisted = async (requestId, bidId) => {
    try {
        const shortlistDocRef = doc(database, "shortlist", requestId);
        const shortlistDoc = await getDoc(shortlistDocRef);

        if (!shortlistDoc.exists()) {
            return false;
        }

        const currentBidIds = shortlistDoc.data().bidIds;
        return currentBidIds.includes(bidId);
    } catch (error) {
        console.error("Error checking if bid is shortlisted:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}

export const removeBidFromShortlist = async (requestId, bidId) => {
    try {
        const shortlistDocRef = doc(database, "shortlist", requestId);
        const shortlistDoc = await getDoc(shortlistDocRef);

        if (!shortlistDoc.exists()) {
            throw new Error('No shortlist document found');
        }

        const currentBidIds = shortlistDoc.data().bidIds;
        if (!currentBidIds.includes(bidId)) {
            throw new Error('This bid is not shortlisted');
        }

        await updateDoc(shortlistDocRef, {
            bidIds: arrayRemove(bidId)
        });

        console.log(`Bid ${bidId} removed from shortlist for request ${requestId}`);
    } catch (error) {
        console.error("Error removing bid from shortlist:", error);
        throw error; // Re-throw the error for further handling if needed
    }
}

export const getShortlistedBidIds = async (requestId) => {
    try {
        const shortlistDocRef = doc(database, "shortlist", requestId);
        const shortlistDoc = await getDoc(shortlistDocRef);

        if (!shortlistDoc.exists()) {
            throw new Error('No shortlist document found');
        }

        return shortlistDoc.data().bidIds || [];
    } catch (error) {
        console.error("Error fetching shortlisted bids:", error);
        throw error; // Re-throw the error for further handling if needed
    }
};