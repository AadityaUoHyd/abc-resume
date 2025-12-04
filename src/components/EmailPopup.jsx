import React, { useState } from "react";
import { Mail, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { generatePDFBlob } from "../utils/pdfGenerator";

const EmailPopup = ({ isOpen, onClose, resumeId, resumeTitle, resumePreviewRef }) => {
  const [emailData, setEmailData] = useState({
    recipientEmail: "",
    subject: `Resume - ${resumeTitle}`,
    message: "Please find my resume attached.\n\nBest regards"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendEmail = async () => {
    if (!emailData.recipientEmail.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(emailData.recipientEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!resumePreviewRef?.current) {
      toast.error("Resume preview not found. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("Generating PDF and sending email...", { id: "email-send" });

      // Generate PDF from resume preview (compressed)
      const pdfBlob = await generatePDFBlob(resumePreviewRef.current, { quality: 0.8, scale: 1.6 });

      // Check size before uploading (keep headroom under 20MB)
      const sizeMB = (pdfBlob.size / (1024 * 1024)).toFixed(2);
      if (pdfBlob.size > 18 * 1024 * 1024) {
        toast.error(`Generated PDF is too large (${sizeMB} MB). Try reducing content or switching template/colors.`, { id: "email-send" });
        setIsLoading(false);
        return;
      }

      // Create FormData for multipart request
      const formData = new FormData();
      formData.append('recipientEmail', emailData.recipientEmail);
      formData.append('subject', emailData.subject);
      formData.append('message', emailData.message.replace(/\n/g, '<br>'));
      formData.append('pdfFile', pdfBlob, `${resumeTitle || 'resume'}.pdf`);

      const response = await axiosInstance.post(API_PATHS.EMAIL.SEND_RESUME, formData);

      if (response.data.success) {
        toast.success("Resume sent successfully!", { id: "email-send" });
        onClose();
        // Reset form
        setEmailData({
          recipientEmail: "",
          subject: `Resume - ${resumeTitle}`,
          message: "Please find my resume attached.\n\nBest regards"
        });
      } else {
        console.error('Email send failed:', response.data);
        toast.error(response.data.message || "Failed to send email", { id: "email-send" });
      }
    } catch (error) {
      console.error("Email send error:", error);
      if (error.message.includes('PDF')) {
        toast.error("Failed to generate PDF. Please try again.", { id: "email-send" });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to send email. Please try again.",
          { id: "email-send" }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Send Resume via Email</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Recipient Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email *
            </label>
            <input
              type="email"
              value={emailData.recipientEmail}
              onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
              placeholder="Enter recipient email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Email subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Enter your message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;
