# backend/services/firestore_service.py
from google.cloud import firestore
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(
    os.path.dirname(__file__), "credentials.json"
)

db = firestore.Client(project="gen-ai-exchange-470314")

def get_user_by_email(email: str):
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).stream()
    for doc in query:
        return doc.to_dict()
    return None

def create_user(user_data: dict):
    users_ref = db.collection("users")
    doc_ref = users_ref.document()  # auto-generate ID
    user_data["id"] = doc_ref.id    # save Firestore doc ID
    doc_ref.set(user_data)

    return {
        "status": "success",
        "message": "User created successfully",
        "user": {k: v for k, v in user_data.items() if k != "password"}  # don’t return password
    }
