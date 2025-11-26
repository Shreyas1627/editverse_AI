# backend/app/services/prompt_parser.py
import json
from openai import OpenAI
from backend.app.core.config import settings

# 1. Initialize Client
client = OpenAI(
    base_url=settings.SAMBANOVA_BASE_URL,
    api_key=settings.SAMBANOVA_API_KEY,
)

def parse_prompt(prompt_text: str) -> dict:
    """
    Uses Llama 3.1 (via SambaNova) to convert natural language into structured JSON actions.
    """
    print(f"🧠 [AI] Thinking about prompt: {prompt_text}")

    # 2. Define System Instructions
    system_instructions = """
    You are a video editing assistant. Your job is to translate user requests into a strict JSON format.
    
    OUTPUT FORMAT:
    You must return a JSON object with a key "actions", which is a list of actions.
    Example: {"actions": [{"type": "trim", "start": 0, "end": 10}, {"type": "speed", "value": 1.5}]}

    AVAILABLE ACTIONS:
    1. type: "trim" -> requires "start" (float), "end" (float)
    2. type: "speed" -> requires "value" (float, e.g., 0.5 for slow, 2.0 for fast)
    3. type: "filter" -> requires "name" (string, e.g., "grayscale")
    4. type: "add_text" -> requires "content" (string)

    RULES:
    - If the user mentions "funny" or "viral", assume they want 1.5x speed.
    - If the user mentions "sad" or "cinematic", assume they want 0.8x speed and grayscale.
    - Return ONLY raw JSON. No markdown formatting.
    """

    try:
        # 3. Call the API
        response = client.chat.completions.create(
            model=settings.SAMBANOVA_MODEL,
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0.1, # Low temperature for consistency
        )

        # 4. Parse Response
        content = response.choices[0].message.content.strip()
        print(f"🤖 [AI] Raw Response: {content}")
        
        # Clean up markdown if present
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "")
        
        return json.loads(content)

    except Exception as e:
        print(f"❌ [AI] Error: {e}")
        return {"actions": []}