import axios from "axios";

class PaystackService {
    constructor() {
        this.baseURL = process.env.PAYSTACK_BASE_URL;
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
        this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;

        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                "Content-Type": "application/json",
            },
        });
    }

    // Initialize transaction
    async initializeTransaction(email, amount, metadata = {}) {
        try {
            const response = await this.axiosInstance.post(
                "/transaction/initialize",
                {
                    email,
                    amount: amount * 100, // convert to kobo
                    metadata,
                    callback_url: `${process.env.FRONTEND_URL}/verify-payment`,
                }
            );

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(
                "Paystack initialization error:",
                error.response?.data || error.message
            );

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to initialize transaction",
            };
        }
    }

    // Verify transaction
    async verifyTransaction(reference) {
        try {
            const response = await this.axiosInstance.get(
                `/transaction/verify/${reference}`
            );

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(
                "Paystack verification error:",
                error.response?.data || error.message
            );

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to verify transaction",
            };
        }
    }

    // Create transfer recipient
    async createTransferRecipient(name, accountNumber, bankCode) {
        try {
            const response = await this.axiosInstance.post(
                "/transferrecipient",
                {
                    type: "nuban",
                    name,
                    account_number: accountNumber,
                    bank_code: bankCode,
                    currency: "NGN",
                }
            );

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(
                "Paystack create recipient error:",
                error.response?.data || error.message
            );

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to create transfer recipient",
            };
        }
    }

    // Initiate transfer
    async initiateTransfer(recipientCode, amount, reason) {
        try {
            const response = await this.axiosInstance.post("/transfer", {
                source: "balance",
                amount: amount * 100,
                recipient: recipientCode,
                reason,
            });

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(
                "Paystack transfer error:",
                error.response?.data || error.message
            );

            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to initiate transfer",
            };
        }
    }

    // Check balance
    async checkBalance() {
        try {
            const response = await this.axiosInstance.get("/balance");

            return {
                success: true,
                data: response.data.data,
            };
        } catch (error) {
            console.error(
                "Paystack balance check error:",
                error.response?.data || error.message
            );

            return {
                success: false,
                error: "Failed to check balance",
            };
        }
    }
}

export default new PaystackService();
