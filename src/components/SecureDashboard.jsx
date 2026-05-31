import React, { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Terminal,
  Activity,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Sliders,
  Lock,
  Wifi,
  Users,
} from "lucide-react";

export function SecureDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");

  // State for API Keys Generator
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Production-Main-Gateway",
      key: "sd_live_8f3900aee36dbd9921",
      status: "active",
      created: "2026-05-30",
    },
    {
      id: "2",
      name: "Stripe-Webhook-Validator",
      key: "sd_live_211cdb0e00f91aa2bc",
      status: "active",
      created: "2026-05-31",
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [recentlyCopiedId, setRecentlyCopiedId] = useState("");

  // State for Audit Logs filter
  const [logFilter, setLogFilter] = useState("");
  const [logs, setLogs] = useState([
    {
      timestamp: "2026-05-31 12:45:12",
      type: "INFO",
      message: "Security handshake completed successfully from IP 104.28.32.1",
      action: "Handshake",
    },
    {
      timestamp: "2026-05-31 12:44:03",
      type: "AUDIT",
      message: "API key 'Stripe-Webhook-Validator' created securely",
      action: "Key Generation",
    },
    {
      timestamp: "2026-05-31 12:35:19",
      type: "SECURITY",
      message: "Environment variable decryption keys successfully rotated",
      action: "Rotation",
    },
    {
      timestamp: "2026-05-31 12:30:00",
      type: "SYSTEM",
      message: "Core trust parameters verified in Cloud HSM",
      action: "HSM Sync",
    },
    {
      timestamp: "2026-05-31 12:15:32",
      type: "WARN",
      message: "Rate limit warnings dismissed for client core-node-184",
      action: "Cleanup",
    },
  ]);

  // Security variables toggling
  const [settings, setSettings] = useState({
    enforceMfa: true,
    ipWhitelisting: false,
    autoRotateKeys: true,
    realTimeLogStreaming: true,
  });

  // Automatically stream a new simulation log entry every 15 seconds
  useEffect(() => {
    if (!settings.realTimeLogStreaming) return;

    const phrases = [
      "Access token issued for node client-7798b",
      "Decryption pipeline re-allocated from US-East security sector",
      "Automated threat inspection verified 0 critical exposures",
      "Network proxy handshake completed for user session: " + user.email,
      "Log vault encrypted and backed up to permanent archival block",
    ];

    const actions = [
      "Auth Token",
      "Decryption",
      "Threat Scan",
      "Handshake",
      "Archival",
    ];
    const types = ["INFO", "AUDIT", "SYSTEM", "INFO", "AUDIT"];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * phrases.length);
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      setLogs((prev) => [
        {
          timestamp: timeStr,
          type: types[idx],
          message: phrases[idx],
          action: actions[idx],
        },
        ...prev.slice(0, 15), // Limit log buffer
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, [settings.realTimeLogStreaming, user.email]);

  const handleGenerateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const chars = "abcdef0123456789";
    let randomHex = "";
    for (let i = 0; i < 18; i++) {
      randomHex += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      key: `sd_live_${randomHex}`,
      status: "active",
      created: new Date().toISOString().split("T")[0],
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");

    // Insert audit log
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLogs((prev) => [
      {
        timestamp: timeStr,
        type: "AUDIT",
        message: `New API key '${newKey.name}' issued by user ${user.email}`,
        action: "Key Generation",
      },
      ...prev,
    ]);
  };

  const handleRevokeKey = (id, name) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));

    // Insert audit log
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setLogs((prev) => [
      {
        timestamp: timeStr,
        type: "WARN",
        message: `API Key '${name}' revoked by administrator`,
        action: "Revocation",
      },
      ...prev,
    ]);
  };

  const handleCopyToClipboard = (id, keyString) => {
    navigator.clipboard.writeText(keyString);
    setRecentlyCopiedId(id);
    setTimeout(() => setRecentlyCopiedId(""), 2000);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.message.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.action.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.type.toLowerCase().includes(logFilter.toLowerCase()),
  );

  return (
    <div className="sec-dash-layout" id="securedash-workspace-root">
      {/* Sidebar Panel Layout */}
      <aside className="sec-dash-sidebar" id="sidebar-panel">
        {/* Sidebar Header Brand */}
        <div className="sec-sidebar-brand">
          <div>
            <h1 className="sec-sidebar-brand-title">SecureDash Inc.</h1>
            <p className="sec-sidebar-brand-status">
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  marginRight: "4px",
                }}
              />
              Vault Active
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sec-sidebar-nav">
          <p className="sec-sidebar-section-title">Workspace Core</p>

          <button
            onClick={() => setActiveTab("overview")}
            className={`sec-sidebar-item ${activeTab === "overview" ? "sec-sidebar-item-active" : ""}`}
          >
            <Shield size={16} />
            <span>Overview & Assets</span>
          </button>

          <button
            onClick={() => setActiveTab("apiKeys")}
            className={`sec-sidebar-item ${activeTab === "apiKeys" ? "sec-sidebar-item-active" : ""}`}
          >
            <Key size={16} />
            <span>API Vault Keys</span>
            {apiKeys.length > 0 && (
              <span className="sec-sidebar-item-badge">{apiKeys.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("audits")}
            className={`sec-sidebar-item ${activeTab === "audits" ? "sec-sidebar-item-active" : ""}`}
          >
            <Terminal size={16} />
            <span>Integrity Audits</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`sec-sidebar-item ${activeTab === "settings" ? "sec-sidebar-item-active" : ""}`}
          >
            <Settings size={16} />
            <span>Workspace Config</span>
          </button>
        </nav>

        {/* Profile Footer */}
        <div className="sec-sidebar-profile">
          <div className="sec-profile-card">
            <div className="sec-profile-avatar">
              {user.name ? user.name.slice(0, 2) : "AD"}
            </div>
            <div className="sec-profile-details">
              <h4 className="sec-profile-name">
                {user.name || "Administrator"}
              </h4>
              <p className="sec-profile-email">
                {user.email || "admin@company.com"}
              </p>
            </div>
          </div>
          <button onClick={onLogout} className="sec-btn-logout">
            <LogOut size={14} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="sec-dash-main">
        {/* Header bar */}
        <header className="sec-dash-header">
          <div>
            <h2 className="sec-dash-title">Secure Dashboard</h2>
            <p className="sec-dash-subtitle">
              Active identity synchronized. Review security logs and configure
              workspace access keys.
            </p>
          </div>
          <div className="sec-dash-badge-row">
            <span className="sec-dash-badge">
              Moniker: {user.authType || "Credentials"}
            </span>
            <span
              className="sec-dash-badge"
              style={{ color: "#004ced", backgroundColor: "#eff6ff" }}
            >
              Active Tenant Isolation
            </span>
          </div>
        </header>

        <div>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Stats metric cards */}
              <div className="sec-metrics-grid">
                <div className="sec-metric-card">
                  <div
                    className="sec-metric-icon-wrap"
                    style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}
                  >
                    <Shield size={20} />
                  </div>
                  <div className="sec-metric-info">
                    <span className="sec-metric-label">
                      Workspace Integrity
                    </span>
                    <span className="sec-metric-value">Compliant</span>
                    <span
                      className="sec-metric-subtext"
                      style={{ color: "#15803d" }}
                    >
                      Vault connection secure
                    </span>
                  </div>
                </div>

                <div className="sec-metric-card">
                  <div
                    className="sec-metric-icon-wrap"
                    style={{ backgroundColor: "#eff6ff", color: "#004ced" }}
                  >
                    <Key size={20} />
                  </div>
                  <div className="sec-metric-info">
                    <span className="sec-metric-label">
                      Decryption Gateways
                    </span>
                    <span className="sec-metric-value">
                      {apiKeys.length} Active
                    </span>
                    <span
                      className="sec-metric-subtext"
                      style={{ color: "#004ced" }}
                    >
                      Authorization links live
                    </span>
                  </div>
                </div>

                <div className="sec-metric-card">
                  <div
                    className="sec-metric-icon-wrap"
                    style={{ backgroundColor: "#faf5ff", color: "#7e22ce" }}
                  >
                    <Users size={20} />
                  </div>
                  <div className="sec-metric-info">
                    <span className="sec-metric-label">Authorized Tenants</span>
                    <span className="sec-metric-value">1 Isolated</span>
                    <span
                      className="sec-metric-subtext"
                      style={{ color: "#7e22ce" }}
                    >
                      Single-user environment
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats details section */}
              <div className="sec-pane-grid">
                <div className="sec-dash-pane">
                  <div className="sec-pane-header">
                    <h3 className="sec-pane-title">Vault Settings Overview</h3>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="sec-pane-header-action"
                    >
                      Manage Policy
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.875rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            display: "block",
                          }}
                        >
                          Multi-Factor Authentication
                        </span>
                        <span
                          style={{ fontSize: "0.6875rem", color: "#535668" }}
                        >
                          Require code verification constraints.
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: settings.enforceMfa ? "#15803d" : "#ef4444",
                        }}
                      >
                        {settings.enforceMfa ? "ACTIVE" : "DISABLED"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.875rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            display: "block",
                          }}
                        >
                          Key Rotation (30 days)
                        </span>
                        <span
                          style={{ fontSize: "0.6875rem", color: "#535668" }}
                        >
                          Auto-recycle secret tokens.
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: settings.autoRotateKeys
                            ? "#15803d"
                            : "#ef4444",
                        }}
                      >
                        {settings.autoRotateKeys ? "ENFORCED" : "OFF"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.875rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            display: "block",
                          }}
                        >
                          Workspace IP Whitelisting
                        </span>
                        <span
                          style={{ fontSize: "0.6875rem", color: "#535668" }}
                        >
                          Restrict to whitelisted IP blocks.
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: settings.ipWhitelisting
                            ? "#15803d"
                            : "#8f92a1",
                        }}
                      >
                        {settings.ipWhitelisting ? "ACTIVE" : "CONFIG_OPEN"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sec-dash-pane">
                  <div className="sec-pane-header">
                    <h3 className="sec-pane-title">Integrity Stream</h3>
                    <button
                      onClick={() => setActiveTab("audits")}
                      className="sec-pane-header-action"
                    >
                      Logs Console
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      overflowY: "auto",
                      maxHeight: "180px",
                    }}
                  >
                    {logs.slice(0, 4).map((l, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.5rem",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "0.6875rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "#8f92a1",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "0.125rem",
                          }}
                        >
                          <span>[{l.timestamp.split(" ")[1]}]</span>
                          <span style={{ fontWeight: 700, color: "#004ced" }}>
                            {l.type}
                          </span>
                        </div>
                        <p style={{ fontWeight: 500, color: "#191c1e" }}>
                          {l.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API KEY SCHEME TAB */}
          {activeTab === "apiKeys" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div className="sec-keys-generator">
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    marginBottom: "0.375rem",
                  }}
                >
                  Generate Live Token
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#535668",
                    marginBottom: "1.25rem",
                  }}
                >
                  Create secure access credentials for server integrations and
                  background task runners.
                </p>
                <form
                  onSubmit={handleGenerateKey}
                  style={{ display: "flex", gap: "0.75rem" }}
                >
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Stripe-Webhooks-Main"
                    className="sec-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="sec-btn-submit"
                    style={{
                      width: "auto",
                      margin: 0,
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                    }}
                  >
                    <Plus size={16} />
                    <span>Issue Token</span>
                  </button>
                </form>
              </div>

              <div className="sec-keys-grid">
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #f1f5f9",
                    backgroundColor: "#fafbfc",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#8f92a1",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Issued Gateways
                  </h3>
                </div>

                {apiKeys.length === 0 ? (
                  <div
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "#8f92a1",
                    }}
                  >
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      No active API key credentials
                    </p>
                    <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      Use the generator above to establish a secure link.
                    </p>
                  </div>
                ) : (
                  <div>
                    {apiKeys.map((k) => (
                      <div key={k.id} className="sec-key-item">
                        <div className="sec-key-meta">
                          <span className="sec-key-title">{k.name}</span>
                          <div className="sec-key-hash">
                            <span>{k.key}</span>
                            <button
                              onClick={() => handleCopyToClipboard(k.id, k.key)}
                              className="sec-key-btn-copy"
                              title="Copy to clipboard"
                            >
                              {recentlyCopiedId === k.id ? (
                                <span
                                  style={{
                                    color: "#15803d",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                  }}
                                >
                                  Copied!
                                </span>
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                          <span
                            style={{ fontSize: "0.625rem", color: "#8f92a1" }}
                          >
                            Issued: {k.created}
                          </span>
                        </div>

                        <div className="sec-key-action-row">
                          <span className="sec-key-badge">Live</span>
                          <button
                            onClick={() => handleRevokeKey(k.id, k.name)}
                            className="sec-key-btn-revoke"
                            title="Revoke access token"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INTEGRITY AUDIT LOGS TAB */}
          {activeTab === "audits" && (
            <div className="sec-dash-pane">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
                    Decentralized Security Log
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#8f92a1",
                      marginTop: "0.125rem",
                    }}
                  >
                    Synchronously signed compliance entries recorded by secure
                    kernels.
                  </p>
                </div>

                <div
                  className="sec-input-wrapper"
                  style={{ minWidth: "220px" }}
                >
                  <span className="sec-input-icon">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    placeholder="Filter transaction messages..."
                    className="sec-input sec-input-with-icon"
                    style={{
                      paddingTop: "0.4rem",
                      paddingBottom: "0.4rem",
                      fontSize: "0.75rem",
                    }}
                  />
                </div>
              </div>

              <div className="sec-terminal">
                <div className="sec-terminal-header">
                  <div className="sec-terminal-dots">
                    <span
                      className="sec-terminal-dot"
                      style={{ backgroundColor: "#ef4444" }}
                    />
                    <span
                      className="sec-terminal-dot"
                      style={{ backgroundColor: "#eab308" }}
                    />
                    <span
                      className="sec-terminal-dot"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                  </div>
                  <span className="sec-terminal-title">
                    secure_integrity_daemon.log
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#22c55e",
                      }}
                    >
                      FEED_LIVE
                    </span>
                  </div>
                </div>

                <div className="sec-terminal-feed">
                  {filteredLogs.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "#8c8f9c",
                      }}
                    >
                      &lt; No matching transactions logs found matching &quot;
                      {logFilter}&quot; &gt;
                    </div>
                  ) : (
                    <div>
                      {filteredLogs.map((log, index) => (
                        <div key={index} className="sec-log-row">
                          <span className="sec-log-time">
                            [{log.timestamp.split(" ")[1]}]
                          </span>
                          <span
                            className="sec-log-indicator"
                            style={{
                              color:
                                log.type === "INFO"
                                  ? "#60a5fa"
                                  : log.type === "AUDIT"
                                    ? "#c084fc"
                                    : log.type === "WARN"
                                      ? "#fbbf24"
                                      : "#34d399",
                            }}
                          >
                            [{log.type}]
                          </span>
                          <span style={{ color: "#8c8f9c" }}>
                            &lt;{log.action}&gt;
                          </span>
                          <span className="sec-log-message">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED CONFIGURATION TAB */}
          {activeTab === "settings" && (
            <div className="sec-dash-pane">
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                Workspace Policy Variables
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#535668",
                  marginBottom: "1.5rem",
                }}
              >
                Modify secure enforcement configurations immediately on the
                client-side context.
              </p>

              <div>
                <div className="sec-toggle-item">
                  <div className="sec-toggle-details">
                    <span className="sec-toggle-title">
                      Enforce Multi-Factor Access
                    </span>
                    <span className="sec-toggle-desc">
                      Require verification parameters for credential changes.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, enforceMfa: !s.enforceMfa }))
                    }
                    className={`sec-switch ${settings.enforceMfa ? "sec-switch-active" : ""}`}
                  >
                    <span className="sec-switch-knob" />
                  </button>
                </div>

                <div className="sec-toggle-item">
                  <div className="sec-toggle-details">
                    <span className="sec-toggle-title">
                      Dynamic Key Rotator
                    </span>
                    <span className="sec-toggle-desc">
                      Automated system invalidate and recycle keys silently
                      every 30 days.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        autoRotateKeys: !s.autoRotateKeys,
                      }))
                    }
                    className={`sec-switch ${settings.autoRotateKeys ? "sec-switch-active" : ""}`}
                  >
                    <span className="sec-switch-knob" />
                  </button>
                </div>

                <div className="sec-toggle-item">
                  <div className="sec-toggle-details">
                    <span className="sec-toggle-title">
                      Workspace IP Whitelisting
                    </span>
                    <span className="sec-toggle-desc">
                      Restrict decryption handshakes solely to whitelisted
                      company networks.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        ipWhitelisting: !s.ipWhitelisting,
                      }))
                    }
                    className={`sec-switch ${settings.ipWhitelisting ? "sec-switch-active" : ""}`}
                  >
                    <span className="sec-switch-knob" />
                  </button>
                </div>

                <div className="sec-toggle-item">
                  <div className="sec-toggle-details">
                    <span className="sec-toggle-title">
                      Real-Time Log Stream Simulation
                    </span>
                    <span className="sec-toggle-desc">
                      Inject simulated live audit daemon messages directly into
                      current view buffer context.
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        realTimeLogStreaming: !s.realTimeLogStreaming,
                      }))
                    }
                    className={`sec-switch ${settings.realTimeLogStreaming ? "sec-switch-active" : ""}`}
                  >
                    <span className="sec-switch-knob" />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1.5rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  onClick={() =>
                    alert("Policy variables committed successfully.")
                  }
                  className="sec-btn-submit"
                  style={{
                    width: "auto",
                    margin: 0,
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                >
                  Commit Configurations
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
