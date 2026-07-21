from sentence_transformers import SentenceTransformer

from app.rag.vector_store import VectorStore


class Retriever:

    def __init__(self):

        self.vector_store = VectorStore()

        # Lazy loading (prevents loading at server startup)
        self.model = None

    def _get_model(self):

        if self.model is None:

            print("\nLoading Embedding Model...\n")

            self.model = SentenceTransformer(
                "BAAI/bge-small-en-v1.5"
            )

            print("Embedding Model Loaded Successfully.\n")

        return self.model

    def search(self, question: str, limit: int = 5):

        model = self._get_model()

        query_embedding = model.encode(
            question,
            normalize_embeddings=True,
        ).tolist()

        results = self.vector_store.client.query_points(
            collection_name=self.vector_store.COLLECTION_NAME,
            query=query_embedding,
            limit=limit,
        )

        return results.points