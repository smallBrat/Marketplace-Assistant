import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate("services/credentials.json")  # path to your Firebase key
    firebase_admin.initialize_app(cred)

db = firestore.client()