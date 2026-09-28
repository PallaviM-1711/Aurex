# ⚡ Aurex

### AI-Powered Usage-Based Payment Platform on MST Blockchain

Aurex is a blockchain-powered payment platform that enables users to pay for digital services based on their actual usage.

Instead of paying a fixed amount upfront, users authorize a maximum budget and Aurex automatically settles the final payment according to the service usage.

---

## 🚀 Problem

Digital services such as GPU computing, APIs, cloud resources and other on-demand services are often charged using fixed packages or subscriptions.

This can result in:

- Paying for resources that were not fully used
- Difficult manual settlement
- Unused budget being locked
- Lack of transparent payment tracking

---

## 💡 Aurex Solution

Aurex introduces **usage-based blockchain payments**.

A user can request a service such as:

> "I need a GPU for 20 minutes within 5 MSTC."

Aurex can recommend a suitable service and allow the user to authorize a maximum budget.

The smart contract then:

1. Locks the maximum authorized budget.
2. Starts the service session.
3. Records the usage duration supplied by the application.
4. Calculates the final cost.
5. Pays the service provider.
6. Automatically refunds the unused amount to the user.

---

## 🔄 How Aurex Works

```text
User Request
     ↓
AI Service Recommendation
     ↓
User Authorizes Maximum Budget
     ↓
MST Smart Contract
     ↓
Service Usage
     ↓
Usage Duration Submitted
     ↓
Final Cost Calculation
     ↓
┌───────────────────────┐
│ Provider Payment      │
│ +                     │
│ User Refund           │
└───────────────────────┘
     ↓
Transparent Blockchain Transaction
