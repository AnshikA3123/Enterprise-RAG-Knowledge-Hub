from dataclasses import dataclass, field
from typing import Any


@dataclass
class Document:
    """
    Represents one chunk of text in our RAG pipeline.
    """

    page_content: str

    metadata: dict[str, Any] = field(default_factory=dict)

    embedding: list[float] | None = None