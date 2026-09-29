"use client";

import { useEffect, useMemo, useState } from "react";

type Screen =
  | "login"
  | "dashboard"
  | "services"
  | "usage"
  | "bill"
  | "payment"
  | "receipt"
  | "activity"
  | "wallet";

type UsageData = {
  usage_id: number;
  status: string;
  start_time: string;
};

type StoppedUsageData = {
  usage_id: number;
  quantity: number;
  status: string;
};

type BillData = {
  bill_id: number;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
};

type PaymentData = {
  status: string;
  tx_hash: string;
  receipt_id: number;
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [stoppedUsage, setStoppedUsage] =
    useState<StoppedUsageData | null>(null);

  const [bill, setBill] = useState<BillData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  const [txHash, setTxHash] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [mobileMenu, setMobileMenu] = useState(false);

  const workspaceRate = 50;

  /* -------------------------------------------------------
     TIMER
  ------------------------------------------------------- */

  useEffect(() => {
    if (!usage?.start_time || usage.status !== "active") {
      return;
    }

    const updateTimer = () => {
      const start = new Date(usage.start_time).getTime();
      const now = Date.now();

      const seconds = Math.max(
        0,
        Math.floor((now - start) / 1000)
      );

      setElapsedSeconds(seconds);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [usage]);

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(
      mins
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const estimatedCost = useMemo(() => {
    const hours = elapsedSeconds / 3600;
    return hours * workspaceRate;
  }, [elapsedSeconds]);

  const clearError = () => setError("");

  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    clearError();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    /*
      Current project stage:
      Login UI is ready.
      Real authentication can be connected later when
      the backend authentication endpoint is available.
    */

    setScreen("dashboard");
  };

  /* -------------------------------------------------------
     WALLET
  ------------------------------------------------------- */

  const connectWallet = async () => {
    clearError();

    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        setError(
          "No compatible Web3 wallet detected. Install a compatible wallet extension."
        );
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      }
    } catch (err) {
      setError("Wallet connection was cancelled or failed.");
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
  };

  /* -------------------------------------------------------
     START USAGE
  ------------------------------------------------------- */

  const startUsage = async () => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`${apiUrl}/usage/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          service_id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to start usage.");
      }

      const data: UsageData = await response.json();

      setUsage(data);
      setStoppedUsage(null);
      setBill(null);
      setPayment(null);
      setTxHash("");
      setElapsedSeconds(0);

      setScreen("usage");
    } catch (err) {
      setError(
        "Could not start usage. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     STOP USAGE
  ------------------------------------------------------- */

  const stopUsage = async () => {
    if (!usage) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await fetch(`${apiUrl}/usage/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usage_id: usage.usage_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to stop usage.");
      }

      const data: StoppedUsageData = await response.json();

      setStoppedUsage(data);

      await generateBill(data.usage_id);
    } catch (err) {
      setError(
        "Could not stop usage. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     GENERATE BILL
  ------------------------------------------------------- */

  const generateBill = async (usageId: number) => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`${apiUrl}/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usage_id: usageId,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to generate bill.");
      }

      const data: BillData = await response.json();

      setBill(data);
      setScreen("bill");
    } catch (err) {
      setError(
        "Could not generate bill. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     RECORD PAYMENT
  ------------------------------------------------------- */

  const recordPayment = async () => {
    if (!bill) {
      return;
    }

    if (!txHash.trim()) {
      setError("Please enter the MST transaction hash.");
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await fetch(`${apiUrl}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bill_id: bill.bill_id,
          amount: bill.total,
          tx_hash: txHash.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to record payment.");
      }

      const data: PaymentData = await response.json();

      setPayment(data);
      setScreen("receipt");
    } catch (err) {
      setError(
        "Could not record payment. Please check the payment API."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  const navigate = (target: Screen) => {
    setMobileMenu(false);
    clearError();
    setScreen(target);
  };

  /* -------------------------------------------------------
     FORMAT WALLET
  ------------------------------------------------------- */

  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  /* =======================================================
     LOGIN
  ======================================================= */

  if (screen === "login") {
    return (
      <main className="login-page">
        <style jsx global>{styles}</style>

        <div className="login-background">
          <div className="background-orb orb-one" />
          <div className="background-orb orb-two" />
          <div className="background-orb orb-three" />
        </div>

        <header className="login-nav">
          <div
            className="brand"
            onClick={() => navigate("login")}
          >
            <div className="brand-mark">A</div>

            <div>
              <div className="brand-name">AUREX</div>
              <div className="brand-tagline">
                USAGE • BILLING • SETTLEMENT
              </div>
            </div>
          </div>

          <button
            className="wallet-button"
            onClick={connectWallet}
          >
            <span className="wallet-dot" />

            {walletConnected
              ? shortWallet
              : "Connect Wallet"}
          </button>
        </header>

        <section className="login-content">
          {/* LEFT 3D AREA */}

          <div className="hero-area">
            <div className="hero-copy">
              <div className="eyebrow">
                <span />
                USAGE-BASED PAYMENT INFRASTRUCTURE
              </div>

              <h1>
                Pay only for
                <br />
                <span>what you use.</span>
              </h1>

              <p>
                Aurex measures actual service usage,
                calculates the bill and settles the
                payment through the MST blockchain.
              </p>
            </div>

            {/* 3D PAYMENT FLOW */}

            <div className="aurex-3d-scene">
              <div className="scene-glow" />

              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />

              <div className="data-particle particle-one" />
              <div className="data-particle particle-two" />
              <div className="data-particle particle-three" />
              <div className="data-particle particle-four" />

              {/* SERVICE */}

              <div className="flow-object service-object">
                <div className="cube">
                  <div className="cube-face cube-front">
                    SERVICE
                  </div>

                  <div className="cube-face cube-back">
                    AUREX
                  </div>

                  <div className="cube-face cube-right">
                    USE
                  </div>

                  <div className="cube-face cube-left">
                    PAY
                  </div>

                  <div className="cube-face cube-top">
                    01
                  </div>

                  <div className="cube-face cube-bottom">
                    ₹
                  </div>
                </div>

                <span className="object-label">
                  SERVICE
                </span>
              </div>

              {/* USAGE */}

              <div className="flow-object usage-object">
                <div className="usage-core">
                  <span>USAGE</span>
                  <strong>2.5h</strong>
                </div>

                <span className="object-label">
                  MEASURE
                </span>
              </div>

              {/* BILL */}

              <div className="flow-object bill-object">
                <div className="bill-card">
                  <div className="bill-header">
                    <span>AUREX</span>
                    <span>INVOICE</span>
                  </div>

                  <div className="bill-line">
                    <span>Workspace</span>
                    <span>₹125</span>
                  </div>

                  <div className="bill-line">
                    <span>Usage</span>
                    <span>2.5 hrs</span>
                  </div>

                  <div className="bill-total">
                    <span>TOTAL</span>
                    <strong>₹125</strong>
                  </div>
                </div>

                <span className="object-label">
                  BILL
                </span>
              </div>

              {/* BLOCKCHAIN */}

              <div className="flow-object blockchain-object">
                <div className="blockchain-core">
                  <div className="chain-node node-a">
                    MST
                  </div>

                  <div className="chain-node node-b">
                    TX
                  </div>

                  <div className="chain-node node-c">
                    ✓
                  </div>
                </div>

                <span className="object-label">
                  MST BLOCKCHAIN
                </span>
              </div>

              {/* CENTRAL AUREX CORE */}

              <div className="aurex-core">
                <div className="core-ring ring-one" />
                <div className="core-ring ring-two" />

                <div className="core-inner">
                  <span className="core-symbol">
                    A
                  </span>

                  <span className="core-name">
                    AUREX
                  </span>
                </div>

                <div className="core-pulse" />
              </div>

              <div className="flow-label label-use">
                <span>01</span>
                USE
              </div>

              <div className="flow-label label-measure">
                <span>02</span>
                MEASURE
              </div>

              <div className="flow-label label-bill">
                <span>03</span>
                BILL
              </div>

              <div className="flow-label label-settle">
                <span>04</span>
                SETTLE
              </div>

              <div className="flow-label label-verify">
                <span>05</span>
                VERIFY
              </div>
            </div>
          </div>

          {/* LOGIN CARD */}

          <div className="login-card-wrapper">
            <div className="login-card">
              <div className="card-top">
                <div>
                  <span className="card-mini-label">
                    AUREX ACCESS
                  </span>

                  <h2>Welcome back.</h2>

                  <p>
                    Continue to your usage dashboard.
                  </p>
                </div>

                <div className="secure-icon">
                  ◈
                </div>
              </div>

              <form onSubmit={handleLogin}>
                <label>Email address</label>

                <div className="input-wrapper">
                  <span>✉</span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <label>Password</label>

                <div className="input-wrapper">
                  <span>●</span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                {error && (
                  <div className="error-box">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                >
                  Enter Aurex
                  <span>→</span>
                </button>
              </form>

              <div className="divider">
                <span />
                <small>OR</small>
                <span />
              </div>

              <button
                className="wallet-login-button"
                onClick={connectWallet}
              >
                <span>◉</span>

                {walletConnected
                  ? `Connected ${shortWallet}`
                  : "Continue with Web3 Wallet"}
              </button>

              <div className="security-note">
                <span>✓</span>

                <p>
                  Your usage and payment information
                  is handled through the Aurex
                  application flow.
                </p>
              </div>
            </div>

            <div className="login-footer">
              <span>POWERED BY</span>
              <strong>MST BLOCKCHAIN</strong>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     APPLICATION
  ======================================================= */

  return (
    <main className="app-shell">
      <style jsx global>{styles}</style>

      <aside
        className={`sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">AUREX</div>

            <div className="brand-tagline">
              PAYMENT INFRASTRUCTURE
            </div>
          </div>
        </div>

        <nav>
          <div className="nav-section-title">
            WORKSPACE
          </div>

          <button
            className={`side-link ${
              screen === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <span>⌂</span>
            Overview
          </button>

          <button
            className={`side-link ${
              screen === "services" ||
              screen === "usage"
                ? "active"
                : ""
            }`}
            onClick={() => navigate("services")}
          >
            <span>◈</span>
            Services
          </button>

          <button
            className={`side-link ${
              screen === "bill" ||
              screen === "payment"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigate(bill ? "bill" : "services")
            }
          >
            <span>▣</span>
            Billing
          </button>

          <div className="nav-section-title">
            ACCOUNT
          </div>

          <button
            className={`side-link ${
              screen === "activity" ? "active" : ""
            }`}
            onClick={() => navigate("activity")}
          >
            <span>◷</span>
            Activity
          </button>

          <button
            className={`side-link ${
              screen === "wallet" ? "active" : ""
            }`}
            onClick={() => navigate("wallet")}
          >
            <span>◉</span>
            Wallet
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="network-card">
            <div className="network-indicator" />

            <div>
              <strong>MST TESTNET</strong>
              <small>Network connected</small>
            </div>
          </div>

          <button
            className="profile-mini"
            onClick={() => navigate("dashboard")}
          >
            <div className="avatar">
              P
            </div>

            <div>
              <strong>{email || "Aurex User"}</strong>
              <small>Customer</small>
            </div>
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="app-header">
          <div className="mobile-brand">
            <button
              className="menu-button"
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
            >
              ☰
            </button>

            <strong>AUREX</strong>
          </div>

          <div className="header-status">
            <div className="status-pill">
              <span />
              MST TESTNET
            </div>

            <button
              className="header-wallet"
              onClick={
                walletConnected
                  ? disconnectWallet
                  : connectWallet
              }
            >
              <span>◉</span>

              {walletConnected
                ? shortWallet
                : "Connect Wallet"}
            </button>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="global-error">
              <span>!</span>
              {error}

              <button
                onClick={clearError}
              >
                ×
              </button>
            </div>
          )}

          {/* =============================================
              DASHBOARD
          ============================================= */}

          {screen === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    AUREX WORKSPACE
                  </div>

                  <h1>
                    Usage, billing and settlement.
                  </h1>

                  <p>
                    Track service consumption and
                    pay only for what you actually use.
                  </p>
                </div>

                <button
                  className="primary-button compact"
                  onClick={() =>
                    navigate("services")
                  }
                >
                  Start using a service →
                </button>
              </div>

              <div className="dashboard-grid">
                <div className="metric-card">
                  <span>ACTIVE USAGE</span>

                  <strong>
                    {usage?.status === "active"
                      ? "1"
                      : "0"}
                  </strong>

                  <small>
                    {usage?.status === "active"
                      ? "Service currently running"
                      : "No active services"}
                  </small>
                </div>

                <div className="metric-card">
                  <span>CURRENT BILL</span>

                  <strong>
                    ₹
                    {bill
                      ? bill.total.toFixed(2)
                      : "0.00"}
                  </strong>

                  <small>
                    {bill?.status ||
                      "No outstanding bill"}
                  </small>
                </div>

                <div className="metric-card">
                  <span>SETTLEMENT</span>

                  <strong>
                    {payment ? "PAID" : "—"}
                  </strong>

                  <small>
                    {payment
                      ? "MST transaction recorded"
                      : "Awaiting payment"}
                  </small>
                </div>

                <div className="metric-card">
                  <span>NETWORK</span>

                  <strong>MST</strong>

                  <small>
                    Testnet settlement layer
                  </small>
                </div>
              </div>

              <div className="dashboard-main-grid">
                <div className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <span>QUICK START</span>
                      <h2>Choose a service</h2>
                    </div>

                    <button
                      onClick={() =>
                        navigate("services")
                      }
                    >
                      View all →
                    </button>
                  </div>

                  <ServiceCard
                    icon="▣"
                    title="Workspace"
                    description="Usage-based workspace access"
                    rate="₹50 / hour"
                    featured
                    onClick={startUsage}
                  />
                </div>

                <div className="dashboard-panel flow-panel">
                  <div className="panel-heading">
                    <div>
                      <span>HOW AUREX WORKS</span>
                      <h2>Payment flow</h2>
                    </div>
                  </div>

                  <div className="mini-flow">
                    <FlowStep
                      number="01"
                      title="Use"
                      text="Start service"
                    />

                    <div className="flow-line" />

                    <FlowStep
                      number="02"
                      title="Measure"
                      text="Track usage"
                    />

                    <div className="flow-line" />

                    <FlowStep
                      number="03"
                      title="Bill"
                      text="Calculate cost"
                    />

                    <div className="flow-line" />

                    <FlowStep
                      number="04"
                      title="Settle"
                      text="MST payment"
                    />

                    <div className="flow-line" />

                    <FlowStep
                      number="05"
                      title="Verify"
                      text="Receipt"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              SERVICES
          ============================================= */}

          {screen === "services" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    SERVICE CATALOG
                  </div>

                  <h1>Select a service.</h1>

                  <p>
                    Start consuming a compatible
                    service and Aurex will measure
                    the actual usage.
                  </p>
                </div>
              </div>

              <div className="service-grid">
                <ServiceCard
                  icon="▣"
                  title="Workspace"
                  description="Pay according to the time you actively use the workspace."
                  rate="₹50 / hour"
                  featured
                  onClick={startUsage}
                />

                <ServiceCard
                  icon="◇"
                  title="AI Compute"
                  description="Example service card for future usage-based integrations."
                  rate="Coming soon"
                  disabled
                  onClick={() => {}}
                />

                <ServiceCard
                  icon="✦"
                  title="3D Rendering"
                  description="Example usage-based digital service integration."
                  rate="Coming soon"
                  disabled
                  onClick={() => {}}
                />
              </div>

              <div className="info-panel">
                <div className="info-icon">
                  ◎
                </div>

                <div>
                  <strong>
                    Start with Workspace
                  </strong>

                  <p>
                    The current demo flow uses
                    Workspace at ₹50 per hour.
                    Start the service, let Aurex
                    measure usage, stop it and
                    generate your bill.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              USAGE
          ============================================= */}

          {screen === "usage" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    LIVE USAGE
                  </div>

                  <h1>
                    Workspace is running.
                  </h1>

                  <p>
                    Aurex is measuring your actual
                    service consumption.
                  </p>
                </div>

                <div className="live-badge">
                  <span />
                  LIVE
                </div>
              </div>

              <div className="usage-layout">
                <div className="usage-main-card">
                  <div className="usage-card-top">
                    <div className="service-icon-large">
                      ▣
                    </div>

                    <div>
                      <span>ACTIVE SERVICE</span>
                      <h2>Workspace</h2>
                      <p>
                        ₹50 per hour
                      </p>
                    </div>
                  </div>

                  <div className="timer">
                    {formatTime(elapsedSeconds)}
                  </div>

                  <div className="timer-label">
                    ELAPSED USAGE TIME
                  </div>

                  <div className="usage-progress">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          (elapsedSeconds / 3600) *
                            100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="usage-stats">
                    <div>
                      <span>RATE</span>
                      <strong>
                        ₹50/hr
                      </strong>
                    </div>

                    <div>
                      <span>ESTIMATED COST</span>
                      <strong>
                        ₹
                        {estimatedCost.toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span>STATUS</span>
                      <strong className="active-text">
                        ACTIVE
                      </strong>
                    </div>
                  </div>

                  <button
                    className="stop-button"
                    onClick={stopUsage}
                    disabled={loading}
                  >
                    {loading
                      ? "Stopping..."
                      : "Stop Usage"}
                    <span>■</span>
                  </button>
                </div>

                <div className="side-info-card">
                  <div className="card-label">
                    USAGE ENGINE
                  </div>

                  <h3>
                    Measuring actual
                    consumption.
                  </h3>

                  <p>
                    Aurex records the start time
                    and calculates the final
                    quantity when you stop the
                    service.
                  </p>

                  <div className="measurement">
                    <span>STARTED</span>

                    <strong>
                      {usage?.start_time
                        ? new Date(
                            usage.start_time
                          ).toLocaleTimeString()
                        : "—"}
                    </strong>
                  </div>

                  <div className="measurement">
                    <span>USAGE ID</span>

                    <strong>
                      #{usage?.usage_id || "—"}
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              BILL
          ============================================= */}

          {screen === "bill" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    BILLING ENGINE
                  </div>

                  <h1>Your bill is ready.</h1>

                  <p>
                    Review the calculated usage
                    before settling through MST.
                  </p>
                </div>

                <div className="status-pill success">
                  ● UNPAID
                </div>
              </div>

              <div className="bill-layout">
                <div className="invoice-card">
                  <div className="invoice-top">
                    <div>
                      <div className="invoice-logo">
                        AUREX
                      </div>

                      <span>
                        USAGE INVOICE
                      </span>
                    </div>

                    <div className="invoice-number">
                      BILL #
                      {bill?.bill_id || "—"}
                    </div>
                  </div>

                  <div className="invoice-service">
                    <div>
                      <span>SERVICE</span>
                      <strong>
                        Workspace
                      </strong>
                    </div>

                    <div>
                      <span>QUANTITY</span>
                      <strong>
                        {stoppedUsage
                          ? `${stoppedUsage.quantity} hours`
                          : "—"}
                      </strong>
                    </div>

                    <div>
                      <span>RATE</span>
                      <strong>
                        ₹50 / hour
                      </strong>
                    </div>
                  </div>

                  <div className="invoice-lines">
                    <div>
                      <span>
                        Usage charge
                      </span>

                      <strong>
                        ₹
                        {bill?.subtotal.toFixed(
                          2
                        ) || "0.00"}
                      </strong>
                    </div>

                    <div>
                      <span>Tax</span>

                      <strong>
                        ₹
                        {bill?.tax.toFixed(2) ||
                          "0.00"}
                      </strong>
                    </div>
                  </div>

                  <div className="invoice-total">
                    <span>TOTAL DUE</span>

                    <strong>
                      ₹
                      {bill?.total.toFixed(2) ||
                        "0.00"}
                    </strong>
                  </div>
                </div>

                <div className="payment-next-card">
                  <div className="payment-icon">
                    ◈
                  </div>

                  <span className="card-label">
                    NEXT STEP
                  </span>

                  <h2>
                    Settle through MST.
                  </h2>

                  <p>
                    Once your bill is confirmed,
                    continue to the MST payment
                    screen and submit the resulting
                    transaction hash.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("payment")
                    }
                  >
                    Continue to payment
                    <span>→</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              PAYMENT
          ============================================= */}

          {screen === "payment" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    MST SETTLEMENT
                  </div>

                  <h1>
                    Complete your payment.
                  </h1>

                  <p>
                    Settle bill #
                    {bill?.bill_id || "—"} through
                    the MST blockchain.
                  </p>
                </div>
              </div>

              <div className="payment-layout">
                <div className="payment-card">
                  <div className="payment-card-header">
                    <div className="mst-symbol">
                      M
                    </div>

                    <div>
                      <span>
                        MST BLOCKCHAIN
                      </span>

                      <strong>
                        Testnet Payment
                      </strong>
                    </div>

                    <div className="network-live">
                      <span />
                      LIVE
                    </div>
                  </div>

                  <div className="amount-display">
                    <span>AMOUNT TO PAY</span>

                    <strong>
                      ₹
                      {bill?.total.toFixed(2) ||
                        "0.00"}
                    </strong>
                  </div>

                  {!walletConnected && (
                    <div className="wallet-warning">
                      <span>!</span>

                      <div>
                        <strong>
                          Wallet not connected
                        </strong>

                        <p>
                          Connect your compatible
                          Web3 wallet before making
                          the MST payment.
                        </p>
                      </div>

                      <button
                        onClick={connectWallet}
                      >
                        Connect
                      </button>
                    </div>
                  )}

                  <div className="tx-section">
                    <label>
                      MST transaction hash
                    </label>

                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) =>
                        setTxHash(e.target.value)
                      }
                      placeholder="0x..."
                    />

                    <small>
                      After completing the MST
                      transaction, paste the
                      resulting transaction hash
                      here.
                    </small>
                  </div>

                  <button
                    className="primary-button"
                    onClick={recordPayment}
                    disabled={loading}
                  >
                    {loading
                      ? "Recording payment..."
                      : "Confirm payment"}
                    <span>→</span>
                  </button>
                </div>

                <div className="settlement-visual">
                  <div className="settlement-orbit orbit-a" />
                  <div className="settlement-orbit orbit-b" />

                  <div className="settlement-core">
                    <span>MST</span>
                    <strong>₹</strong>
                    <small>SETTLEMENT</small>
                  </div>

                  <div className="settlement-node node-top">
                    BILL
                  </div>

                  <div className="settlement-node node-right">
                    TX
                  </div>

                  <div className="settlement-node node-bottom">
                    ✓
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              RECEIPT
          ============================================= */}

          {screen === "receipt" && (
            <>
              <div className="success-screen">
                <div className="success-orb">
                  <div>✓</div>
                </div>

                <div className="eyebrow">
                  SETTLEMENT COMPLETE
                </div>

                <h1>
                  Payment verified.
                </h1>

                <p>
                  Your Aurex usage bill has been
                  recorded and the MST transaction
                  hash has been linked to the receipt.
                </p>

                <div className="receipt-card">
                  <div className="receipt-header">
                    <div>
                      <span>PAYMENT RECEIPT</span>
                      <strong>AUREX</strong>
                    </div>

                    <div className="receipt-check">
                      ✓
                    </div>
                  </div>

                  <div className="receipt-row">
                    <span>Receipt ID</span>

                    <strong>
                      #
                      {payment?.receipt_id ||
                        "—"}
                    </strong>
                  </div>

                  <div className="receipt-row">
                    <span>Bill ID</span>

                    <strong>
                      #
                      {bill?.bill_id || "—"}
                    </strong>
                  </div>

                  <div className="receipt-row">
                    <span>Amount</span>

                    <strong>
                      ₹
                      {bill?.total.toFixed(2) ||
                        "0.00"}
                    </strong>
                  </div>

                  <div className="receipt-row">
                    <span>Status</span>

                    <strong className="paid-text">
                      SUCCESS
                    </strong>
                  </div>

                  <div className="receipt-row hash-row">
                    <span>Transaction hash</span>

                    <code>
                      {payment?.tx_hash ||
                        txHash ||
                        "—"}
                    </code>
                  </div>
                </div>

                <div className="receipt-actions">
                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("dashboard")
                    }
                  >
                    Back to dashboard
                    <span>→</span>
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      navigate("activity")
                    }
                  >
                    View activity
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =============================================
              ACTIVITY
          ============================================= */}

          {screen === "activity" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    ACTIVITY
                  </div>

                  <h1>
                    Usage & payment history.
                  </h1>

                  <p>
                    Review the current Aurex
                    transaction flow.
                  </p>
                </div>
              </div>

              <div className="activity-card">
                {payment ? (
                  <div className="activity-item">
                    <div className="activity-icon success-icon">
                      ✓
                    </div>

                    <div className="activity-info">
                      <strong>
                        Workspace payment
                      </strong>

                      <span>
                        MST settlement • Bill #
                        {bill?.bill_id}
                      </span>
                    </div>

                    <div className="activity-amount">
                      <strong>
                        -₹
                        {bill?.total.toFixed(2)}
                      </strong>

                      <span>Completed</span>
                    </div>
                  </div>
                ) : null}

                {bill ? (
                  <div className="activity-item">
                    <div className="activity-icon bill-icon">
                      ▣
                    </div>

                    <div className="activity-info">
                      <strong>
                        Workspace bill
                      </strong>

                      <span>
                        Usage #
                        {stoppedUsage?.usage_id}
                      </span>
                    </div>

                    <div className="activity-amount">
                      <strong>
                        ₹
                        {bill.total.toFixed(2)}
                      </strong>

                      <span>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ) : null}

                {usage ? (
                  <div className="activity-item">
                    <div className="activity-icon usage-icon">
                      ◷
                    </div>

                    <div className="activity-info">
                      <strong>
                        Workspace usage
                      </strong>

                      <span>
                        Usage #
                        {usage.usage_id}
                      </span>
                    </div>

                    <div className="activity-amount">
                      <strong>
                        {stoppedUsage
                          ? `${stoppedUsage.quantity}h`
                          : "Active"}
                      </strong>

                      <span>
                        {stoppedUsage
                          ? "Stopped"
                          : "Running"}
                      </span>
                    </div>
                  </div>
                ) : null}

                {!usage &&
                  !bill &&
                  !payment && (
                    <div className="empty-state">
                      <div>◷</div>

                      <h3>
                        No activity yet.
                      </h3>

                      <p>
                        Start using a service to
                        create your first Aurex
                        activity.
                      </p>

                      <button
                        className="primary-button"
                        onClick={() =>
                          navigate("services")
                        }
                      >
                        Browse services →
                      </button>
                    </div>
                  )}
              </div>
            </>
          )}

          {/* =============================================
              WALLET
          ============================================= */}

          {screen === "wallet" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    WALLET
                  </div>

                  <h1>
                    Your Web3 wallet.
                  </h1>

                  <p>
                    Connect your wallet for MST
                    blockchain settlement.
                  </p>
                </div>
              </div>

              <div className="wallet-page-card">
                <div className="wallet-visual">
                  <div className="wallet-orbit" />

                  <div className="wallet-core">
                    ◉
                  </div>
                </div>

                <div className="wallet-details">
                  <span className="card-label">
                    CONNECTION STATUS
                  </span>

                  <h2>
                    {walletConnected
                      ? "Wallet connected"
                      : "Wallet not connected"}
                  </h2>

                  <p>
                    {walletConnected
                      ? "Your wallet is ready to be used for MST settlement."
                      : "Connect a compatible Web3 wallet to continue with blockchain payments."}
                  </p>

                  {walletConnected && (
                    <div className="address-box">
                      <span>
                        WALLET ADDRESS
                      </span>

                      <code>
                        {walletAddress}
                      </code>
                    </div>
                  )}

                  <button
                    className={
                      walletConnected
                        ? "secondary-button"
                        : "primary-button"
                    }
                    onClick={
                      walletConnected
                        ? disconnectWallet
                        : connectWallet
                    }
                  >
                    {walletConnected
                      ? "Disconnect wallet"
                      : "Connect wallet"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  icon,
  title,
  description,
  rate,
  featured = false,
  disabled = false,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  rate: string;
  featured?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`service-card ${
        featured ? "featured" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      <div className="service-card-icon">
        {icon}
      </div>

      <div className="service-card-content">
        <div className="service-card-title">
          <h3>{title}</h3>

          {featured && (
            <span>LIVE DEMO</span>
          )}
        </div>

        <p>{description}</p>

        <div className="service-card-bottom">
          <strong>{rate}</strong>

          {!disabled ? (
            <button onClick={onClick}>
              Start →
            </button>
          ) : (
            <span className="coming-soon">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FLOW STEP
========================================================= */

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flow-step">
      <div className="flow-number">
        {number}
      </div>

      <strong>{title}</strong>

      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   GLOBAL STYLES
========================================================= */

const styles = `
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  background: #07070c;
  color: #f7f7fb;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* =========================================================
   LOGIN PAGE
========================================================= */

.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(91, 76, 255, 0.13),
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 75%,
      rgba(42, 120, 255, 0.1),
      transparent 30%
    ),
    #07070c;
}

.login-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.25;
}

.orb-one {
  width: 350px;
  height: 350px;
  left: -100px;
  top: 20%;
  background: #6855ff;
}

.orb-two {
  width: 300px;
  height: 300px;
  right: 10%;
  top: -100px;
  background: #2e7dff;
}

.orb-three {
  width: 350px;
  height: 350px;
  right: -150px;
  bottom: -100px;
  background: #713dff;
}

.login-nav {
  height: 86px;

  padding: 0 6vw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: relative;
  z-index: 20;

  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
}

.brand-mark {
  width: 40px;
  height: 40px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 900;
  font-size: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(150, 135, 255, 0.9),
      rgba(65, 104, 255, 0.7)
    );

  box-shadow:
    0 12px 35px rgba(91, 76, 255, 0.35),
    inset 0 1px 0 rgba(255,255,255,0.4);
}

.brand-name {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 5px;
}

.brand-tagline {
  margin-top: 3px;
  font-size: 7px;
  letter-spacing: 1.6px;
  opacity: 0.4;
}

.wallet-button {
  border: 1px solid rgba(255,255,255,0.1);

  background: rgba(255,255,255,0.04);

  color: white;

  padding: 11px 17px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  gap: 9px;

  transition: 0.25s;
}

.wallet-button:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.wallet-dot,
.status-pill span,
.network-indicator,
.live-badge span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #64e6a1;
  box-shadow: 0 0 12px #64e6a1;
}

.login-content {
  min-height: calc(100vh - 86px);

  padding: 45px 6vw 60px;

  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.7fr);

  gap: 30px;

  align-items: center;

  position: relative;
  z-index: 5;
}

.hero-area {
  min-width: 0;
}

.hero-copy {
  max-width: 620px;
  position: relative;
  z-index: 4;
}

.eyebrow {
  font-size: 9px;
  letter-spacing: 3px;
  font-weight: 800;
  color: #9d92ff;
}

.eyebrow span {
  display: inline-block;
  width: 22px;
  height: 1px;
  background: #8c7dff;
  vertical-align: middle;
  margin-right: 10px;
}

.hero-copy h1 {
  margin: 18px 0 15px;

  font-size: clamp(48px, 5.3vw, 78px);

  line-height: 0.95;

  letter-spacing: -4px;

  font-weight: 850;
}

.hero-copy h1 span {
  background:
    linear-gradient(
      120deg,
      #fff,
      #a99cff 45%,
      #68aaff
    );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-copy p {
  max-width: 530px;

  font-size: 15px;
  line-height: 1.7;

  color: rgba(255,255,255,0.5);
}

/* =========================================================
   3D AUREX SCENE
========================================================= */

.aurex-3d-scene {
  position: relative;

  width: min(620px, 100%);
  height: 500px;

  margin: -5px auto 0;

  perspective: 1200px;

  transform-style: preserve-3d;

  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-glow {
  position: absolute;

  width: 360px;
  height: 360px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(124,92,255,0.35),
      rgba(70,120,255,0.14) 35%,
      transparent 70%
    );

  filter: blur(20px);

  animation: sceneGlow 4s ease-in-out infinite;
}

@keyframes sceneGlow {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.6;
  }

  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

.orbit {
  position: absolute;

  border: 1px solid rgba(255,255,255,0.1);

  border-radius: 50%;

  transform-style: preserve-3d;
}

.orbit-one {
  width: 430px;
  height: 430px;

  transform: rotateX(65deg) rotateZ(15deg);

  animation: orbitOne 12s linear infinite;
}

.orbit-two {
  width: 500px;
  height: 280px;

  transform: rotateY(65deg) rotateZ(-20deg);

  animation: orbitTwo 16s linear infinite reverse;
}

.orbit-three {
  width: 300px;
  height: 500px;

  transform: rotateX(70deg) rotateY(20deg);

  animation: orbitThree 18s linear infinite;
}

@keyframes orbitOne {
  from {
    transform: rotateX(65deg) rotateZ(0deg);
  }

  to {
    transform: rotateX(65deg) rotateZ(360deg);
  }
}

@keyframes orbitTwo {
  from {
    transform: rotateY(65deg) rotateZ(0deg);
  }

  to {
    transform: rotateY(65deg) rotateZ(360deg);
  }
}

@keyframes orbitThree {
  from {
    transform:
      rotateX(70deg)
      rotateY(20deg)
      rotateZ(0deg);
  }

  to {
    transform:
      rotateX(70deg)
      rotateY(20deg)
      rotateZ(360deg);
  }
}

/* CENTRAL CORE */

.aurex-core {
  position: absolute;

  width: 155px;
  height: 155px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform-style: preserve-3d;

  z-index: 10;

  animation: coreFloat 4s ease-in-out infinite;
}

@keyframes coreFloat {
  0%,
  100% {
    transform:
      translateY(0)
      translateZ(30px);
  }

  50% {
    transform:
      translateY(-14px)
      translateZ(55px);
  }
}

.core-inner {
  position: relative;

  width: 105px;
  height: 105px;

  border-radius: 30px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.16),
      rgba(255,255,255,0.04)
    );

  border: 1px solid rgba(255,255,255,0.24);

  box-shadow:
    0 25px 70px rgba(0,0,0,0.35),
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 0 50px rgba(110,100,255,0.35);

  backdrop-filter: blur(20px);

  transform: translateZ(50px);
}

.core-symbol {
  font-size: 42px;
  font-weight: 900;

  line-height: 1;

  background:
    linear-gradient(
      135deg,
      #fff,
      #9b8cff,
      #62b0ff
    );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.core-name {
  margin-top: 6px;

  font-size: 9px;
  letter-spacing: 4px;

  font-weight: 700;

  opacity: 0.65;
}

.core-ring {
  position: absolute;

  border-radius: 50%;

  border: 1px solid rgba(140,120,255,0.35);
}

.ring-one {
  width: 145px;
  height: 145px;

  animation: coreRing 6s linear infinite;
}

.ring-two {
  width: 180px;
  height: 90px;

  transform: rotateX(65deg);

  animation:
    coreRingTwo
    8s
    linear
    infinite
    reverse;
}

@keyframes coreRing {
  from {
    transform: rotateZ(0deg);
  }

  to {
    transform: rotateZ(360deg);
  }
}

@keyframes coreRingTwo {
  from {
    transform:
      rotateX(65deg)
      rotateZ(0deg);
  }

  to {
    transform:
      rotateX(65deg)
      rotateZ(360deg);
  }
}

.core-pulse {
  position: absolute;

  width: 155px;
  height: 155px;

  border-radius: 50%;

  border: 1px solid rgba(120,110,255,0.5);

  animation:
    pulseCore
    2.5s
    ease-out
    infinite;
}

@keyframes pulseCore {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* FLOW OBJECTS */

.flow-object {
  position: absolute;
  transform-style: preserve-3d;
  z-index: 5;
}

.object-label {
  position: absolute;

  left: 50%;

  transform: translateX(-50%);

  white-space: nowrap;

  bottom: -30px;

  font-size: 8px;

  letter-spacing: 2px;

  font-weight: 700;

  color: rgba(255,255,255,0.45);
}

/* SERVICE CUBE */

.service-object {
  top: 35px;
  left: 70px;

  animation:
    serviceFloat
    5s
    ease-in-out
    infinite;
}

@keyframes serviceFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotateY(-12deg);
  }

  50% {
    transform:
      translateY(-18px)
      rotateY(8deg);
  }
}

.cube {
  width: 82px;
  height: 82px;

  position: relative;

  transform-style: preserve-3d;

  transform:
    rotateX(-15deg)
    rotateY(25deg);
}

.cube-face {
  position: absolute;

  width: 82px;
  height: 82px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      145deg,
      rgba(100,100,255,0.3),
      rgba(255,255,255,0.05)
    );

  border: 1px solid rgba(255,255,255,0.2);

  box-shadow:
    inset 0 0 20px rgba(255,255,255,0.04),
    0 0 30px rgba(100,100,255,0.12);

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1px;

  backdrop-filter: blur(10px);
}

.cube-front {
  transform: translateZ(41px);
}

.cube-back {
  transform:
    rotateY(180deg)
    translateZ(41px);
}

.cube-right {
  transform:
    rotateY(90deg)
    translateZ(41px);
}

.cube-left {
  transform:
    rotateY(-90deg)
    translateZ(41px);
}

.cube-top {
  transform:
    rotateX(90deg)
    translateZ(41px);
}

.cube-bottom {
  transform:
    rotateX(-90deg)
    translateZ(41px);
}

/* USAGE */

.usage-object {
  top: 75px;
  right: 60px;

  animation:
    usageFloat
    4.5s
    ease-in-out
    infinite;
}

@keyframes usageFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotateY(0deg);
  }

  50% {
    transform:
      translateY(-15px)
      rotateY(18deg);
  }
}

.usage-core {
  width: 100px;
  height: 100px;

  border-radius: 28px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      145deg,
      rgba(60,180,255,0.18),
      rgba(255,255,255,0.04)
    );

  border: 1px solid rgba(120,200,255,0.25);

  box-shadow:
    0 25px 50px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.2);

  transform: translateZ(30px);
}

.usage-core span {
  font-size: 8px;
  letter-spacing: 3px;
  opacity: 0.5;
}

.usage-core strong {
  margin-top: 8px;

  font-size: 24px;

  font-weight: 800;
}

/* BILL */

.bill-object {
  bottom: 35px;
  left: 60px;

  animation:
    billFloat
    5.5s
    ease-in-out
    infinite;
}

@keyframes billFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotateX(0deg)
      rotateY(-8deg);
  }

  50% {
    transform:
      translateY(-12px)
      rotateX(5deg)
      rotateY(8deg);
  }
}

.bill-card {
  width: 155px;

  padding: 18px;

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.14),
      rgba(255,255,255,0.04)
    );

  border: 1px solid rgba(255,255,255,0.18);

  box-shadow:
    0 30px 60px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);

  backdrop-filter: blur(18px);

  transform:
    perspective(700px)
    rotateX(8deg)
    rotateY(-8deg)
    translateZ(30px);
}

.bill-header {
  display: flex;
  justify-content: space-between;

  font-size: 8px;
  letter-spacing: 1px;

  opacity: 0.55;

  padding-bottom: 12px;

  border-bottom:
    1px solid
    rgba(255,255,255,0.1);
}

.bill-line {
  display: flex;
  justify-content: space-between;

  margin-top: 13px;

  font-size: 9px;

  opacity: 0.7;
}

.bill-total {
  display: flex;
  justify-content: space-between;

  margin-top: 15px;
  padding-top: 12px;

  border-top:
    1px solid
    rgba(255,255,255,0.1);

  font-size: 9px;
}

.bill-total strong {
  font-size: 16px;
}

/* BLOCKCHAIN */

.blockchain-object {
  bottom: 50px;
  right: 55px;

  animation:
    blockchainFloat
    5s
    ease-in-out
    infinite;
}

@keyframes blockchainFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotateY(0deg);
  }

  50% {
    transform:
      translateY(-15px)
      rotateY(-15deg);
  }
}

.blockchain-core {
  width: 125px;
  height: 90px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  transform-style: preserve-3d;
}

.chain-node {
  position: absolute;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      rgba(120,100,255,0.25),
      rgba(255,255,255,0.04)
    );

  border: 1px solid rgba(255,255,255,0.18);

  box-shadow:
    0 15px 35px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.2);

  font-size: 9px;

  font-weight: 800;

  animation:
    nodeFloat
    3s
    ease-in-out
    infinite;
}

.node-a {
  left: 0;
  top: 20px;
}

.node-b {
  left: 38px;
  top: 0;

  animation-delay: 0.3s;
}

.node-c {
  right: 0;
  top: 20px;

  animation-delay: 0.6s;
}

@keyframes nodeFloat {
  0%,
  100% {
    transform: translateZ(20px);
  }

  50% {
    transform: translateZ(45px);
  }
}

/* FLOW LABELS */

.flow-label {
  position: absolute;

  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.35);

  display: flex;

  gap: 6px;

  align-items: center;
}

.flow-label span {
  color: #9587ff;
  font-weight: 800;
}

.label-use {
  top: 165px;
  left: 110px;
}

.label-measure {
  top: 175px;
  right: 90px;
}

.label-bill {
  bottom: 160px;
  left: 190px;
}

.label-settle {
  bottom: 165px;
  right: 145px;
}

.label-verify {
  top: 265px;
  right: 20px;
}

/* PARTICLES */

.data-particle {
  position: absolute;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #978bff;

  box-shadow:
    0 0 12px #8174ff;

  animation:
    particleMove
    4s
    ease-in-out
    infinite;
}

.particle-one {
  top: 130px;
  left: 220px;
}

.particle-two {
  top: 230px;
  right: 145px;

  animation-delay: 1s;
}

.particle-three {
  bottom: 125px;
  left: 275px;

  animation-delay: 2s;
}

.particle-four {
  bottom: 205px;
  right: 215px;

  animation-delay: 3s;
}

@keyframes particleMove {
  0%,
  100% {
    transform:
      translate3d(0,0,0)
      scale(0.7);

    opacity: 0.3;
  }

  50% {
    transform:
      translate3d(15px,-25px,60px)
      scale(1.3);

    opacity: 1;
  }
}

/* =========================================================
   LOGIN CARD
========================================================= */

.login-card-wrapper {
  width: 100%;
  max-width: 440px;

  justify-self: end;
}

.login-card {
  padding: 34px;

  border-radius: 26px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.095),
      rgba(255,255,255,0.035)
    );

  border: 1px solid rgba(255,255,255,0.12);

  box-shadow:
    0 35px 90px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.15);

  backdrop-filter: blur(25px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 30px;
}

.card-mini-label {
  font-size: 8px;
  letter-spacing: 2px;
  color: #9488ff;
}

.card-top h2 {
  margin: 8px 0 5px;

  font-size: 30px;

  letter-spacing: -1px;
}

.card-top p {
  margin: 0;

  font-size: 12px;

  color: rgba(255,255,255,0.42);
}

.secure-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: rgba(140,120,255,0.1);

  color: #a99cff;
}

.login-card label {
  display: block;

  margin: 0 0 8px;

  font-size: 10px;

  color: rgba(255,255,255,0.6);
}

.input-wrapper {
  height: 50px;

  margin-bottom: 18px;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 0 15px;

  border-radius: 13px;

  background: rgba(0,0,0,0.18);

  border:
    1px solid
    rgba(255,255,255,0.09);

  transition: 0.25s;
}

.input-wrapper:focus-within {
  border-color: rgba(140,120,255,0.6);

  box-shadow:
    0 0 0 3px
    rgba(120,100,255,0.08);
}

.input-wrapper span {
  color: #887aff;
  opacity: 0.7;
}

.input-wrapper input {
  width: 100%;

  border: none;
  outline: none;

  background: transparent;

  color: white;

  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: rgba(255,255,255,0.25);
}

.primary-button {
  width: 100%;

  border: none;

  min-height: 52px;

  padding: 0 18px;

  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  color: white;

  font-weight: 750;

  background:
    linear-gradient(
      110deg,
      #7666ff,
      #4c85ff
    );

  box-shadow:
    0 15px 35px
    rgba(89,77,255,0.25);

  transition: 0.25s;
}

.primary-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 20px 40px
    rgba(89,77,255,0.35);
}

.primary-button span {
  font-size: 18px;
}

.primary-button.compact {
  width: auto;
  padding: 0 22px;
}

.wallet-login-button {
  width: 100%;

  min-height: 50px;

  border-radius: 13px;

  background: rgba(255,255,255,0.04);

  border:
    1px solid
    rgba(255,255,255,0.1);

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;
}

.divider {
  display: flex;
  align-items: center;

  gap: 12px;

  margin: 20px 0;
}

.divider span {
  flex: 1;

  height: 1px;

  background:
    rgba(255,255,255,0.08);
}

.divider small {
  font-size: 8px;
  color: rgba(255,255,255,0.3);
}

.security-note {
  margin-top: 22px;

  padding-top: 18px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

  display: flex;

  gap: 10px;
}

.security-note span {
  color: #64e6a1;
}

.security-note p {
  margin: 0;

  font-size: 9px;

  line-height: 1.5;

  color: rgba(255,255,255,0.3);
}

.error-box,
.global-error {
  color: #ff9696;

  background:
    rgba(255,80,80,0.08);

  border:
    1px solid
    rgba(255,80,80,0.2);

  border-radius: 10px;

  padding: 11px;

  font-size: 11px;

  margin-bottom: 15px;
}

.login-footer {
  display: flex;
  justify-content: center;

  gap: 8px;

  margin-top: 18px;

  font-size: 8px;

  letter-spacing: 1.5px;

  color: rgba(255,255,255,0.3);
}

/* =========================================================
   APPLICATION SHELL
========================================================= */

.app-shell {
  min-height: 100vh;

  display: flex;

  background:
    radial-gradient(
      circle at 70% 10%,
      rgba(80,65,200,0.08),
      transparent 25%
    ),
    #08080d;
}

.sidebar {
  width: 250px;

  min-height: 100vh;

  position: fixed;

  left: 0;
  top: 0;
  bottom: 0;

  padding: 25px 16px;

  background:
    rgba(10,10,16,0.9);

  border-right:
    1px solid
    rgba(255,255,255,0.07);

  display: flex;
  flex-direction: column;

  z-index: 50;
}

.sidebar-brand {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: 0 8px;

  margin-bottom: 40px;
}

.sidebar nav {
  flex: 1;
}

.nav-section-title {
  padding: 0 12px;

  margin: 20px 0 9px;

  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.25);
}

.side-link {
  width: 100%;

  height: 45px;

  border: none;

  border-radius: 11px;

  background: transparent;

  color: rgba(255,255,255,0.45);

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 0 13px;

  margin-bottom: 4px;

  text-align: left;

  font-size: 12px;

  transition: 0.2s;
}

.side-link span {
  width: 18px;
  text-align: center;
}

.side-link:hover,
.side-link.active {
  color: white;

  background:
    linear-gradient(
      90deg,
      rgba(120,100,255,0.15),
      rgba(120,100,255,0.04)
    );
}

.side-link.active {
  box-shadow:
    inset 2px 0 #8173ff;
}

.sidebar-bottom {
  border-top:
    1px solid
    rgba(255,255,255,0.06);

  padding-top: 15px;
}

.network-card {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  border-radius: 12px;

  background:
    rgba(255,255,255,0.035);

  margin-bottom: 10px;
}

.network-indicator {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #64e6a1;

  box-shadow:
    0 0 10px #64e6a1;
}

.network-card strong,
.network-card small {
  display: block;
}

.network-card strong {
  font-size: 8px;
  letter-spacing: 1px;
}

.network-card small {
  margin-top: 4px;

  font-size: 8px;

  color: rgba(255,255,255,0.3);
}

.profile-mini {
  width: 100%;

  border: none;

  background: transparent;

  color: white;

  display: flex;

  align-items: center;

  gap: 10px;

  text-align: left;

  padding: 8px;
}

.avatar {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #806eff,
      #3f7cff
    );

  font-weight: 800;
}

.profile-mini strong,
.profile-mini small {
  display: block;

  max-width: 130px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.profile-mini strong {
  font-size: 10px;
}

.profile-mini small {
  margin-top: 3px;

  font-size: 8px;

  color: rgba(255,255,255,0.3);
}

.main-area {
  width: calc(100% - 250px);

  margin-left: 250px;

  min-height: 100vh;
}

.app-header {
  height: 72px;

  padding: 0 35px;

  display: flex;

  align-items: center;

  justify-content: flex-end;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);
}

.header-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-pill {
  height: 34px;

  padding: 0 12px;

  border-radius: 9px;

  display: flex;
  align-items: center;
  gap: 7px;

  font-size: 8px;
  letter-spacing: 1px;

  color: rgba(255,255,255,0.5);

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.06);
}

.status-pill.success {
  color: #64e6a1;
}

.header-wallet {
  height: 34px;

  padding: 0 13px;

  border-radius: 9px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  background:
    rgba(255,255,255,0.05);

  color: white;

  font-size: 9px;
}

.mobile-brand,
.menu-button {
  display: none;
}

.page-content {
  padding: 40px;
  max-width: 1500px;
}

.global-error {
  display: flex;

  align-items: center;

  gap: 10px;
}

.global-error button {
  margin-left: auto;

  border: none;

  background: transparent;

  color: inherit;
}

/* =========================================================
   PAGE HEADINGS
========================================================= */

.page-heading {
  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  gap: 20px;

  margin-bottom: 30px;
}

.page-heading h1 {
  margin: 8px 0;

  font-size: 38px;

  letter-spacing: -1.5px;
}

.page-heading p {
  margin: 0;

  color: rgba(255,255,255,0.4);

  font-size: 12px;
}

/* =========================================================
   DASHBOARD
========================================================= */

.dashboard-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 13px;

  margin-bottom: 18px;
}

.metric-card {
  padding: 22px;

  border-radius: 17px;

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.metric-card span,
.metric-card small {
  display: block;
}

.metric-card span {
  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.35);
}

.metric-card strong {
  display: block;

  margin: 13px 0 5px;

  font-size: 28px;
}

.metric-card small {
  font-size: 9px;

  color: rgba(255,255,255,0.3);
}

.dashboard-main-grid {
  display: grid;

  grid-template-columns:
    1.25fr
    0.75fr;

  gap: 18px;
}

.dashboard-panel {
  padding: 25px;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.03);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.panel-heading {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 22px;
}

.panel-heading span {
  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.panel-heading h2 {
  margin: 7px 0 0;

  font-size: 20px;
}

.panel-heading button {
  border: none;

  background: transparent;

  color: #9b8cff;

  font-size: 10px;
}

/* =========================================================
   SERVICE CARDS
========================================================= */

.service-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 16px;
}

.service-card {
  min-height: 250px;

  padding: 23px;

  border-radius: 20px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.06),
      rgba(255,255,255,0.025)
    );

  border:
    1px solid
    rgba(255,255,255,0.08);

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  transition:
    transform 0.25s,
    border-color 0.25s;
}

.service-card:hover {
  transform: translateY(-5px);

  border-color:
    rgba(135,120,255,0.35);
}

.service-card.featured {
  background:
    radial-gradient(
      circle at 80% 20%,
      rgba(111,91,255,0.18),
      transparent 35%
    ),
    rgba(255,255,255,0.045);
}

.service-card.disabled {
  opacity: 0.55;
}

.service-card-icon {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background:
    rgba(120,100,255,0.12);

  color: #9d90ff;

  font-size: 20px;
}

.service-card-content {
  margin-top: 25px;
}

.service-card-title {
  display: flex;

  align-items: center;

  gap: 9px;
}

.service-card-title h3 {
  margin: 0;

  font-size: 18px;
}

.service-card-title span {
  padding: 4px 7px;

  border-radius: 5px;

  font-size: 6px;

  letter-spacing: 1px;

  color: #8df0b9;

  background:
    rgba(70,210,140,0.08);
}

.service-card p {
  min-height: 42px;

  font-size: 10px;

  line-height: 1.6;

  color: rgba(255,255,255,0.38);
}

.service-card-bottom {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 20px;
}

.service-card-bottom strong {
  font-size: 15px;
}

.service-card-bottom button {
  border: none;

  background:
    rgba(120,100,255,0.1);

  color: #a89dff;

  border-radius: 9px;

  padding: 9px 12px;

  font-size: 9px;
}

.coming-soon {
  font-size: 8px;

  color: rgba(255,255,255,0.25);
}

.info-panel {
  margin-top: 18px;

  padding: 20px;

  display: flex;

  gap: 15px;

  border-radius: 17px;

  background:
    rgba(120,100,255,0.055);

  border:
    1px solid
    rgba(120,100,255,0.1);
}

.info-icon {
  width: 38px;
  height: 38px;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    rgba(120,100,255,0.1);

  color: #9e91ff;
}

.info-panel strong {
  font-size: 12px;
}

.info-panel p {
  margin: 5px 0 0;

  max-width: 700px;

  font-size: 10px;

  line-height: 1.6;

  color: rgba(255,255,255,0.35);
}

/* =========================================================
   FLOW
========================================================= */

.mini-flow {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 20px 0;
}

.flow-step {
  min-width: 55px;

  text-align: center;
}

.flow-number {
  width: 34px;
  height: 34px;

  margin: 0 auto 8px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(120,100,255,0.1);

  color: #9c90ff;

  font-size: 8px;

  font-weight: 800;
}

.flow-step strong,
.flow-step span {
  display: block;
}

.flow-step strong {
  font-size: 10px;
}

.flow-step span {
  margin-top: 4px;

  font-size: 7px;

  color: rgba(255,255,255,0.3);
}

.flow-line {
  flex: 1;

  height: 1px;

  margin: 0 5px;

  background:
    linear-gradient(
      90deg,
      rgba(120,100,255,0.3),
      rgba(255,255,255,0.06)
    );
}

/* =========================================================
   USAGE
========================================================= */

.live-badge {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 9px 13px;

  border-radius: 9px;

  color: #64e6a1;

  background:
    rgba(80,220,145,0.07);

  border:
    1px solid
    rgba(80,220,145,0.15);

  font-size: 8px;

  letter-spacing: 1px;
}

.usage-layout {
  display: grid;

  grid-template-columns:
    1.5fr
    0.5fr;

  gap: 18px;
}

.usage-main-card,
.side-info-card {
  border-radius: 22px;

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.usage-main-card {
  padding: 35px;

  text-align: center;
}

.usage-card-top {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;

  text-align: left;
}

.service-icon-large {
  width: 55px;
  height: 55px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 16px;

  background:
    rgba(120,100,255,0.12);

  color: #a295ff;

  font-size: 22px;
}

.usage-card-top span {
  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.usage-card-top h2 {
  margin: 4px 0;

  font-size: 22px;
}

.usage-card-top p {
  margin: 0;

  font-size: 10px;

  color: rgba(255,255,255,0.35);
}

.timer {
  margin-top: 50px;

  font-size: clamp(55px, 8vw, 90px);

  font-weight: 800;

  letter-spacing: -5px;

  font-variant-numeric: tabular-nums;

  background:
    linear-gradient(
      135deg,
      white,
      #8f82ff
    );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timer-label {
  font-size: 8px;

  letter-spacing: 3px;

  color: rgba(255,255,255,0.25);
}

.usage-progress {
  height: 5px;

  margin: 35px 0;

  border-radius: 10px;

  overflow: hidden;

  background:
    rgba(255,255,255,0.06);
}

.usage-progress div {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      #7869ff,
      #63a9ff
    );

  transition: width 0.5s;
}

.usage-stats {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;
}

.usage-stats div {
  padding: 15px;

  border-radius: 12px;

  background:
    rgba(255,255,255,0.025);
}

.usage-stats span,
.usage-stats strong {
  display: block;
}

.usage-stats span {
  font-size: 7px;

  letter-spacing: 1.5px;

  color: rgba(255,255,255,0.3);
}

.usage-stats strong {
  margin-top: 7px;

  font-size: 14px;
}

.active-text {
  color: #64e6a1;
}

.stop-button {
  width: 100%;

  height: 53px;

  margin-top: 25px;

  border:
    1px solid
    rgba(255,100,100,0.18);

  border-radius: 13px;

  color: #ff9a9a;

  background:
    rgba(255,70,70,0.06);
}

.side-info-card {
  padding: 25px;
}

.card-label {
  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.side-info-card h3 {
  margin: 15px 0 10px;

  font-size: 22px;

  line-height: 1.15;
}

.side-info-card p {
  font-size: 10px;

  line-height: 1.7;

  color: rgba(255,255,255,0.35);
}

.measurement {
  margin-top: 20px;

  padding-top: 15px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);
}

.measurement span,
.measurement strong {
  display: block;
}

.measurement span {
  font-size: 7px;

  letter-spacing: 1px;

  color: rgba(255,255,255,0.3);
}

.measurement strong {
  margin-top: 5px;

  font-size: 11px;
}

/* =========================================================
   BILL
========================================================= */

.bill-layout {
  display: grid;

  grid-template-columns:
    1.2fr
    0.8fr;

  gap: 20px;
}

.invoice-card,
.payment-next-card {
  border-radius: 22px;

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.invoice-card {
  padding: 35px;
}

.invoice-top {
  display: flex;

  justify-content: space-between;

  padding-bottom: 25px;

  border-bottom:
    1px solid
    rgba(255,255,255,0.08);
}

.invoice-logo {
  font-size: 17px;

  letter-spacing: 5px;

  font-weight: 900;
}

.invoice-top span {
  display: block;

  margin-top: 5px;

  font-size: 7px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.invoice-number {
  font-size: 9px;

  color: rgba(255,255,255,0.35);
}

.invoice-service {
  display: grid;

  grid-template-columns:
    1fr
    1fr
    1fr;

  gap: 15px;

  padding: 25px 0;

  border-bottom:
    1px solid
    rgba(255,255,255,0.08);
}

.invoice-service span,
.invoice-service strong {
  display: block;
}

.invoice-service span {
  font-size: 7px;

  letter-spacing: 1px;

  color: rgba(255,255,255,0.3);
}

.invoice-service strong {
  margin-top: 7px;

  font-size: 13px;
}

.invoice-lines {
  padding: 20px 0;

  border-bottom:
    1px solid
    rgba(255,255,255,0.08);
}

.invoice-lines div {
  display: flex;

  justify-content: space-between;

  margin: 10px 0;

  font-size: 11px;
}

.invoice-lines span {
  color: rgba(255,255,255,0.4);
}

.invoice-total {
  padding-top: 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;
}

.invoice-total span {
  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.35);
}

.invoice-total strong {
  font-size: 32px;
}

.payment-next-card {
  padding: 30px;

  display: flex;

  flex-direction: column;

  justify-content: center;
}

.payment-icon {
  width: 58px;
  height: 58px;

  border-radius: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    rgba(120,100,255,0.12);

  color: #a297ff;

  font-size: 25px;

  margin-bottom: 25px;
}

.payment-next-card h2 {
  margin: 10px 0;

  font-size: 27px;
}

.payment-next-card p {
  font-size: 11px;

  line-height: 1.7;

  color: rgba(255,255,255,0.38);

  margin-bottom: 25px;
}

/* =========================================================
   PAYMENT
========================================================= */

.payment-layout {
  display: grid;

  grid-template-columns:
    1.05fr
    0.95fr;

  gap: 30px;

  align-items: center;
}

.payment-card {
  padding: 30px;

  border-radius: 22px;

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.08);
}

.payment-card-header {
  display: flex;

  align-items: center;

  gap: 13px;
}

.mst-symbol {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background:
    linear-gradient(
      135deg,
      #7565ff,
      #3d7dff
    );

  font-size: 18px;

  font-weight: 900;
}

.payment-card-header span,
.payment-card-header strong {
  display: block;
}

.payment-card-header span {
  font-size: 7px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.payment-card-header strong {
  margin-top: 4px;

  font-size: 13px;
}

.network-live {
  margin-left: auto;

  display: flex;

  align-items: center;

  gap: 7px;

  font-size: 7px;

  color: #64e6a1;
}

.amount-display {
  padding: 35px 0;

  margin-top: 25px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

  text-align: center;
}

.amount-display span {
  display: block;

  font-size: 8px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.amount-display strong {
  display: block;

  margin-top: 10px;

  font-size: 50px;

  letter-spacing: -2px;
}

.wallet-warning {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 18px;

  padding: 13px;

  border-radius: 12px;

  background:
    rgba(255,180,70,0.06);

  border:
    1px solid
    rgba(255,180,70,0.12);
}

.wallet-warning > span {
  color: #ffc56a;
}

.wallet-warning strong,
.wallet-warning p {
  display: block;
}

.wallet-warning strong {
  font-size: 9px;
}

.wallet-warning p {
  margin: 3px 0 0;

  font-size: 8px;

  color: rgba(255,255,255,0.3);
}

.wallet-warning button {
  margin-left: auto;

  border: none;

  background:
    rgba(255,190,80,0.1);

  color: #ffc56a;

  padding: 8px 10px;

  border-radius: 8px;

  font-size: 8px;
}

.tx-section {
  margin: 22px 0;
}

.tx-section label {
  display: block;

  margin-bottom: 8px;

  font-size: 9px;

  color: rgba(255,255,255,0.5);
}

.tx-section input {
  width: 100%;

  height: 50px;

  padding: 0 15px;

  border-radius: 11px;

  outline: none;

  border:
    1px solid
    rgba(255,255,255,0.1);

  background:
    rgba(0,0,0,0.2);

  color: white;

  font-size: 11px;

  font-family: monospace;
}

.tx-section small {
  display: block;

  margin-top: 7px;

  font-size: 8px;

  line-height: 1.5;

  color: rgba(255,255,255,0.25);
}

/* PAYMENT 3D */

.settlement-visual {
  height: 400px;

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  perspective: 1000px;
}

.settlement-core {
  width: 150px;
  height: 150px;

  border-radius: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle,
      rgba(120,100,255,0.3),
      rgba(20,20,30,0.8)
    );

  border:
    1px solid
    rgba(150,135,255,0.35);

  box-shadow:
    0 0 80px
    rgba(100,80,255,0.2);

  animation:
    settlementFloat
    4s
    ease-in-out
    infinite;

  z-index: 5;
}

.settlement-core span {
  font-size: 9px;

  letter-spacing: 3px;

  color: #a79cff;
}

.settlement-core strong {
  font-size: 55px;

  margin: 5px 0;
}

.settlement-core small {
  font-size: 7px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.35);
}

@keyframes settlementFloat {
  0%,
  100% {
    transform:
      translateY(0)
      rotateX(0deg);
  }

  50% {
    transform:
      translateY(-15px)
      rotateX(8deg);
  }
}

.settlement-orbit {
  position: absolute;

  border-radius: 50%;

  border:
    1px solid
    rgba(130,110,255,0.2);
}

.orbit-a {
  width: 300px;
  height: 130px;

  transform:
    rotateX(65deg);

  animation:
    settlementOrbit
    7s
    linear
    infinite;
}

.orbit-b {
  width: 180px;
  height: 330px;

  transform:
    rotateY(65deg);

  animation:
    settlementOrbit
    9s
    linear
    infinite
    reverse;
}

@keyframes settlementOrbit {
  from {
    transform:
      rotateX(65deg)
      rotateZ(0);
  }

  to {
    transform:
      rotateX(65deg)
      rotateZ(360deg);
  }
}

.settlement-node {
  position: absolute;

  width: 52px;
  height: 52px;

  border-radius: 14px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(255,255,255,0.06);

  border:
    1px solid
    rgba(255,255,255,0.12);

  font-size: 8px;

  letter-spacing: 1px;
}

.node-top {
  top: 25px;
}

.node-right {
  right: 70px;
}

.node-bottom {
  bottom: 25px;

  color: #64e6a1;
}

/* =========================================================
   RECEIPT
========================================================= */

.success-screen {
  min-height: 70vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;
}

.success-orb {
  width: 95px;
  height: 95px;

  margin-bottom: 25px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(70,210,140,0.08);

  border:
    1px solid
    rgba(70,210,140,0.25);

  box-shadow:
    0 0 70px
    rgba(70,210,140,0.12);
}

.success-orb div {
  width: 60px;
  height: 60px;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #53dc9a,
      #42adff
    );

  font-size: 25px;

  font-weight: 900;
}

.success-screen h1 {
  margin: 12px 0;

  font-size: 43px;

  letter-spacing: -2px;
}

.success-screen > p {
  max-width: 520px;

  margin: 0;

  font-size: 11px;

  line-height: 1.7;

  color: rgba(255,255,255,0.4);
}

.receipt-card {
  width: 100%;

  max-width: 600px;

  margin-top: 30px;

  padding: 25px;

  text-align: left;

  border-radius: 20px;

  background:
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.08);
}

.receipt-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding-bottom: 20px;

  margin-bottom: 5px;

  border-bottom:
    1px solid
    rgba(255,255,255,0.07);
}

.receipt-header span,
.receipt-header strong {
  display: block;
}

.receipt-header span {
  font-size: 7px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.receipt-header strong {
  margin-top: 5px;

  font-size: 15px;

  letter-spacing: 4px;
}

.receipt-check {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(70,220,145,0.1);

  color: #64e6a1;
}

.receipt-row {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  padding: 14px 0;

  border-bottom:
    1px solid
    rgba(255,255,255,0.05);

  font-size: 10px;
}

.receipt-row span {
  color: rgba(255,255,255,0.35);
}

.paid-text {
  color: #64e6a1;
}

.hash-row {
  flex-direction: column;
}

.hash-row code {
  color: #9d91ff;

  font-size: 9px;

  word-break: break-all;
}

.receipt-actions {
  display: flex;

  gap: 10px;

  width: 100%;

  max-width: 600px;

  margin-top: 15px;
}

.receipt-actions .primary-button,
.receipt-actions .secondary-button {
  flex: 1;
}

.secondary-button {
  min-height: 52px;

  border-radius: 13px;

  padding: 0 20px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  background:
    rgba(255,255,255,0.04);

  color: white;
}

/* =========================================================
   ACTIVITY
========================================================= */

.activity-card {
  border-radius: 20px;

  background:
    rgba(255,255,255,0.03);

  border:
    1px solid
    rgba(255,255,255,0.07);

  overflow: hidden;
}

.activity-item {
  min-height: 90px;

  padding: 20px;

  display: grid;

  grid-template-columns:
    50px
    1fr
    auto;

  align-items: center;

  gap: 15px;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background:
    rgba(120,100,255,0.1);

  color: #9d90ff;
}

.success-icon {
  color: #64e6a1;

  background:
    rgba(70,220,145,0.08);
}

.activity-info strong,
.activity-info span {
  display: block;
}

.activity-info strong {
  font-size: 12px;
}

.activity-info span {
  margin-top: 5px;

  font-size: 8px;

  color: rgba(255,255,255,0.3);
}

.activity-amount {
  text-align: right;
}

.activity-amount strong,
.activity-amount span {
  display: block;
}

.activity-amount strong {
  font-size: 13px;
}

.activity-amount span {
  margin-top: 5px;

  font-size: 8px;

  color: #64e6a1;
}

.empty-state {
  padding: 70px 20px;

  text-align: center;
}

.empty-state > div {
  font-size: 35px;

  color: #8f82ff;
}

.empty-state h3 {
  margin: 15px 0 7px;

  font-size: 20px;
}

.empty-state p {
  margin: 0 auto 20px;

  max-width: 350px;

  font-size: 10px;

  line-height: 1.6;

  color: rgba(255,255,255,0.3);
}

.empty-state .primary-button {
  width: auto;

  display: inline-flex;
}

/* =========================================================
   WALLET
========================================================= */

.wallet-page-card {
  min-height: 390px;

  padding: 35px;

  display: grid;

  grid-template-columns:
    0.8fr
    1.2fr;

  gap: 50px;

  align-items: center;

  border-radius: 24px;

  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(100,80,255,0.13),
      transparent 30%
    ),
    rgba(255,255,255,0.035);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.wallet-visual {
  height: 300px;

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;
}

.wallet-orbit {
  width: 240px;
  height: 240px;

  border-radius: 50%;

  border:
    1px solid
    rgba(130,110,255,0.2);

  transform:
    rotateX(65deg);

  animation:
    orbitOne
    8s
    linear
    infinite;
}

.wallet-core {
  position: absolute;

  width: 100px;
  height: 100px;

  border-radius: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #7666ff,
      #397eff
    );

  box-shadow:
    0 0 70px
    rgba(100,80,255,0.3);

  font-size: 30px;

  animation:
    coreFloat
    4s
    ease-in-out
    infinite;
}

.wallet-details {
  max-width: 600px;
}

.wallet-details h2 {
  margin: 10px 0;

  font-size: 32px;
}

.wallet-details > p {
  max-width: 500px;

  font-size: 11px;

  line-height: 1.7;

  color: rgba(255,255,255,0.38);
}

.address-box {
  margin: 25px 0;

  padding: 15px;

  border-radius: 12px;

  background:
    rgba(0,0,0,0.18);

  border:
    1px solid
    rgba(255,255,255,0.07);
}

.address-box span {
  display: block;

  margin-bottom: 8px;

  font-size: 7px;

  letter-spacing: 2px;

  color: rgba(255,255,255,0.3);
}

.address-box code {
  font-size: 10px;

  color: #9d91ff;

  word-break: break-all;
}

.wallet-details .primary-button,
.wallet-details .secondary-button {
  width: auto;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 1100px) {
  .login-content {
    grid-template-columns: 1fr;
  }

  .login-card-wrapper {
    justify-self: center;
  }

  .hero-area {
    text-align: center;
  }

  .hero-copy {
    margin: auto;
  }

  .hero-copy p {
    margin-left: auto;
    margin-right: auto;
  }

  .aurex-3d-scene {
    margin-top: 10px;
  }

  .dashboard-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }

  .usage-layout,
  .bill-layout,
  .payment-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    transition: 0.25s;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .main-area {
    width: 100%;
    margin-left: 0;
  }

  .mobile-brand {
    display: flex;

    align-items: center;

    gap: 12px;

    margin-right: auto;
  }

  .menu-button {
    display: block;

    border: none;

    background: transparent;

    color: white;

    font-size: 20px;
  }

  .app-header {
    padding: 0 20px;
  }

  .page-content {
    padding: 25px 20px;
  }

  .service-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .wallet-page-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .login-nav {
    padding: 0 20px;
  }

  .brand-tagline {
    display: none;
  }

  .wallet-button {
    padding: 9px 11px;
  }

  .login-content {
    padding: 30px 18px;
  }

  .hero-copy h1 {
    font-size: 46px;
    letter-spacing: -3px;
  }

  .aurex-3d-scene {
    width: 360px;
    height: 360px;
    transform: scale(0.7);
    margin: -40px auto;
  }

  .login-card {
    padding: 25px;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-heading h1 {
    font-size: 30px;
  }

  .dashboard-grid,
  .service-grid {
    grid-template-columns: 1fr;
  }

  .usage-stats {
    grid-template-columns: 1fr;
  }

  .invoice-service {
    grid-template-columns: 1fr;
  }

  .receipt-actions {
    flex-direction: column;
  }

  .activity-item {
    grid-template-columns:
      45px
      1fr;
  }

  .activity-amount {
    grid-column: 2;
    text-align: left;
  }

  .header-status .status-pill {
    display: none;
  }

  .settlement-visual {
    height: 300px;
  }
}
`;