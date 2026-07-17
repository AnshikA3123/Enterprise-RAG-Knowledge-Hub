from pathlib import Path
from pypdf import PdfReader

from app.rag.document import Document


class DocumentLoader:

    def __init__(self, knowledge_base_path: str):

        self.knowledge_base = Path(knowledge_base_path)

    def load_documents(self):

        documents = []

        # Load both PDF and Markdown files
        knowledge_files = list(self.knowledge_base.rglob("*.pdf"))
        knowledge_files.extend(list(self.knowledge_base.rglob("*.md")))

        print(f"\nFound {len(knowledge_files)} knowledge files\n")

        for file in knowledge_files:

            print(f"Loading -> {file.name}")

            category = file.parent.name

            # -----------------------------------------
            # PDF Files
            # -----------------------------------------
            if file.suffix.lower() == ".pdf":

                reader = PdfReader(str(file))

                for page_number, page in enumerate(reader.pages):

                    text = page.extract_text()

                    if text is None:
                        text = ""

                    document = Document(

                        page_content=text,

                        metadata={

                            "source": file.name,

                            "page": page_number + 1,

                            "category": category

                        }

                    )

                    documents.append(document)

            # -----------------------------------------
            # Markdown Files
            # -----------------------------------------
            elif file.suffix.lower() == ".md":

                text = file.read_text(
                    encoding="utf-8",
                    errors="ignore"
                )

                document = Document(

                    page_content=text,

                    metadata={

                        "source": file.name,

                        "page": 1,

                        "category": category

                    }

                )

                documents.append(document)

        print(f"\nLoaded {len(documents)} documents\n")

        return documents