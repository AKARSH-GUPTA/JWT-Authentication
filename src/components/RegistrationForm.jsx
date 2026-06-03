import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Register } from "./authentication.js";
export function RegistrationForm({ onAuthenticationSuccess, onToggleScreen }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    let valid = true;

    // Reset errors
    setErrors({ email: "", password: "", confirmPassword: "" });

    // Email validation
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!formData.email.match(emailPattern)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email (example@gmail.com)",
      }));
      valid = false;
    }

    // Password validation
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.password.match(passwordPattern)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must contain uppercase, lowercase, number, and special character",
      }));
      valid = false;
    }
    if (!(formData.confirmPassword === formData.password)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      valid = false;
    }
    if (valid) {
      setLoading(true);
      try {
        const data = await Register(
          formData.fullName,
          formData.email,
          formData.password,
        );
        if (data.registered) {
          setLoading(false);
          onAuthenticationSuccess({
            name: data.name,
            email: data.email,
            authType: "Credentials-Register",
            timestamp: new Date().toISOString(),
            message: data.message,
            type: "success",
          });
          localStorage.setItem("token", data.token);
        } else {
          setLoading(false);
          onAuthenticationSuccess({
            timestamp: new Date().toISOString(),
            message: data.message,
            type: "error",
          });
        }
      } catch (err) {
        setLoading(false);
        onAuthenticationSuccess({
          timestamp: new Date().toISOString(),
          message: "Server Error Please Try Again",
          type: "error",
        });
      }
    }
  }

  return (
    <div className="sec-auth-container" id="registration-screen">
      <div className="sec-auth-glow" />

      <div className="sec-auth-card">
        {/* Header Block with SecureLogo */}
        <div className="sec-logo-wrap">
          <h2 className="sec-title">Create an account</h2>
          <p className="sec-subtitle">
            Enter your details to get started securely
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="sec-form-group">
            <label className="sec-form-label">Full Name</label>
            <div className="sec-input-wrapper">
              <span className="sec-input-icon">
                <User size={16} />
              </span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`sec-input sec-input-with-icon ${errors.fullName ? "sec-input-error" : ""}`}
              />
            </div>
            {errors.fullName && (
              <div className="sec-error-block">
                <AlertCircle size={14} />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="sec-form-group">
            <label className="sec-form-label">Email Address</label>
            <div className="sec-input-wrapper">
              <span className="sec-input-icon">
                <Mail size={16} />
              </span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@company.com"
                className={`sec-input sec-input-with-icon ${errors.email ? "sec-input-error" : ""}`}
              />
            </div>
            {errors.email && (
              <div className="sec-error-block">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Twin Fields */}
          <div className="sec-grid-twin">
            <div className="sec-form-group" style={{ marginBottom: 0 }}>
              <label className="sec-form-label">Password</label>
              <div className="sec-input-wrapper">
                <span className="sec-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`sec-input sec-input-with-icon ${errors.password ? "sec-input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="sec-password-eye"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="sec-error-block">
                  <span style={{ fontSize: "10px" }}>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="sec-form-group" style={{ marginBottom: 0 }}>
              <label className="sec-form-label">Confirm Password</label>
              <div className="sec-input-wrapper">
                <span className="sec-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`sec-input sec-input-with-icon ${errors.confirmPassword ? "sec-input-error" : ""}`}
                />
              </div>
              {errors.confirmPassword && (
                <div className="sec-error-block">
                  <span style={{ fontSize: "10px" }}>
                    {errors.confirmPassword}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="sec-btn-submit">
            {loading ? <span className="sec-spinner" /> : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="sec-divider">
          <span className="sec-divider-text">Or Continue With</span>
        </div>

        {/* OAuth Grid */}
        <div className="sec-social-grid">
          <button type="button" className="sec-btn-social-google">
            <svg
              style={{ width: "16px", height: "16px" }}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>
              <a href="http://localhost:4000/auth/google">Google</a>
            </span>
          </button>

          <button type="button" className="sec-btn-social-github">
            <svg
              style={{ width: "16px", height: "16px", fill: "#FFFFFF" }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.16 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>
              <a href="http://localhost:4000/auth/github">GitHub</a>
            </span>
          </button>
        </div>

        {/* Link back */}
        <div className="sec-toggle-text">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onToggleScreen}
            className="sec-toggle-link"
          >
            Sign in instead
          </button>
        </div>
      </div>

      {/* External Card Footer */}
      <div className="sec-card-footer">
        <span>© 2026 Akarsh Gupta. All rights reserved.</span>
      </div>
    </div>
  );
}
