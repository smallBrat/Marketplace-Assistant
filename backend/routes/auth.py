# backend/routes/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.firestore_service import create_user, get_user_by_email
import hashlib
from firebase_admin import firestore

db = firestore.Client(project="gen-ai-exchange-470314")
router = APIRouter(tags=["Auth"]) 

# ---------- Schemas ----------
class SignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    age: int
    gender: str
    city: str
    state: str
    country: str
    primary_craft: str
    experience: str

class SignUpResponse(BaseModel):
    status: str
    message: str
    user: dict

class LoginResponse(BaseModel):
    status: str
    message: str
    user: dict | None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------- Routes ----------
@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        if data.password != data.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        if get_user_by_email(data.email):
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_pw = hashlib.sha256(data.password.encode()).hexdigest()

         # Accept both `primary_craft` and `craftCategory`
        primary_craft = (
            getattr(data, "primary_craft", None) 
            or getattr(data, "craftCategory", None)
        )

        user_data = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "age": data.age,
            "gender": data.gender,
            "city": data.city,
            "state": data.state,
            "country": data.country,
            "primary_craft": primary_craft,
            "experience": data.experience,
        }

        user_id = create_user(user_data)

        return {
            "status": "success",
            "message": "User created successfully",
            "user": {
                "id": user_id,
                "email": data.email,
                "full_name": data.full_name
            }
        }

    except Exception as e:
        print("🔥 Signup error:", e)   # 👈 log in backend
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@router.post("/login")
def login_user(data: LoginRequest):
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", data.email).limit(1).stream()
    user_doc = None
    for doc in query:
        user_doc = doc
        break

    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")

    user_data = user_doc.to_dict()

    # Hash the input password before comparing
    hashed_pw = hashlib.sha256(data.password.encode()).hexdigest()

    if user_data["password"] != hashed_pw:
        raise HTTPException(status_code=401, detail="Invalid password")

    # Simple prototype response
    return {
        "status": "success",
        "message": "Login successful",
        "user": {
            "email": user_data["email"],
            "full_name": user_data.get("full_name"),
        }
    }