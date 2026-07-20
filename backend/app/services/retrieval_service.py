from app.rag.retriever import Retriever
from app.rag.prompt_builder import PromptBuilder
from app.llm.llm_manager import LLMManager


class RetrievalService:

    def __init__(self):

        self.retriever = Retriever()

        # Enterprise LLM Manager
        self.llm = LLMManager()

    def ask(
        self,
        question: str,
        conversation_history: str = ""
    ):

        # Retrieve top documents
        results = self.retriever.search(question)

        # Build Prompt
        prompt = PromptBuilder.build(
            question=question,
            retrieved_chunks=results,
            conversation_history=conversation_history,
        )

        # Generate answer using Enterprise LLM Manager
        answer = self.llm.generate(prompt)

        # ------------------------
        # Extract Sources
        # ------------------------

        sources = []

        seen = set()

        for chunk in results:

            file = chunk.payload["source"]

            page = chunk.payload["page"]

            key = (file, page)

            if key not in seen:

                seen.add(key)

                sources.append({
                    "file": file,
                    "page": page
                })

        return {
            "answer": answer,
            "sources": sources
        }