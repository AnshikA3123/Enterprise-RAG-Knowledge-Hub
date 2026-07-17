"""
embeddings.py

Generates embeddings for every document chunk.
"""

from sentence_transformers import SentenceTransformer

from app.rag.document import Document


class EmbeddingGenerator:

    def __init__(self):

        print("\nLoading Embedding Model...\n")

        self.model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

        print("Embedding Model Loaded Successfully.\n")

    def generate_embedding(self, text: str):

        return self.model.encode(
            text,
            normalize_embeddings=True
        ).tolist()

    def generate_embeddings(
        self,
        documents: list[Document]
    ) -> list[Document]:

        print("Generating Embeddings...\n")

        BATCH_SIZE = 64

        total = len(documents)

        for start in range(0, total, BATCH_SIZE):

            end = min(start + BATCH_SIZE, total)

            batch = documents[start:end]

            texts = [
                doc.page_content
                for doc in batch
            ]

            embeddings = self.model.encode(
                texts,
                batch_size=32,
                normalize_embeddings=True,
                show_progress_bar=False
            )

            for doc, embedding in zip(batch, embeddings):

                doc.embedding = embedding.tolist()

            print(f"Embedded {end}/{total}")

        print("\nEmbeddings Generated Successfully.\n")

        return documents