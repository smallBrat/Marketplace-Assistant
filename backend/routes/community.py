from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_community():
    return {"message": "Community route placeholder"}
