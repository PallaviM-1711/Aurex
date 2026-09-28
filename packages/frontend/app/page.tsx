"use client";

export default function Home() {
  return (
    <main className="app">
      <header className="navbar">
        <div className="logo">
          <div className="logo-mark">A</div>
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

      <section className="services-page">
        <div className="page-heading">
          <div>
            <p className="eyebrow">AUREX PAYMENT PLATFORM</p>

            <h1>
              Choose a service
            </h1>

            <p className="subtitle">
              Select a service and pay according to your actual
              usage.
            </p>
          </div>

          <div className="network-status">
            <span className="status-dot" />
            MST Testnet
          </div>
        </div>

        <div className="service-grid">
          {/* Workspace */}
          <div className="service-card selected">
            <div className="service-card-top">
              <div className="service-icon">
                W
              </div>

              <span className="available">
                Available
              </span>
            </div>

            <div className="service-content">
              <h2>Workspace</h2>

              <p>
                Use a flexible digital workspace and pay
                according to the time you consume.
              </p>
            </div>

            <div className="price-section">
              <span>Usage rate</span>

              <div className="price">
                <strong>₹50</strong>
                <span>/ hour</span>
              </div>
            </div>

            <button className="start-button">
              Start Using
              <span>→</span>
            </button>
          </div>

          {/* AI Compute */}
          <div className="service-card">
            <div className="service-card-top">
              <div className="service-icon">
                AI
              </div>

              <span className="coming-soon">
                Demo
              </span>
            </div>

            <div className="service-content">
              <h2>AI Compute</h2>

              <p>
                Usage-based compute service designed to
                demonstrate resource-based billing.
              </p>
            </div>

            <div className="price-section">
              <span>Billing model</span>

              <div className="price">
                <strong>Usage</strong>
                <span>based</span>
              </div>
            </div>

            <button className="start-button secondary">
              View Service
              <span>→</span>
            </button>
          </div>

          {/* Rendering */}
          <div className="service-card">
            <div className="service-card-top">
              <div className="service-icon">
                3D
              </div>

              <span className="coming-soon">
                Demo
              </span>
            </div>

            <div className="service-content">
              <h2>3D Rendering</h2>

              <p>
                A demonstration service where customers
                are charged based on rendering usage.
              </p>
            </div>

            <div className="price-section">
              <span>Billing model</span>

              <div className="price">
                <strong>Usage</strong>
                <span>based</span>
              </div>
            </div>

            <button className="start-button secondary">
              View Service
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="info-panel">
          <div className="info-icon">i</div>

          <div>
            <strong>How Aurex works</strong>

            <p>
              Choose a service → Start using → Track usage →
              Stop usage → Generate your bill → Pay with MST.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}