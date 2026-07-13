const stripe = require('stripe');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// Initialize stripe only if key is valid (not default placeholder)
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripeInstance = null;
if (stripeKey && !stripeKey.includes('PlaceHolder')) {
  try {
    stripeInstance = stripe(stripeKey);
  } catch (err) {
    console.warn('Stripe initialization failed. Falling back to dummy payments.');
  }
}

// Helper to create notifications
const createNotification = async (message, toEmail, actionRoute) => {
  try {
    const notification = new Notification({
      message,
      toEmail,
      actionRoute,
      time: new Date(),
      read: false
    });
    await notification.save();
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { credits } = req.body;
    const creditsNum = Number(credits);

    // Map packages to prices (in USD)
    let amount = 0;
    if (creditsNum === 100) amount = 10;
    else if (creditsNum === 300) amount = 25;
    else if (creditsNum === 800) amount = 60;
    else if (creditsNum === 1500) amount = 110;
    else {
      return res.status(400).json({ message: 'Invalid credit package selected.' });
    }

    if (stripeInstance) {
      // Create Stripe Payment Intent
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amount * 100, // Stripe expects cents
        currency: 'usd',
        metadata: {
          supporterEmail: req.user.email,
          credits: creditsNum
        }
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        credits: creditsNum,
        isDummy: false
      });
    } else {
      // Dummy flow fallback
      const dummyIntentId = 'dummy_pi_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      return res.status(200).json({
        clientSecret: 'dummy_secret_key',
        paymentIntentId: dummyIntentId,
        amount,
        credits: creditsNum,
        isDummy: true
      });
    }

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error generating payment intent.' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, credits, amount } = req.body;
    const creditsNum = Number(credits);
    const amountNum = Number(amount);

    if (!paymentIntentId || isNaN(creditsNum) || isNaN(amountNum)) {
      return res.status(400).json({ message: 'Missing transaction information.' });
    }

    // Prevent duplicate processing
    const existingPayment = await Payment.findOne({ paymentIntentId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment has already been processed.' });
    }

    // Fetch Supporter User
    const supporter = await User.findById(req.user.id);
    if (!supporter) {
      return res.status(404).json({ message: 'Supporter account not found.' });
    }

    // Record Payment
    const payment = new Payment({
      supporterEmail: supporter.email,
      supporterName: supporter.name,
      credits: creditsNum,
      amount: amountNum,
      paymentIntentId,
      status: 'succeeded'
    });

    await payment.save();

    // Increase Supporter's credits
    supporter.credits += creditsNum;
    await supporter.save();

    // Send Notification
    await createNotification(
      `Successfully purchased ${creditsNum} credits for $${amountNum}. Your balance is now ${supporter.credits} credits.`,
      supporter.email,
      '/dashboard/supporter'
    );

    res.status(200).json({
      message: 'Payment confirmed and credits added successfully.',
      payment,
      userCredits: supporter.credits
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error confirming payment.' });
  }
};

const getSupporterPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ supporterEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get supporter payments error:', error);
    res.status(500).json({ message: 'Server error fetching payment history.' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getSupporterPayments
};
