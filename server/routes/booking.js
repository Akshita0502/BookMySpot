const express = require('express');
const router = express.Router();

const { protect, admin} = require('../middleware/auth');
const { bookEvent, sendBookingOtp, getMyBookings, confirmBooking, cancelBooking } = require('../controllers/bookingController');

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOtp);
router.get('/my', protect, getMyBookings);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id/cancel', protect, cancelBooking);

module.exports = router;