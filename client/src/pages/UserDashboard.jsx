import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}/cancel`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.error || 'Error cancelling booking');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080c08] flex items-center justify-center text-gray-500 text-xl font-semibold">
            Loading dashboard...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#080c08] px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile header */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center text-3xl font-bold uppercase shrink-0">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Welcome, {user?.name}!</h1>
                        <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> User Dashboard
                        </p>
                    </div>
                </div>

                {/* Section title */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                        <FaTicketAlt className="text-green-400" /> My Booking Requests
                    </h2>
                </div>

                {/* Empty state */}
                {bookings.length === 0 ? (
                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-12 text-center">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTicketAlt className="text-gray-600 text-3xl" />
                        </div>
                        <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
                        <Link to="/" className="inline-block bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-3 px-8 rounded-lg transition">
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden hover:border-green-500/20 transition flex flex-col">
                                <div className="p-6 border-b border-white/5 flex-grow">
                                    {booking.eventId ? (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-base font-bold text-gray-100 leading-tight">{booking.eventId.title}</h3>
                                                <div className="flex flex-col gap-1 items-end shrink-0 ml-2">
                                                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                        booking.status === 'confirmed' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                                                        booking.status === 'cancelled' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                                                        'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                    {booking.status !== 'cancelled' && (
                                                        <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                            booking.paymentStatus === 'paid'
                                                                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                                                : 'bg-white/5 border border-white/10 text-gray-500'
                                                        }`}>
                                                            {booking.paymentStatus.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 space-y-1">
                                                <p><span className="text-gray-400 font-semibold">Date:</span> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                                <p><span className="text-gray-400 font-semibold">Amount:</span> {booking.amount === 0 ? <span className="text-green-400">Free</span> : `₹${booking.amount}`}</p>
                                                <p><span className="text-gray-400 font-semibold">Requested:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-red-400 italic">Event details unavailable (might have been deleted)</p>
                                    )}
                                </div>
                                <div className="p-4 bg-white/[0.02] flex justify-between items-center shrink-0">
                                    {booking.eventId && booking.status !== 'cancelled' ? (
                                        <>
                                            <Link to={`/events/${booking.eventId._id}`} className="text-green-400 font-semibold text-sm hover:underline">
                                                View Event
                                            </Link>
                                            <button
                                                onClick={() => cancelBooking(booking._id)}
                                                className="text-red-400 font-semibold text-sm hover:text-red-300 transition flex items-center gap-1"
                                            >
                                                <FaTimesCircle /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full text-center text-sm text-gray-600 italic">Booking Cancelled</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;