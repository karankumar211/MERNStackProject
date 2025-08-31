import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const PaymentStatus = () => {
    const { merchantTransactionId } = useParams();
    const history = useHistory();
    const [status, setStatus] = useState('Checking payment status...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!merchantTransactionId) return;

        const checkStatus = async () => {
            try {
                // IMPORTANT: Changed to POST to match your backend route
                const response = await axios.post(`${apiURL}/api/phonepe/status/${merchantTransactionId}`);
                if (response.data.success) {
                    setStatus('Payment Successful!');
                    setTimeout(() => history.push('/'), 3000); // Redirect to homepage
                } else {
                    setStatus('Payment Failed. Please try again.');
                }
            } catch (error) {
                setStatus('An error occurred while checking status.');
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [merchantTransactionId, history]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {loading ? (
                <svg className="w-16 h-16 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            ) : (
                <h1 className="text-2xl font-bold">{status}</h1>
            )}
            <p className="mt-4">Please wait, you will be redirected shortly.</p>
        </div>
    );
};

export default PaymentStatus;
