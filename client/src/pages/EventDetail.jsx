import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#080c08] flex items-center justify-center text-gray-500 text-xl font-semibold">Loading...</div>;
    if (error && !event) return <div className="min-h-screen bg-[#080c08] flex items-center justify-center text-red-400 text-xl">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="min-h-screen bg-[#080c08] py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">
                {/* Hero image / fallback */}
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-80 object-cover opacity-80" />
                ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-[#0f2010] via-[#1a3a1a] to-[#0a1a0c] flex items-center justify-center text-green-400/40 text-6xl font-black uppercase tracking-widest">
                        {event.category}
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        {/* Left: info */}
                        <div className="flex-1">
                            <div className="inline-block bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                                {event.category}
                            </div>
                            <h1 className="text-4xl font-extrabold text-white mb-4">{event.title}</h1>
                            <p className="text-gray-500 text-lg leading-relaxed mb-6">{event.description}</p>
                        </div>

                        {/* Right: booking card */}
                        <div className="bg-white/[0.04] border border-white/10 p-6 rounded-xl min-w-[300px] w-full md:w-auto shrink-0">
                            <h3 className="text-xl font-bold text-white mb-6">Booking Details</h3>

                            <div className="space-y-4 mb-8">
                                {[
                                    {
                                        icon: <FaMoneyBillWave />,
                                        label: 'Ticket Price',
                                        value: event.ticketPrice === 0
                                            ? <span className="text-green-400">Free</span>
                                            : <span className="text-gray-100">₹{event.ticketPrice}</span>
                                    },
                                    {
                                        icon: <FaChair />,
                                        label: 'Availability',
                                        value: <span className="text-gray-100">
                                            <span className={event.availableSeats < 10 ? 'text-orange-400' : 'text-gray-100'}>{event.availableSeats}</span> / {event.totalSeats}
                                        </span>
                                    },
                                    {
                                        icon: <FaCalendarAlt />,
                                        label: 'Date',
                                        value: <span className="text-gray-100">{new Date(event.date).toLocaleDateString()}</span>
                                    },
                                    {
                                        icon: <FaMapMarkerAlt />,
                                        label: 'Location',
                                        value: <span className="text-gray-100">{event.location}</span>
                                    },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-green-400 flex items-center justify-center shrink-0">
                                            {icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
                                            <p className="font-bold">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {showOTP && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">Enter OTP to Confirm</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition font-bold tracking-widest text-center text-lg"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition ${
                                    isSoldOut || (successMsg && !showOTP)
                                        ? 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 hover:-translate-y-0.5'
                                }`}
                            >
                                {bookingLoading ? 'Processing...' : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Confirm Registration')))}
                            </button>

                            {error && (
                                <p className="text-red-400 mt-4 text-center font-medium bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                                    {error}
                                </p>
                            )}
                            {successMsg && (
                                <p className="text-green-400 mt-4 text-center font-medium bg-green-500/10 border border-green-500/20 p-2 rounded-lg">
                                    {successMsg}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;