from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, products, community, analytics
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Marketplace Assistant API",
    version="1.0.0",
    description="Backend API for Artisan Marketplace Assistant"
)

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # if you sometimes use Vite
        "http://localhost:3000",  # React dev server
        "https://marketplaceassistant.netlify.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(products.router, prefix="/api/v1")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Health check route
@app.get("/")
def root():
    return {"message": "Marketplace Assistant Backend is running 🚀"}
