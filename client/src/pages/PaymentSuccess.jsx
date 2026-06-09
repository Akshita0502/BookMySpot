import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] bg-[#080c08] flex flex-col items-center justify-center p-4">
            <div className="bg-white/[0.04] border border-green-500/20 p-10 rounded-3xl max-w-md w-full text-center">
                <FaCheckCircle className="text-green-400 text-7xl mx-auto mb-6" />
                <h1 className="text-4xl font-black text-white mb-4">Booking Confirmed!</h1>
                <p className="text-gray-500 mb-8 text-lg">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-4 px-6 rounded-xl transition">
                        View My Tickets
                    </Link>
                    <Link to="/" className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-bold py-4 px-6 rounded-xl transition">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;