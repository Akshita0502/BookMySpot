import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#080c08]">
            {/* Hero Section */}
            <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1578736641330-3155e606cd40?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">Welcome to BookMySpot</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Find Your Next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Unforgettable</span> Experience
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                    </p>
                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-6 py-5 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4">
                {[
                    { icon: <FaRegClock />, title: 'Fast Booking', desc: 'Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.' },
                    { icon: <FaTicketAlt />, title: 'Seamless Access', desc: 'Download tickets instantly or manage them right from your personal dashboard with ease.' },
                    { icon: <FaShieldAlt />, title: 'Secure Platform', desc: 'All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.' },
                ].map(({ icon, title, desc }) => (
                    <div key={title} className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-white/[0.07] hover:border-green-500/25 transition-all duration-300 overflow-hidden group">
                        {/* subtle green glow behind icon */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative w-12 h-12 bg-[#0a140c] border border-green-500/30 text-green-400 rounded-xl flex items-center justify-center text-xl mb-5 shadow-lg">
                            {icon}
                        </div>
                        <h3 className="text-base font-semibold text-gray-100 mb-2">{title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 px-2 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-extrabold text-white">Upcoming Events</h2>
                <div className="text-gray-500 font-medium">{events.length} results found</div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-600">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event._id} className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/20 hover:bg-white/[0.06] transition-all duration-300 flex flex-col">
                            {/* Thumbnail */}
                            <div className="h-48 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f2010] via-[#1a3a1a] to-[#0a1a0c] text-green-400/70 font-bold text-xl tracking-widest uppercase">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                {/* green radial glow overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080c08] via-transparent to-transparent" />
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                                    {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 flex-grow flex flex-col">
                                <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1.5">{event.category}</div>
                                <h2 className="text-lg font-bold text-gray-100 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-1.5 mb-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-600 shrink-0" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-600 shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                                        <div className="bg-green-500/60 h-1.5 rounded-full transition-all" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="block w-full text-center bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 text-gray-300 hover:text-green-400 font-semibold py-2.5 rounded-xl transition-all duration-200"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <footer className="mt-auto pt-16 pb-8 border-t border-white/10 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-green-500 text-2xl" />
                    <span className="text-xl font-bold text-white">BookMySpot</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-xs text-gray-700 font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} BookMySpot Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;