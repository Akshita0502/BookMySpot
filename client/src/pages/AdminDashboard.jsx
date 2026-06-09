import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', imageUrl: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}/cancel`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.error || 'Error cancelling booking');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080c08] flex items-center justify-center text-gray-500 text-xl font-semibold">
            Loading admin panel...
        </div>
    );

    const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition";

    return (
        <div className="min-h-screen bg-[#080c08] px-4 py-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage events and manually confirm bookings.</p>
                    </div>
                    <button
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="w-full md:w-auto bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-3 px-6 rounded-lg transition"
                    >
                        {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-black text-green-400">
                                ₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
                            <h3 className="text-3xl font-black text-blue-400">
                                {new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Pending Requests</p>
                            <h3 className="text-3xl font-black text-yellow-400">
                                {bookings.filter(b => b.status === 'pending').length}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
                    </div>
                </div>

                {/* Create Event Form */}
                {showEventForm && (
                    <div className="bg-white/[0.04] border border-white/10 p-8 rounded-2xl mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input required type="text" placeholder="Event Title" className={inputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input required type="text" placeholder="Category (e.g., Tech, Music)" className={inputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            <input required type="date" className={inputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            <input required type="text" placeholder="Location" className={inputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            <input required type="number" placeholder="Total Seats" className={inputClass} value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                            <input required type="number" placeholder="Ticket Price (0 for free)" className={inputClass} value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                            <div className="md:col-span-2">
                                <input type="text" placeholder="Image URL (optional)" className={inputClass} value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>
                            <textarea required placeholder="Event Description" className={`${inputClass} md:col-span-2 h-32 resize-none`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            <button type="submit" className="md:col-span-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-3 mt-2 rounded-lg transition">
                                Publish Event
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Events Section */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">{events.length}</span>
                            All Events
                        </h2>
                        <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
                            <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                                {events.length === 0
                                    ? <li className="p-6 text-gray-600 text-center">No events created yet.</li>
                                    : events.map(event => (
                                        <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.03] transition">
                                            <div>
                                                <h4 className="font-bold text-gray-100 mb-1 leading-tight">{event.title}</h4>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                        {event.availableSeats}/{event.totalSeats} seats
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteEvent(event._id)}
                                                className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition shrink-0"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    {/* Bookings Section */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold">{bookings.length}</span>
                            Booking Requests
                        </h2>
                        <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
                            <ul className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                                {bookings.length === 0
                                    ? <li className="p-6 text-gray-600 text-center">No bookings yet.</li>
                                    : bookings.map(booking => (
                                        <li key={booking._id} className={`p-5 hover:bg-white/[0.03] transition border-l-4 ${
                                            booking.status === 'pending' ? 'border-l-yellow-500/50' :
                                            booking.status === 'confirmed' ? 'border-l-green-500/50' :
                                            'border-l-red-500/50'
                                        }`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-gray-100 text-base leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                                <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
                                                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                        booking.status === 'confirmed' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                                                        booking.status === 'cancelled' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                                                        'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                                                    }`}>{booking.status}</span>
                                                    {booking.status !== 'cancelled' && (
                                                        <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                            booking.paymentStatus === 'paid'
                                                                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                                                : 'bg-white/5 border border-white/10 text-gray-500'
                                                        }`}>{booking.paymentStatus.replace('_', ' ')}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 mb-3 text-sm space-y-1">
                                                <p className="text-gray-500 flex items-center gap-2">
                                                    <span className="font-bold w-16 text-gray-600 uppercase text-xs">User:</span>
                                                    <span className="font-semibold text-gray-300">{booking.userId?.name}</span>
                                                    <span className="text-gray-600">({booking.userId?.email})</span>
                                                </p>
                                                <p className="text-gray-500 flex items-center gap-2">
                                                    <span className="font-bold w-16 text-gray-600 uppercase text-xs">Amount:</span>
                                                    <span className={`font-semibold ${booking.amount === 0 ? 'text-green-400' : 'text-gray-300'}`}>
                                                        {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                                    </span>
                                                </p>
                                                <p className="text-gray-500 flex items-center gap-2">
                                                    <span className="font-bold w-16 text-gray-600 uppercase text-xs">Date:</span>
                                                    <span className="text-gray-400">{new Date(booking.createdAt).toLocaleString()}</span>
                                                </p>
                                                {booking.eventId && (
                                                    <p className="text-gray-500 flex items-center gap-2 pt-2 border-t border-white/5">
                                                        <span className="font-bold w-16 text-gray-600 uppercase text-xs">Seats:</span>
                                                        <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {booking.eventId.availableSeats}
                                                        </span>
                                                        <span className="text-gray-600">remaining of {booking.eventId.totalSeats}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {booking.status === 'pending' && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                        ✓ Approve as Paid
                                                    </button>
                                                    <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                        ✓ Approve Undecided
                                                    </button>
                                                    <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;