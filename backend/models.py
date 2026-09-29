# from sqlalchemy import Column, Integer, Float, String, DateTime
# from database import Base


# class Usage(Base):
#     __tablename__ = "usage"

#     usage_id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, nullable=False)
#     service_id = Column(Integer, nullable=False)
#     start_time = Column(DateTime, nullable=False)
#     stop_time = Column(DateTime, nullable=True)
#     quantity = Column(Float, nullable=True)
#     status = Column(String, nullable=False)


# class Bill(Base):
#     __tablename__ = "bills"  # Ensure TWO underscores before and after: __tablename__

#     bill_id = Column("id", Integer, primary_key=True, index=True)
#     usage_id = Column(Integer, nullable=False)
#     subtotal = Column(Float, nullable=False)
#     tax = Column(Float, nullable=False)
#     total = Column(Float, nullable=False)
#     status = Column(String, nullable=False)



# class Payment(Base):
#     __tablename__ = "payments"

#     receipt_id = Column(Integer, primary_key=True, index=True)
#     bill_id = Column(Integer, nullable=False)
#     amount = Column(Float, nullable=False)
#     tx_hash = Column(String, nullable=False)

from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base


class Usage(Base):
    __tablename__ = "usage"

    usage_id = Column("id", Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    service_id = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=False)
    stop_time = Column(DateTime, nullable=True)
    quantity = Column(Float, nullable=True)
    status = Column(String, nullable=False)


class Bill(Base):
    __tablename__ = "bills"

    bill_id = Column("id", Integer, primary_key=True, index=True)
    usage_id = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String, nullable=False)


class Payment(Base):
    __tablename__ = "transactions"

    receipt_id = Column("id", Integer, primary_key=True, index=True)
    bill_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    tx_hash = Column(String, nullable=False)
    status = Column(String, default="success")