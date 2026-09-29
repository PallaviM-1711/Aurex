from database import engine, Base
from models import Usage, Bill, Payment
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")