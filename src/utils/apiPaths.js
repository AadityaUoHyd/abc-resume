export const BASE_URL = import.meta.env.VITE_BACKEND_URL ||"http://localhost:8080";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    UPLOAD_IMAGE: "/api/auth/upload-image",
    TEMPLATES: "/api/templates",
    RESEND_VERIFICATION: "/api/auth/resend-verification",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },
  RESUME: {
    CREATE: "/api/resumes",
    GET_ALL: "/api/resumes",
    GET_BY_ID: (id) => `/api/resumes/${id}`,
    UPDATE: (id) => `/api/resumes/${id}`,
    DELETE: (id) => `/api/resumes/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resumes/${id}/upload-images`,
  },
  PAYMENT: {
    CREATE_ORDER: "/api/payment/create-order",
    VERIFY: "/api/payment/verify",
    HISTORY: "/api/payment/history",
    ORDER_DETAILS: (orderId) => `/api/payment/order/${orderId}`,
  },
  EMAIL: {
    SEND_RESUME: "/api/email/send-resume",
  },
};
