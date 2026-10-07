# Aurex AI — Unified AI Productivity Suite & Pay-Per-Use Cloud

> **"Subscription when you need it. Pay-per-use when you don't."**

Aurex AI is an enterprise-grade, high-performance SaaS platform uniting 9+ advanced AI productivity tools into a single workspace, backed by a dual financial architecture: traditional subscriptions (Free, Pro, Yearly) and the unique **Aurex Pay-Per-Use Protocol**.

---

## 🌟 Key Highlights & Philosophy

- **Pay-Per-Use Financial Infrastructure**: Instead of paying ₹999/month for unused computing bandwidth, users accessing via Aurex pay micro-amounts (as low as ₹0.05) calculated on exact tokens, words, pages, or images processed.
- **Pre-Execution Confirmation**: The platform never silently debits funds. Every paid task presents a transparent pre-flight quote breakdown (`Usage × Unit Rate = Estimated Cost`) with instant balance validation before task dispatch.
- **9 Production-Grade AI Modules**:
  1. **Document Plagiarism Checker**: Multi-source academic & web matching across 10B+ indexes.
  2. **AI Text Summarizer**: Executive briefings, key takeaways, and keyword tagging.
  3. **Vision & Image Intelligence**: Neural object classification, scene parsing, and color extraction.
  4. **High-Precision OCR**: Tabular invoice and receipt extraction into editable text.
  5. **PDF Deep Analyzer**: Structural outline and section-by-section intelligence.
  6. **Contextual AI Chat**: Multi-turn conversation with memory and token metering.
  7. **AI Content Detector**: Perplexity and burstiness evaluation with sentence-level highlights.
  8. **Grammar & Writing Assistant**: Syntax enhancement, clarity fixes, and category tags.
  9. **Document Question Answering**: Grounded document search with exact page citations.
- **Futuristic Visual Identity**: Custom dark theme (`#08090D`, `#11131A`, `#151824`), glowing radial orbs, selective glassmorphism, Framer Motion transitions, and Recharts telemetry.
- **Fail-Safe Zero-Config Execution**: Automatically runs in intelligent Demo Mode with simulated instant Aurex settlement and AI responses if local MongoDB is unreachable.

---

## 🏗️ Architecture & Monorepo Structure

```
aurex-ai-platform/
├── apps/
│   ├── web/                    # Next.js 14 App Router, React 18, Tailwind CSS, Lucide
│   │   ├── app/                # Route definitions & Pages
│   │   │   ├── (auth)/         # /login, /register, /forgot-password
│   │   │   ├── dashboard/      # Main workspace & KPI overview
│   │   │   ├── tools/          # AI tools hub & individual tools
│   │   │   ├── aurex/          # Dedicated Aurex wallet & ledger dashboard
│   │   │   ├── pricing/        # Pricing matrix & centralized unit rate schedule
│   │   │   ├── billing/        # Invoices, subscription controls
│   │   │   ├── usage/          # Recharts telemetry & consumption analytics
│   │   │   ├── history/        # Unified historical audit trail
│   │   │   ├── settings/       # Profile, security, Aurex protocol controls
│   │   │   ├── profile/        # Identity card & connected wallets
│   │   │   └── admin/          # Operations console & dynamic pricing manager
│   │   ├── components/         # Navigation, modals, AurexPayModal, AppShell
│   │   ├── context/            # AuthContext & AurexContext
│   │   └── lib/                # API client with automatic token attachment
│   └── api/                    # Express.js, TypeScript backend
│       └── src/
│           ├── config/         # Database with graceful in-memory fallback
│           ├── controllers/    # Auth, Aurex, AI, Subscription, Usage, Admin
│           ├── middleware/     # JWT authentication, Multer upload security
│           ├── providers/      # Swappable AIProvider & AurexPaymentProvider
│           ├── routes/         # REST API endpoints
│           └── services/       # PricingEngine & UsageMeter
└── packages/
    └── shared/                 # Shared data contracts, types & pricing definitions
```

---

## ⚡ Quick Start (VS Code)

### Prerequisites
- Node.js `v18.x` or higher (`v20+` recommended)
- npm `v9+` or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```

Alternatively, run in separate terminals:
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:api

# Terminal 2: Next.js Frontend (Port 3000)
npm run dev:web
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 💳 Aurex Pay-Per-Use Demonstration Walkthrough

1. Navigate to **[http://localhost:3000](http://localhost:3000)**.
2. Click **Launch Workspace** or **Sign In** (use the 1-Click **Aurex PAYG User** button to log in instantly as Alex Vance with ₹245.60 balance).
3. Select any AI tool, for example **Plagiarism Checker** or **Text Summarizer**.
4. Upload a document or enter text.
5. Click **Run Plagiarism Check** or **Generate AI Summary**.
6. Observe the **Aurex Pay-Per-Use Modal**:
   - Service name & detected usage
   - Unit price breakdown
   - Real-time Aurex wallet balance
7. Click **Confirm & Pay**.
8. Observe the animated confirmation:
   - Micro-deduction settled on ledger
   - Transaction ID displayed (`TXN-XXXXXX`)
9. The AI operation runs and delivers the completed report!
10. Visit **Aurex Dashboard** (`/aurex`) or **Activity History** (`/history`) to verify the updated balance and transaction receipt.

---

## 🔒 Security & Best Practices

- **Zero Plaintext Credentials**: Bcrypt password hashing with high salt rounds.
- **Ephemeral Processing**: Documents are parsed in-memory and flushed upon task completion.
- **Provider Decoupling**: AI models and payment processors communicate via abstract interfaces (`AIProvider`, `AurexPaymentProvider`), permitting easy swapping of real SDKs without touching UI or business logic.
- **Rate-Limiting & Content Type Validation**: Strict file filter restricts execution to verified PDF, DOCX, TXT, and approved image formats.

---

## 📄 License
MIT License. © 2026 Aurex AI Platform.
