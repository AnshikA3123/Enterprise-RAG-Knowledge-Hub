import os

from dotenv import load_dotenv




load_dotenv()
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.rag.document import Document


class VectorStore:

    COLLECTION_NAME = "enterprise_knowledge"

    def __init__(self):
        self.client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

    def create_collection(self):

        collections = self.client.get_collections().collections

        names = [c.name for c in collections]

        # Delete old collection if it exists
        if self.COLLECTION_NAME in names:

            print("Deleting Existing Collection...")

            self.client.delete_collection(
                collection_name=self.COLLECTION_NAME
            )

        print("Creating New Collection...")

        self.client.create_collection(
            collection_name=self.COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE,
            ),
        )

        print("Collection Created Successfully")

    def upload_documents(self, documents: list[Document]):

        print("Uploading Vectors to Qdrant...\n")

        BATCH_SIZE = 50

        total = len(documents)

        for start in range(0, total, BATCH_SIZE):

            end = min(start + BATCH_SIZE, total)

            points = []

            for idx in range(start, end):

                doc = documents[idx]

                points.append(
                    PointStruct(
                        id=idx,
                        vector=doc.embedding,
                        payload={
                            "text": doc.page_content,
                            "source": doc.metadata["source"],
                            "page": doc.metadata["page"],
                            "category": doc.metadata["category"],
                        },
                    )
                )

            self.client.upsert(
    collection_name=self.COLLECTION_NAME,
    points=points,
    wait=False,
)

            print(f"Uploaded {end}/{total} vectors")

        print("\nAll vectors uploaded successfully.\n")