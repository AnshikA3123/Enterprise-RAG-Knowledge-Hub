from pathlib import Path

from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker
from app.rag.embeddings import EmbeddingGenerator
from app.rag.vector_store import VectorStore


# ---------------------------------------------------
# Project Paths
# ---------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

KNOWLEDGE_BASE = PROJECT_ROOT / "knowledge_base"


# ---------------------------------------------------
# STEP 1 : Load Documents
# ---------------------------------------------------

print("\nLoading Documents...\n")

loader = DocumentLoader(KNOWLEDGE_BASE)

documents = loader.load_documents()


# ---------------------------------------------------
# STEP 2 : Chunk Documents
# ---------------------------------------------------

print("\nChunking Documents...\n")

chunker = DocumentChunker()

chunks = chunker.split_documents(documents)


# ---------------------------------------------------
# STEP 3 : Generate Embeddings
# ---------------------------------------------------

print("\nGenerating Embeddings...\n")

embedding_generator = EmbeddingGenerator()

embedded_documents = embedding_generator.generate_embeddings(
    chunks
)


# ---------------------------------------------------
# STEP 4 : Store inside Qdrant
# ---------------------------------------------------

print("\nConnecting to Qdrant...\n")

vector_store = VectorStore()

vector_store.create_collection()

vector_store.upload_documents(
    embedded_documents
)


# ---------------------------------------------------
# Finished
# ---------------------------------------------------

print()

print("=" * 70)

print("DOCUMENT INGESTION COMPLETED SUCCESSFULLY")

print("=" * 70)

print()

print(f"Documents Loaded : {len(documents)}")

print(f"Chunks Created : {len(chunks)}")

print(f"Vectors Stored : {len(embedded_documents)}")

print()

print("Knowledge Base Successfully Indexed into Qdrant.")

print()