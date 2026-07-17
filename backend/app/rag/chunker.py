"""
chunker.py

Converts loaded documents into smaller chunks for better retrieval.
"""

from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.rag.document import Document


class DocumentChunker:

    def __init__(
        self,
        chunk_size: int = 600,
        chunk_overlap: int = 100,
    ):
        """
        chunk_size:
            Maximum characters inside one chunk.

        chunk_overlap:
            Overlapping characters between consecutive chunks.
        """

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def split_documents(self, documents: list[Document]) -> list[Document]:

        chunked_documents = []

        for document in documents:

            chunks = self.text_splitter.split_text(
                document.page_content
            )

            for chunk in chunks:

                chunked_documents.append(

                    Document(

                        page_content=chunk,

                        metadata=document.metadata.copy()

                    )

                )

        print(f"\nGenerated {len(chunked_documents)} chunks.\n")

        return chunked_documents