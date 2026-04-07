const Transaction = require('../models/Transaction');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

// Generate access token
const generateAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('Missing PayPal credentials in .env');
  }
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Failed to generate token');
  return data.access_token;
};

// POST /api/payments/create-order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'USD' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const accessToken = await generateAccessToken();
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: amount.toString() } }],
    };

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create PayPal order');

    res.status(200).json({
      success: true,
      data: { orderId: data.id },
    });
  } catch (error) {
    console.error('PayPal create order error:', error.message);
    next(error);
  }
};

// POST /api/payments/verify (captures the order)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderID, transactionData } = req.body;

    if (!orderID) {
      return res.status(400).json({ success: false, message: 'Missing orderID' });
    }

    const accessToken = await generateAccessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
       // PayPal sends details array on error
       const msg = data.details ? data.details[0].description : data.message;
       throw new Error(msg || 'Payment capture failed');
    }

    // Save transaction if payment was completed
    let transaction = null;
    if (transactionData && data.status === 'COMPLETED') {
      transaction = await Transaction.create({
        ...transactionData,
        userId: req.user.id,
        note: `PayPal payment: ${orderID}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: { transaction, paymentId: orderID },
    });
  } catch (error) {
    next(error);
  }
};
