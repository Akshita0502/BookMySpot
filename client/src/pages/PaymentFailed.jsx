import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-[70vh] bg-[#080c08] flex flex-col items-center justify-center p-4">
            <div className="bg-white/[0.04] border border-red-500/20 p-10 rounded-3xl max-w-md w-full text-center">
                <FaTimesCircle className="text-red-400 text-7xl mx-auto mb-6" />
                <h1 className="text-4xl font-black text-white mb-4">Booking Failed</h1>
                <p className="text-gray-500 mb-8 text-lg">We couldn't process your payment. Please ensure your payment details are correct and try again.</p>
                <div className="space-y-4">
                    <Link to="/" className="block w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-4 px-6 rounded-xl transition">
                        Return to Events
                    </Link>
                    <Link to="/dashboard" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-bold py-4 px-6 rounded-xl transition">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;