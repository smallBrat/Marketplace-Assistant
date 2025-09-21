import re
import vertexai
from vertexai.generative_models import GenerativeModel, Part

def parse_gemini_output(text: str):
    """Extract Title, Description, Backstory from Gemini response text."""
    title, description, backstory = "", "", ""

    title_match = re.search(r"Title:\s*(.+?)(?=\n[A-Z]|$)", text, re.DOTALL | re.IGNORECASE)
    description_match = re.search(r"Description:\s*(.+?)(?=\n[A-Z]|$)", text, re.DOTALL | re.IGNORECASE)
    backstory_match = re.search(r"Backstory:\s*(.+)", text, re.DOTALL | re.IGNORECASE)

    if title_match:
        title = title_match.group(1).strip()
    if description_match:
        description = description_match.group(1).strip()
    if backstory_match:
        backstory = backstory_match.group(1).strip()

    return title, description, backstory


# Initialize Vertex AI
vertexai.init(project="gen-ai-exchange-470314", location="us-central1")

# Load Gemini text model
model = GenerativeModel("gemini-2.0-flash-lite")


def clean_description(desc: str) -> str:
    """Fix repetitive phrasing in description."""
    if not desc:
        return desc

    # Remove "This eco-friendly piece... This traditional design..."
    desc = desc.replace("This eco-friendly piece", "An eco-friendly piece")
    desc = desc.replace("This traditional design", "The traditional design")

    # Prevent too many "This ..." starts
    sentences = desc.split(". ")
    cleaned = []
    for i, s in enumerate(sentences):
        if i > 0 and s.strip().startswith("This "):
            s = s.replace("This ", "", 1).capitalize()
        cleaned.append(s)
    return ". ".join(cleaned).strip()


def ensure_location(backstory: str, artisan_location: str) -> str:
    """Force backstory to use the actual artisan_location instead of hallucinations."""
    if not artisan_location:
        return backstory  # nothing to enforce

    # Replace any 'in XYZ' or 'from XYZ' with real artisan_location
    backstory = re.sub(
        r"(in|from)\s+[A-Z][a-zA-Z]+(?:,\s*[A-Z][a-zA-Z]+)?",
        f"in {artisan_location}",
        backstory
    )

    # If still missing, append at end
    if artisan_location.lower() not in backstory.lower():
        backstory += f"\n\nThis product is lovingly made in {artisan_location}."
    return backstory


def generate_product_content(
    title: str,
    story: str,
    description: str,
    artisan_location: str,
    image_path: str = None,  # ignored here
    keywords: list = None,
    voice_note_path: str = None
):
    prompt = f"""
You are assisting local artisans in selling their handmade crafts.

IMPORTANT: Always use the provided Artisan Location ("{artisan_location}") exactly as given. Do not invent or replace it with other locations. If it is empty, simply omit the location.

Provided product details:
- Current Title: {title}
- Existing Description: {description}
- Raw Story: {story}
- Artisan Location: {artisan_location}
- Keywords to include: {', '.join(keywords or [])}

Task:
1. Suggest a better, polished product title (max 6 words) — include some of the keywords if possible.
2. Write an engaging, customer-friendly description (2–3 sentences) — naturally weave in the keywords.
3. Write a cultural backstory for the product, including:
   - Likely raw materials used
   - Traditional techniques
   - A touch of local culture that must explicitly include the artisan’s location (“{artisan_location}”).
   - Keep it warm, authentic, and persuasive

Output format:
Title: <title>
Description: <description>
Backstory: <backstory>
"""

    try:
        parts = [Part.from_text(prompt)]

        if voice_note_path:
            ext = voice_note_path.lower()
            mime_type = "audio/mpeg" if ext.endswith(".mp3") else "audio/webm"
            parts.append(Part.from_file(mime_type=mime_type, path=voice_note_path))

        response = model.generate_content(parts)
        text = response.text.strip()

        new_title, new_description, backstory = parse_gemini_output(text)

        # Clean description
        new_description = clean_description(new_description or description or story)

        # Ensure artisan location is included
        backstory = ensure_location(backstory or story, artisan_location)

        return {
            "title": new_title or title,
            "description": new_description,
            "backstory": backstory
        }
    except Exception as e:
        print("⚠️ Vertex AI failed:", e)
        return {
            "title": title,
            "description": description or story,
            "backstory": story
        }
