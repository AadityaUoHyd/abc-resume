import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setNeedsVerification(false);
    setIsSubmitting(true);

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      if (msg.toLowerCase().includes("verify your email")) {
        setNeedsVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION, { email });
      setError(null);
      alert("Verification email resent. Please check your inbox.");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend verification email. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="your.email@example.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        {needsVerification && (
          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={handleResendVerification}
            >
              Resend verification email
            </button>
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "PLEASE WAIT..." : "LOGIN"}
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don’t have an account?{" "}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
