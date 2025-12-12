import crypto from "crypto";
import logger from "../utils/logger.js";
import { PAYSTACK_SECRET } from "../config/env.js"; // Ensure this is exported from config/env.js or process.env

const webhook = async (req, res) => {
   try {
      const secret = process.env.PAYSTACK_SECRET || PAYSTACK_SECRET;

      if (!secret) {
         logger.error("PAYSTACK_SECRET is not defined in environment");
         return res.status(500).send("Webhook configuration error");
      }

      // Validate event
      const hash = crypto
         .createHmac("sha512", secret)
         .update(JSON.stringify(req.body))
         .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
         logger.warn("Invalid Paystack Webhook Signature attempt");
         return res.status(400).send("Invalid Signature");
      }

      const { event, data } = req.body;
      logger.info(`Webhook event received: ${event}`);

      // Retrieve the HTTP method
      // Paystack webhooks are always POST, but we can check if needed

      switch (event) {
         case "charge.success":
            // Handle successful charge
            logger.info(`Charge successful for reference: ${data.reference}`);
            // await processPaymentSuccess(data);
            break;

         case "transfer.success":
            logger.info(`Transfer successful: ${data.reference}`);
            break;

         default:
            logger.info(`Unhandled webhook event: ${event}`);
      }

      res.status(200).send("Webhook received");
   } catch (error) {
      logger.error(`Webhook Error: ${error.message}`);
      res.status(500).send("Server Error");
   }
};

export default webhook;