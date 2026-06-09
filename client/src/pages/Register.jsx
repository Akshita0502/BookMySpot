import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080c08] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/[0.04] p-8 rounded-xl border border-white/10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white mb-2">Create an Account</h2>
                    <p className="text-gray-500">Join BookMySpot today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 p-3 mb-4 rounded-lg">
                                An OTP has been sent to your email. Please verify your account.
                            </p>
                            <label className="block text-sm font-semibold text-gray-400 mb-2">Verification Code (OTP)</label>
                            <input
                                type="text"
                                required
                                placeholder="6-digit code"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 focus:outline-none transition font-bold tracking-widest text-center text-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-3 rounded-lg focus:ring-2 focus:ring-green-500/20 transition disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify & Complete' : 'Sign Up')}
                    </button>
                </form>

                {!showOTP && (
                    <p className="text-center mt-6 text-gray-500">
                        Already have an account? <Link to="/login" className="text-green-400 font-bold hover:underline">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;