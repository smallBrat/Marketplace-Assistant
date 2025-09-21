# services/gemini_image_service.py
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os
import uuid

# --- Configure Gemini API ---
GEMINI_API_KEY = "AIzaSyCtuuXKoF5Mu3u2AnDEsBsRiylLZCY8NY4"
client = genai.Client(api_key=GEMINI_API_KEY)

# Folder to save enhanced images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def enhance_product_image(image_path: str) -> str:
    """
    Send product image to Gemini 2.5 Flash Image Preview model.
    Save the enhanced image and return the new file path.
    """
    prompt = "Make this image look professional for an e-commerce website selling artisan products."

    try:
        print(f"[Gemini] Enhancing image: {image_path}")
        img = Image.open(image_path)

        response = client.models.generate_content(
            model="gemini-2.5-flash-image-preview",
            contents=[prompt, img],
        )

        # Debug: log full response
        print(f"[Gemini] Raw response: {response}")

        if not hasattr(response, 'candidates') or not response.candidates:
            print("[Gemini] No candidates in response. API may not have been called.")
            raise RuntimeError("Gemini API did not return candidates.")

        for part in response.candidates[0].content.parts:
            if hasattr(part, 'inline_data') and part.inline_data is not None:
                enhanced_img = Image.open(BytesIO(part.inline_data.data))
                new_filename = f"{uuid.uuid4()}_enhanced.png"
                new_path = os.path.join(UPLOAD_DIR, new_filename)
                enhanced_img.save(new_path)
                print(f"[Gemini] Enhancement successful. Saved: {new_path}")
                return new_path

        print("[Gemini] No enhanced image returned by Gemini. Returning original image.")
        raise RuntimeError("Gemini API did not return enhanced image data.")

    except Exception as e:
        print(f"⚠️ Gemini API image enhancement failed: {e}")
        return image_path
