from app.rag.retriever import Retriever
from app.rag.prompt_builder import PromptBuilder
from app.rag.gemini_client import GeminiClient


question = input("Ask your question: ")


retriever = Retriever()

results = retriever.search(question)


prompt = PromptBuilder.build(
    question,
    results
)


gemini = GeminiClient()

answer = gemini.generate(prompt)


print()

print("=" * 80)

print("QUESTION")

print("=" * 80)

print(question)

print()

print("=" * 80)

print("ANSWER")

print("=" * 80)

print(answer)