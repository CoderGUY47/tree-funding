const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, getSupporterPayments } = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.post('/create-intent', verifyToken, verifyRole(['Supporter']), createPaymentIntent);
router.post('/confirm', verifyToken, verifyRole(['Supporter']), confirmPayment);
router.get('/history', verifyToken, verifyRole(['Supporter']), getSupporterPayments);

module.exports = router;
