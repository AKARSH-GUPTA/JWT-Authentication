import React, { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegistrationForm } from "./components/RegistrationForm";
import { SecureDashboard } from "./components/SecureDashboard";
import { Info, CheckCircle2, Accessibility } from "lucide-react";
import { getProfile } from "./components/authentication";
import LoadingScreen from "./components/Loading.jsx";

export default function App() {
  const [authScreen, setAuthScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      try {
        async function Fetcher() {
          const response = await getProfile(localStorage.getItem("token"));
          const data = {
            name: response.name,
            email: response.email,
            authtype: "Oauth",
            timestamp: new Date().toISOString(),
            message: response.message,
            type: "success",
          };
          handleAuthSuccess(data);
          setReady(true);
        }
        Fetcher();
      } catch (error) {
        triggerToast(error.message, "error");
      }
    } else {
      setTimeout(() => {
        setReady(true);
      }, 2000);
    }
  }, []);
  // Slide-In Notification Dispatcher
  function triggerToast(message, type) {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function handleAuthSuccess(userData) {
    if (userData.type === "success") {
      setCurrentUser(userData);
    }
    triggerToast(userData.message, userData.type);
  }

  function handleLogout() {
    setCurrentUser(null);
    localStorage.removeItem("token");
    setAuthScreen("login");
    triggerToast("Terminal session ended. Token registries cleared.", "info");
  }
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-surface-bg)",
          position: "relative",
        }}
      >
        {/* Primary Routing Container */}
        <div id="securedash-viewport">
          {ready ? (
            currentUser ? (
              // Screen 3: Dashboard Screen
              <SecureDashboard user={currentUser} onLogout={handleLogout} />
            ) : authScreen === "login" ? (
              // Screen 1: Login Form Screen
              <LoginForm
                onAuthenticationSuccess={handleAuthSuccess}
                onToggleScreen={() => setAuthScreen("register")}
              />
            ) : (
              // Screen 2: Registration Form Screen
              <RegistrationForm
                onAuthenticationSuccess={handleAuthSuccess}
                onToggleScreen={() => setAuthScreen("login")}
              />
            )
          ) : (
            <LoadingScreen />
          )}
        </div>

        {/* Slide-In Toast Notification Panel */}
        <div className="sec-toast-shelf">
          {toasts.map((toast) => (
            <div key={toast.id} className="sec-toast" id={`toast-${toast.id}`}>
              <span className="sec-toast-icon">
                {toast.type === "success" ? (
                  <CheckCircle2 size={16} className="sec-toast-success-icon" />
                ) : (
                  <Info size={16} className="sec-toast-info-icon" />
                )}
              </span>
              <div className="sec-toast-content">
                <span>{toast.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
