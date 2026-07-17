from sentence_transformers import SentenceTransformer

from app.rag.vector_store import VectorStore


class Retriever:

    def __init__(self):

        self.vector_store = VectorStore()

        self.model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

    def search(self, question: str, limit: int = 5):

        query_embedding = self.model.encode(
            question,
            normalize_embeddings=True,
        ).tolist()

        results = self.vector_store.client.query_points(
            collection_name=self.vector_store.COLLECTION_NAME,
            query=query_embedding,
            limit=limit,
        )

        return results.points