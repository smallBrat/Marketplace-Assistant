# backend/routes/users.py
from fastapi import APIRouter, HTTPException
from firebase_admin import firestore

db = firestore.Client(project="gen-ai-exchange-470314")
router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{email}")
def get_user(email: str):
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).stream()

    user_doc = None
    for doc in query:
        user_doc = doc
        break

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    return user_doc.to_dict()
