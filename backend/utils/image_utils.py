# backend/utils/image_utils.py
import base64
import io
import uuid
from PIL import Image, ImageEnhance
from firebase_admin import storage

# Upload enhanced image to Firebase Storage
def process_and_upload_image(base64_str: str, folder: str = "products") -> str:
    try:
        # Decode base64
        image_data = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # ---- Basic Enhancement ----
        # Brightness
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)

        # Contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.15)

        # Sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.1)

        # Save image temporarily
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        buffer.seek(0)

        # Unique filename
        file_name = f"{folder}/{uuid.uuid4().hex}.jpg"

        # Upload to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(file_name)
        blob.upload_from_file(buffer, content_type="image/jpeg")
        blob.make_public()  # make file publicly accessible

        return blob.public_url

    except Exception as e:
        print("Image upload failed:", str(e))
        return None
