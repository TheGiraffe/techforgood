import { useEffect, useState}  from 'react';
import { useLocation } from 'react-router-dom';
import { getBidsByRequestId } from '../../features/firebase/auth/getBids';

const RequestsBids = () => {

    return (
        <div>
            <h1>Here are bids for this request</h1>
            <p>Click on a bid to view what the volunteer has submitted.</p>
            
        </div>
    );
}