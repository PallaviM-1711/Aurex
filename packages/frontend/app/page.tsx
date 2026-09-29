"use client";

import { useState } from "react";

type UsageResponse = {
  usage_id: number;
  status: string;
  start_time: string;
};

type StopResponse = {
  usage_id: number;
  quantity: number;
  status: string;
};

type BillResponse = {
  bill_id: number;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
};

export default function Home() {
  const [isUsing, setIsUsing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [usage, setUsage] =
    useState<UsageResponse | null>(null);

  const [stoppedUsage, setStoppedUsage] =
    useState<StopResponse | null>(null);

  const [bill, setBill] =
    useState<BillResponse | null>(null);

  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  /* =========================
     START USAGE
  ========================= */

  const startUsage = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/usage/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 1,
            service_id: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to start usage."
        );
      }

      const data: UsageResponse =
        await response.json();

      setUsage(data);
      setIsUsing(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STOP USAGE
  ========================= */

  const stopUsage = async () => {
    if (!usage) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/usage/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usage_id: usage.usage_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to stop usage."
        );
      }

      const data: StopResponse =
        await response.json();

      setStoppedUsage(data);
      setIsUsing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GENERATE BILL
  ========================= */

  const generateBill = async () => {
    if (!stoppedUsage) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usage_id: stoppedUsage.usage_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to generate bill."
        );
      }

      const data: BillResponse =
        await response.json();

      setBill(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="logo">
          <div className="logo-mark">
            A
          </div>

          <span>Aurex</span>
        </div>

        <nav>
          <a className="active" href="/">
            Services
          </a>

          <a href="/activity">
            Activity
          </a>
        </nav>

        <button className="wallet-button">
          Connect Wallet
        </button>
      </header>

      {/* =========================
          PAGE
      ========================= */}

      <section className="services-page">

        <div className="page-heading">
          <div>
            <p className="eyebrow">
              AUREX PAYMENT PLATFORM
            </p>

            <h1>
              Usage & Billing
            </h1>

            <p className="subtitle">
              Use the service, stop when you're done,
              and pay only for your actual usage.
            </p>
          </div>

          <div className="network-status">
            <span className="status-dot" />
            MST Testnet
          </div>
        </div>

        {/* =========================
            WORKSPACE CARD
        ========================= */}

        <div className="service-grid">

          <div className="service-card selected">

            <div className="service-card-top">

              <div className="service-icon">
                W
              </div>

              <span className="available">
                Workspace
              </span>

            </div>

            <div className="service-content">

              <h2>
                Workspace
              </h2>

              <p>
                Usage-based workspace service.
                Your final price depends on
                the actual time consumed.
              </p>

            </div>

            <div className="price-section">

              <span>
                Usage rate
              </span>

              <div className="price">

                <strong>
                  ₹50
                </strong>

                <span>
                  / hour
                </span>

              </div>

            </div>

            {/* START */}

            {!isUsing &&
              !stoppedUsage &&
              !bill && (
                <button
                  className="start-button"
                  onClick={startUsage}
                  disabled={loading}
                >
                  {loading
                    ? "Starting..."
                    : "Start Using"}

                  <span>
                    →
                  </span>
                </button>
              )}

            {/* STOP */}

            {isUsing && usage && (
              <button
                className="start-button"
                onClick={stopUsage}
                disabled={loading}
              >
                {loading
                  ? "Stopping..."
                  : "Stop Usage"}

                <span>
                  ■
                </span>
              </button>
            )}

            {/* GENERATE BILL */}

            {stoppedUsage && !bill && (
              <button
                className="start-button"
                onClick={generateBill}
                disabled={loading}
              >
                {loading
                  ? "Generating..."
                  : "Generate Bill"}

                <span>
                  →
                </span>
              </button>
            )}

          </div>

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="info-panel">

            <div className="info-icon">
              !
            </div>

            <div>

              <strong>
                Request failed
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =========================
            ACTIVE SESSION
        ========================= */}

        {isUsing && usage && (
          <div className="active-usage-panel">

            <div>

              <p className="eyebrow">
                ACTIVE SESSION
              </p>

              <h2>
                Workspace is currently in use
              </h2>

              <p>
                Usage ID:{" "}
                {usage.usage_id}
              </p>

              <p>
                Started:{" "}
                {new Date(
                  usage.start_time
                ).toLocaleString()}
              </p>

            </div>

            <div className="usage-status">

              <span className="status-dot" />

              ACTIVE

            </div>

          </div>
        )}

        {/* =========================
            STOPPED SESSION
        ========================= */}

        {stoppedUsage && !bill && (
          <div className="active-usage-panel">

            <div>

              <p className="eyebrow">
                USAGE COMPLETED
              </p>

              <h2>
                Usage session completed
              </h2>

              <p>
                Usage ID:{" "}
                {stoppedUsage.usage_id}
              </p>

              <p>
                Quantity:{" "}
                {stoppedUsage.quantity} hours
              </p>

            </div>

            <div className="usage-status">

              <span className="status-dot" />

              STOPPED

            </div>

          </div>
        )}

        {/* =========================
            BILL
        ========================= */}

        {bill && (
          <div className="active-usage-panel">

            <div>

              <p className="eyebrow">
                BILL GENERATED
              </p>

              <h2>
                Your Aurex bill
              </h2>

              <p>
                Bill ID:{" "}
                {bill.bill_id}
              </p>

              {stoppedUsage && (
                <p>
                  Usage:{" "}
                  {stoppedUsage.quantity} hours
                </p>
              )}

              <p>
                Subtotal: ₹
                {bill.subtotal.toFixed(2)}
              </p>

              <p>
                Tax: ₹
                {bill.tax.toFixed(2)}
              </p>

              <p>
                Status:{" "}
                {bill.status}
              </p>

            </div>

            <div className="bill-total">

              <span>
                Total
              </span>

              <strong>
                ₹{bill.total.toFixed(2)}
              </strong>

            </div>

          </div>
        )}

        {/* =========================
            FLOW
        ========================= */}

        <div className="info-panel">

          <div className="info-icon">
            i
          </div>

          <div>

            <strong>
              Aurex payment flow
            </strong>

            <p>
              Service → Start Usage → Track Usage →
              Stop Usage → Bill → MST Payment → Receipt
            </p>

          </div>

        </div>

      </section>
    </main>
  );
}