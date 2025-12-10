import Paystack from "paystack";
const client = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export const initializePayment = async (req, res) => {
  const { email, amount } = req.body;

  try {
    const transaction = await client.transaction.initialize({
      email,
      amount: amount * 100,
      reference: `FOODVAULT_${Date.now()}`,
      callback_url: "http://localhost:3000/api/v1/payment/verify" // local callback
    });

    return res.json(transaction);
  } catch (err) {
    console.error("Initialization error:", err);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const ref = req.query.reference;

  if (!ref) return res.status(400).json({ message: "Reference is required" });

  try {
    const verification = await client.transaction.verify(ref);

    if (verification.data.status === "success") {
      return res.send("Payment successful!");
    } else {
      return res.send("Payment failed!");
    }
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: "Verification failed" });
  }
};
export const paystackWebhook = async (req, res) => {
  const hash = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_SECRET_KEY;   
  const payload = JSON.stringify(req.body);

  // Verify the signature
  const crypto = await import('crypto');
  const computedHash = crypto.createHmac('sha512', secret).update(payload).digest('hex');

  if (hash !== computedHash) {
    return res.status(400).send('Invalid signature');
  } 
  const event = req.body;

  if (event.event === 'charge.success') {
    const { reference, amount, metadata } = event.data; 
    const userId = metadata.userId;

    // Here you can update your database to mark the payment as successful
    console.log(`Payment successful for user ${userId} with reference ${reference} and amount ${amount}`);
  }
  res.sendStatus(200);
};
