
# backend/routes/products.py
from fastapi import APIRouter, HTTPException, UploadFile, Form, Request
from firebase_config import db
from datetime import datetime
import uuid
import shutil
import os
from services.vertex_ai_service import generate_product_content
from services.gemini_image_service import enhance_product_image  # new import
from fastapi import File
from typing import List
import json

router = APIRouter(tags=["Products"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/add")
async def add_product(
    request: Request,
    email: str = Form(...),  # frontend should send logged-in user's email
    title: str = Form(...),
    description: str = Form(""),
    keywords: str = Form("[]"),  # frontend sends JSON string of keywords
    story: str = Form(""),
    image: UploadFile = None,
    voice_note: UploadFile = File(None)  # optional voice note
):
    try:
        # --- Fetch artisan info from Firestore ---
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", email).limit(1).stream()

        user_doc = None
        for doc in query:
            user_doc = doc
            break

        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user_doc.to_dict()
        artisan_id = user_doc.id  # Firestore document ID as artisan_id
        artisan_location = user_data.get("location", "")

        # --- Handle image upload ---
        image_url = ""
        image_path = None

        if image:
            file_ext = os.path.splitext(image.filename)[-1]
            filename = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)

            # Save uploaded file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            # Enhance image using Gemini 2.5 image-preview model
            enhanced_path = enhance_product_image(file_path)

            # If enhance_product_image failed and returned original, enhanced_path will be file_path
            if enhanced_path and os.path.exists(enhanced_path):
                image_url = f"{request.base_url}uploads/{os.path.basename(enhanced_path)}"
                image_path = enhanced_path
                print(f"[Products] Using enhanced image: {image_url}")
            else:
                # fallback to original uploaded file if something went wrong
                image_url = f"{request.base_url}uploads/{os.path.basename(file_path)}"
                image_path = file_path
                print(f"[Products] Enhancement failed, using original image: {image_url}")

        # --- Parse keywords JSON string into Python list ---
        try:
            keywords_list = json.loads(keywords)
            if not isinstance(keywords_list, list):
                keywords_list = []
        except Exception:
            keywords_list = []

        # --- Save & process voice note (optional) ---
        voice_note_url = ""
        voice_note_path = None
        if voice_note:
            file_ext = os.path.splitext(voice_note.filename)[-1]
            filename = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(voice_note.file, buffer)
            voice_note_url = f"/{UPLOAD_DIR}/{os.path.basename(file_path)}"
            voice_note_path = file_path

        # --- Generate AI content (title, description, backstory) ---
        generated = generate_product_content(
            title, story, description, artisan_location, image_path,
            keywords_list, voice_note_path
        )

        new_title = generated["title"]
        final_description = generated["description"]
        backstory = generated["backstory"]

        # --- Save to Firestore ---
        doc_ref = db.collection("products").document()
        product_data = {
            "artisan_id": artisan_id,
            "title": new_title,
            "description": final_description,
            "story": story,
            "backstory": backstory,
            "artisan_location": artisan_location,
            "image": image_url,
            "voice_note": voice_note_url,   # NEW
            "keywords": keywords_list,      # NEW
            "created_at": datetime.utcnow().isoformat(),
        }
        doc_ref.set(product_data)

        return {
            "message": "✅ Product added successfully",
            "id": doc_ref.id,
            "product": product_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get product by ID
@router.get("/{product_id}")
async def get_product(product_id: str):
    try:
        doc_ref = db.collection("products").document(product_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Product not found")

        return {
            "id": doc.id,
            **doc.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Regenerate AI content for a product by ID
@router.post("/{product_id}/regenerate")
async def regenerate_product(product_id: str):
    try:
        doc_ref = db.collection("products").document(product_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Product not found")

        product = doc.to_dict()
        # Use the same fields as in add_product
        generated = generate_product_content(
            product.get("title", ""),
            product.get("story", ""),
            product.get("description", ""),
            product.get("artisan_location", ""),
            None,  # image_path not needed for text
            product.get("keywords", []),
            None   # voice_note_path not needed for regen
        )

        # Optionally update Firestore with new content
        doc_ref.update({
            "title": generated["title"],
            "description": generated["description"],
            "backstory": generated["backstory"]
        })

        return {
            "title": generated["title"],
            "description": generated["description"],
            "backstory": generated["backstory"]
        }
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Regeneration failed: {str(e)}")
    
# Update product fields in Firestore by ID
from fastapi import Body

@router.post("/{product_id}/update")
async def update_product(product_id: str, data: dict = Body(...)):
    try:
        doc_ref = db.collection("products").document(product_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Product not found")

        # Only update allowed fields
        update_fields = {}
        for field in ["title", "description", "backstory", "story", "image"]:
            if field in data:
                update_fields[field] = data[field]
        if not update_fields:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        doc_ref.update(update_fields)
        return {"message": "Product updated successfully", "updated": update_fields}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@router.get("/")
async def get_products_by_email(email: str):
    """
    Fetch all products for a given user email (artisan).
    Returns: image, title, description, backstory for each product.
    """
    try:
        # Find artisan_id by email
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", email).limit(1).stream()
        user_doc = None
        for doc in query:
            user_doc = doc
            break
        if not user_doc:
            print(f"[Products] No user found for email: {email}")
            return []
        artisan_id = user_doc.id

        # Query products for this artisan
        products_ref = db.collection("products")
        products_query = products_ref.where("artisan_id", "==", artisan_id).stream()
        products = []
        found_products = False
        for prod in products_query:
            found_products = True
            data = prod.to_dict()
            products.append({
                "id": prod.id,
                "image": data.get("image", ""),
                "title": data.get("title", ""),
                "description": data.get("description", ""),
                "backstory": data.get("backstory", "")
            })
        if not found_products:
            print(f"[Products] No products found for artisan_id: {artisan_id} (email: {email})")
        else:
            print(f"[Products] Found {len(products)} products for artisan_id: {artisan_id} (email: {email})")
        return products
    except Exception as e:
        import traceback
        print(f"[Products] Error fetching products for email {email}: {e}")
        traceback.print_exc()
        return []