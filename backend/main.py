from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import Usage, Bill, Payment


app = FastAPI(title="Aurex Backend")


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Aurex Backend is running!"
    }


# ---------------------------------------------------------
# START USAGE
# ---------------------------------------------------------

@app.post("/usage/start")
def start_usage(
    data: dict,
    db: Session = Depends(get_db)
):
    # The frontend currently sends the MST wallet address
    # as "user_id".
    #
    # We store that address in wallet_address instead of
    # trying to put it into the integer user_id column.

    wallet_address = data.get("wallet_address") or data.get("user_id")

    if not wallet_address:
        return {
            "error": "Wallet address is required"
        }

    usage = Usage(
        user_id=None,
        wallet_address=wallet_address,
        service_id=data["service_id"],
        start_time=datetime.now(),
        status="active"
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return {
        "usage_id": usage.usage_id,
        "wallet_address": usage.wallet_address,
        "service_id": usage.service_id,
        "status": usage.status,
        "start_time": usage.start_time
    }


# ---------------------------------------------------------
# STOP USAGE
# ---------------------------------------------------------

@app.post("/usage/stop")
def stop_usage(
    data: dict,
    db: Session = Depends(get_db)
):
    usage_id = data.get("usage_id") or data.get("id")

    usage = (
        db.query(Usage)
        .filter(Usage.usage_id == usage_id)
        .first()
    )

    if not usage:
        return {
            "error": "Usage not found"
        }

    if usage.status == "stopped":
        return {
            "error": "Usage already stopped"
        }

    stop_time = datetime.now()

    usage.stop_time = stop_time

    try:
        start_naive = usage.start_time.replace(tzinfo=None)
        stop_naive = stop_time.replace(tzinfo=None)

        duration = stop_naive - start_naive

        # Quantity is measured in hours.
        quantity = round(
            duration.total_seconds() / 3600,
            4
        )

    except Exception:
        quantity = 0.01

    # Prevent zero/negative usage.
    if quantity <= 0:
        quantity = 0.01

    usage.quantity = quantity
    usage.status = "stopped"

    db.commit()
    db.refresh(usage)

    return {
        "usage_id": usage.usage_id,
        "wallet_address": usage.wallet_address,
        "quantity": usage.quantity,
        "status": usage.status
    }


# ---------------------------------------------------------
# GENERATE BILL
# ---------------------------------------------------------

@app.post("/bill")
def generate_bill(
    data: dict,
    db: Session = Depends(get_db)
):
    usage_id = data["usage_id"]

    usage = (
        db.query(Usage)
        .filter(Usage.usage_id == usage_id)
        .first()
    )

    if not usage:
        return {
            "error": "Usage not found"
        }

    if usage.status != "stopped":
        return {
            "error": "Usage must be stopped before billing"
        }

    # Aurex MST Testnet pricing:
    #
    # 0.20 tMSTC per minute
    # = 12 tMSTC per hour

    rate_per_hour = 12

    subtotal = round(
        usage.quantity * rate_per_hour,
        2
    )

    tax = 0
    total = subtotal + tax

    bill = Bill(
        usage_id=usage_id,
        subtotal=subtotal,
        tax=tax,
        total=total,
        status="unpaid"
    )

    db.add(bill)
    db.commit()
    db.refresh(bill)

    return {
        "bill_id": bill.bill_id,
        "subtotal": bill.subtotal,
        "tax": bill.tax,
        "total": bill.total,
        "status": bill.status
    }


# ---------------------------------------------------------
# CREATE PAYMENT
# ---------------------------------------------------------

@app.post("/payment/create")
def create_payment(
    data: dict,
    db: Session = Depends(get_db)
):
    bill_id = data["bill_id"]
    amount = data["amount"]
    tx_hash = data["tx_hash"]

    bill = (
        db.query(Bill)
        .filter(Bill.bill_id == bill_id)
        .first()
    )

    if not bill:
        return {
            "error": "Bill not found"
        }

    if bill.status == "paid":
        return {
            "error": "Bill is already paid"
        }

    if round(float(amount), 2) != round(
        float(bill.total),
        2
    ):
        return {
            "error": "Payment amount does not match bill total"
        }

    payment = Payment(
        bill_id=bill_id,
        amount=amount,
        tx_hash=tx_hash,
        status="success"
    )

    db.add(payment)

    bill.status = "paid"

    db.commit()
    db.refresh(payment)

    return {
        "status": "success",
        "tx_hash": payment.tx_hash,
        "receipt_id": payment.receipt_id
    }