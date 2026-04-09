const Transaction = require('../models/Transaction');
const { Client, Environment, OrdersController } = require('@paypal/paypal-server-sdk');

// SDK Setup
const client = new Client({
  clientCredentialsAuthCredentials: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_SECRET,
  },
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

const ordersController = new OrdersController(client);

// POST /api/payments/create-order
exports.createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'USD' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const orderRequest = {
      intent: 'CAPTURE',
      purchaseUnits: [{
        amount: {
          currencyCode: currency,
          value: amount.toString(),
        },
      }],
    };

    const { result } = await ordersController.ordersCreate({ body: orderRequest });

    res.status(200).json({
      success: true,
      data: { orderId: result.id },
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

    const { result } = await ordersController.ordersCapture({ id: orderID });

    // Success if status is COMPLETED
    let transaction = null;
    if (transactionData && result.status === 'COMPLETED') {
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
    console.error('PayPal capture error:', error.message);
    next(error);
  }
};
