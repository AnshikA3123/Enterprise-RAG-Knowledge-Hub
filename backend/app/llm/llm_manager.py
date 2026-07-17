import time

from app.llm.gemini_client import GeminiClient
from app.llm.groq_client import GroqClient


class LLMManager:

    def __init__(self):

        self.gemini = GeminiClient()
        self.groq = GroqClient()

    def generate(self, prompt: str):

        providers = [
            ("Gemini", self.gemini),
            ("Groq", self.groq),
        ]

        last_error = None

        for name, provider in providers:

            # Retry each provider 3 times
            for attempt in range(3):

                try:

                    print(f"Using {name} (Attempt {attempt + 1})")

                    response = provider.generate(prompt)

                    if response:
                        print(f"{name} Success")
                        return response

                except Exception as e:

                    print(f"{name} Failed (Attempt {attempt + 1})")

                    print(e)

                    last_error = e

                    time.sleep(1)

            print(f"Switching from {name} to next provider...")

        raise Exception(
            f"All LLM providers failed.\n{last_error}"
        )