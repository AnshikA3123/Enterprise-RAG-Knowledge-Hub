from pathlib import Path

from sqlalchemy.orm import Session

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class KnowledgeRepository:

    def __init__(self, db: Session):
        self.db = db

    def _format_size(self, size: int) -> str:
        kb = 1024
        mb = kb * 1024

        if size >= mb:
            return f"{size / mb:.2f} MB"

        return f"{size / kb:.2f} KB"

    def get_knowledge_base(self):

        knowledge_path = PROJECT_ROOT / "knowledge_base"

        departments = []
        documents = []

        if not knowledge_path.exists():
            return {
                "departments": [],
                "documents": [],
            }

        supported_extensions = {
            ".pdf": "PDF",
            ".md": "Markdown",
            ".txt": "Text",
        }

        for department in sorted(knowledge_path.iterdir()):

            if not department.is_dir():
                continue

            files = [
                file
                for file in department.iterdir()
                if file.is_file()
                and file.suffix.lower() in supported_extensions
            ]

            departments.append(
                {
                    "name": department.name,
                    "document_count": len(files),
                }
            )

            for file in sorted(files):

                documents.append(
                    {
                        "name": file.name,
                        "department": department.name,
                        "file_type": supported_extensions[file.suffix.lower()],
                        "file_size": self._format_size(file.stat().st_size),
                        "indexed": True,
                    }
                )

        return {
            "departments": departments,
            "documents": documents,
        }