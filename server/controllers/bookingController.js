const Booking = require('../models/Bookings');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const { sendOtpEmail } = require('../utils/email');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for booking verification
exports.sendBookingOtp = async (req, res) => {
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOtpEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent to your email for booking verification.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Book an event
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;

        const otpRecord = await OTP.findOne({ email: req.user.email, otp, action: 'event_booking' });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats available for this event' });
        }

        const existingBooking = await Booking.findOne({ userId: req.user._id, eventId: eventId }); 
        if (existingBooking) {
            return res.status(400).json({ error: 'You have already booked this event' });
        }

        const booking = await Booking.create({
            userId: req.user._id, 
            eventId: eventId,      
            amount: event.ticketPrice,
            status: 'pending',
            paymentStatus: 'not_paid'
        });

        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
        res.status(201).json({ message: 'Booking successful. Please proceed to payment.', bookingId: booking._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Confirm booking (admin only)
exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!['paid', 'not_paid'].includes(paymentStatus)) {
            return res.status(400).json({ error: 'Invalid payment status' });
        }

        const booking = await Booking.findById(req.params.id).populate('eventId'); // ✅
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'confirmed') {
            return res.status(400).json({ error: 'Booking is already confirmed' });
        }

        const event = await Event.findById(booking.eventId._id); 
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus;
        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        console.log(`Booking confirmed for ${req.user.email}, bookingId: ${booking._id}`);
        res.json({ message: 'Booking confirmed' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('eventId'); 
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString()) { 
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status === 'confirmed') {
            const event = await Event.findById(booking.eventId); 
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        await booking.deleteOne();
        res.json({ message: 'Booking cancelled' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
