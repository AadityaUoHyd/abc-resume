import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

class PaymentService {
  // Create Razorpay order
  async createOrder(planType = "premium") {
    try {
      const response = await axiosInstance.post(API_PATHS.PAYMENT.CREATE_ORDER, {
        planType
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create order");
    }
  }

  // Verify payment after successful payment
  async verifyPayment(paymentData) {
    try {
      const response = await axiosInstance.post(API_PATHS.PAYMENT.VERIFY, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Payment verification failed");
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await axiosInstance.get(API_PATHS.PAYMENT.HISTORY);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch payment history");
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      const response = await axiosInstance.get(API_PATHS.PAYMENT.ORDER_DETAILS(orderId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch order details");
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(orderData, userInfo) {
    return new Promise((resolve, reject) => {
      const options = {
        key: "add_your_razorpay_key", // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ABC Resume Pro",
        description: "Premium Subscription",
        order_id: orderData.orderId,
        receipt: orderData.receipt,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationResult = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve(verificationResult);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#8B5CF6", // Purple theme
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        reject(new Error("Razorpay SDK not loaded"));
      }
    });
  }
}

export default new PaymentService();
