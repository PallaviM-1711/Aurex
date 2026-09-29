from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import Usage, Bill, Payment


app = FastAPI(title="Aurex Backend")


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {"message": "Aurex Backend is running!"}


# --------------------------------------------------
# 1. START USAGE
# --------------------------------------------------

@app.post("/usage/start")
def start_usage(data: dict, db: Session = Depends(get_db)):

    usage = Usage(
        user_id=data["user_id"],
        service_id=data["service_id"],
        start_time=datetime.now(),
        status="active"
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return {
        "usage_id": usage.usage_id,
        "status": usage.status,
        "start_time": usage.start_time
    }


# --------------------------------------------------
# 2. STOP USAGE
# --------------------------------------------------

# --------------------------------------------------
# 2. STOP USAGE
# --------------------------------------------------

@app.post("/usage/stop")
def stop_usage(data: dict, db: Session = Depends(get_db)):
    # Safely handle either "usage_id" or "id" from test scripts
    usage_id = data.get("usage_id") or data.get("id")

    usage = db.query(Usage).filter(
        Usage.usage_id == usage_id
    ).first()

    if not usage:
        return {"error": "Usage not found"}

    if usage.status == "stopped":
        return {"error": "Usage already stopped"}

    stop_time = datetime.now()
    usage.stop_time = stop_time

    # Safe timezone-stripped duration calculation
    try:
        start_naive = usage.start_time.replace(tzinfo=None)
        stop_naive = stop_time.replace(tzinfo=None)
        duration = stop_naive - start_naive
        quantity = round(duration.total_seconds() / 3600, 4)
    except Exception:
        quantity = 0.01

    if quantity <= 0:
        quantity = 0.01

    usage.quantity = quantity
    usage.status = "stopped"

    db.commit()
    db.refresh(usage)

    return {
        "usage_id": usage.usage_id,
        "quantity": usage.quantity,
        "status": usage.status
    }


# --------------------------------------------------
# 3. GENERATE BILL
# --------------------------------------------------

@app.post("/bill")
def generate_bill(data: dict, db: Session = Depends(get_db)):

    usage_id = data["usage_id"]

    usage = db.query(Usage).filter(
        Usage.usage_id == usage_id
    ).first()

    if not usage:
        return {"error": "Usage not found"}

    if usage.status != "stopped":
        return {
            "error": "Usage must be stopped before billing"
        }

    # Demo rate: ₹50 per hour
    rate_per_hour = 50

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


# --------------------------------------------------
# 4. RECORD PAYMENT
# --------------------------------------------------

# --------------------------------------------------
# 4. RECORD PAYMENT
# --------------------------------------------------

@app.post("/payment/create")
def create_payment(
    data: dict,
    db: Session = Depends(get_db)
):
    bill_id = data["bill_id"]
    amount = data["amount"]
    tx_hash = data["tx_hash"]

    bill = db.query(Bill).filter(
        Bill.bill_id == bill_id
    ).first()

    if not bill:
        return {"error": "Bill not found"}

    if bill.status == "paid":
        return {"error": "Bill is already paid"}

    # Use round() to avoid float precision comparison mismatches (e.g. 0.1100000001 != 0.11)
    if round(float(amount), 2) != round(float(bill.total), 2):
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