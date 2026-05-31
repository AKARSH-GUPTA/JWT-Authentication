import React, { useState } from "react";
import { Login } from "./authentication";
import { AlertCircle, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export function LoginForm({ onAuthenticationSuccess, onToggleScreen }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    setErrors({ email: "", password: "" });

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

    if (valid) {
      setLoading(true);
      try {
        const data = await Login(formData.email, formData.password);
        if (data.authenticated) {
          setLoading(false);
          onAuthenticationSuccess({
            name: data.name,
            email: data.email,
            authType: "Credentials-Login",
            timestamp: new Date().toISOString(),
            message: data.message,
            type: "success",
            token: data.token,
          });
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
    <div className="sec-auth-container" id="login-screen">
      <div className="sec-auth-glow" />

      <div className="sec-auth-card">
        {/* Header Block with SecureLogo */}
        <div className="sec-logo-wrap">
          <h2 className="sec-title">Welcome back</h2>
          <p className="sec-subtitle">
            Enter your credentials to access your workspace
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit}>
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

          {/* Password */}
          <div className="sec-form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <label className="sec-form-label" style={{ margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Verification code issued to mock server. Reset pipeline active.",
                  )
                }
                className="sec-toggle-link"
                style={{ fontSize: "11px", fontWeight: "500" }}
              >
                Forgot?
              </button>
            </div>
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
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Login Submit Button */}
          <button type="submit" disabled={loading} className="sec-btn-submit">
            {loading ? (
              <span className="sec-spinner" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Center Divider */}
        <div className="sec-divider">
          <span className="sec-divider-text">Or Continue With</span>
        </div>

        {/* OAuth grid */}
        <div className="sec-social-grid">
          <button
            type="button"
            onClick={() => alert("this strategy is under process")}
            className="sec-btn-social-google"
          >
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
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => alert("this strategy is under process")}
            className="sec-btn-social-github"
          >
            <svg
              style={{ width: "16px", height: "16px", fill: "#FFFFFF" }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.16 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Toggle link style */}
        <div className="sec-toggle-text">
          <span>Don't have an account yet? </span>
          <button
            type="button"
            onClick={onToggleScreen}
            className="sec-toggle-link"
          >
            Sign up instead
          </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="sec-card-footer">
        <span>© 2026 Akarsh Gupta. All rights reserved.</span>
      </div>
    </div>
  );
}
