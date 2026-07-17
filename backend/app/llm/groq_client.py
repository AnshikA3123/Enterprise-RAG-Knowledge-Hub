import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()


class GroqClient:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise Exception("GROQ_API_KEY not found")

        self.client = Groq(api_key=api_key)

        # Read model from .env
        self.model = os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        )

    def generate(self, prompt: str):

        try:

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
            )

            return response.choices[0].message.content

        except Exception as e:

            print(f"Groq Error: {e}")

            raise e