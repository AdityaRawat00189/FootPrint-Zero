import os
import logging
from typing import List, Dict, Any
from rag.legal_templates.clauses import LEGAL_KNOWLEDGE_BASE

logger = logging.getLogger("FootprintZero.LegalVectorStore")

class LegalRAGStore:
    def __init__(self, persist_dir: str = "./chroma_db"):
        self.persist_dir = persist_dir
        self.collection = None
        self._init_chroma()
        
    def _init_chroma(self):
        try:
            import chromadb
            from chromadb.utils import embedding_functions
            
            client = chromadb.PersistentClient(path=self.persist_dir)
            # Use default sentence embedding or lightweight embedding function
            emb_fn = embedding_functions.DefaultEmbeddingFunction()
            
            self.collection = client.get_or_create_collection(
                name="privacy_legal_clauses",
                embedding_function=emb_fn
            )
            
            # Check if seeded
            count = self.collection.count()
            if count == 0:
                logger.info(f"Seeding {len(LEGAL_KNOWLEDGE_BASE)} legal clauses into ChromaDB...")
                ids = [doc["id"] for doc in LEGAL_KNOWLEDGE_BASE]
                documents = [f"{doc['title']}\n\n{doc['content']}" for doc in LEGAL_KNOWLEDGE_BASE]
                metadatas = [{"framework": doc["framework"], "title": doc["title"]} for doc in LEGAL_KNOWLEDGE_BASE]
                self.collection.add(ids=ids, documents=documents, metadatas=metadatas)
                logger.info("ChromaDB legal clause seeding complete.")
            else:
                logger.info(f"ChromaDB ready with {count} indexed legal clauses.")
        except Exception as e:
            logger.warning(f"ChromaDB local initialization note: {str(e)}. Direct RAG fallback enabled.")
            self.collection = None

    def retrieve_clauses(self, framework: str = "CCPA", query: str = "deletion opt out broker", top_k: int = 3) -> List[Dict[str, str]]:
        """
        Retrieves top relevant statutory clauses for the target jurisdiction.
        """
        framework = framework.upper() if framework else "CCPA"
        
        # Try ChromaDB query first
        if self.collection:
            try:
                results = self.collection.query(
                    query_texts=[f"{framework} statutory {query}"],
                    n_results=top_k,
                    where={"framework": framework}
                )
                if results and results.get("documents") and results["documents"][0]:
                    clauses = []
                    for idx, doc_text in enumerate(results["documents"][0]):
                        title = results["metadatas"][0][idx].get("title", f"Statutory Clause {idx+1}")
                        clauses.append({"title": title, "content": doc_text})
                    return clauses
            except Exception as e:
                logger.warning(f"ChromaDB query fallback: {str(e)}")
                
        # Direct keyword / framework matching fallback
        matched = [
            {"title": doc["title"], "content": f"{doc['title']}\n\n{doc['content']}"}
            for doc in LEGAL_KNOWLEDGE_BASE
            if doc["framework"] == framework
        ]
        return matched[:top_k] if matched else [
            {"title": "CCPA Cal. Civ. Code § 1798.105", "content": LEGAL_KNOWLEDGE_BASE[0]["content"]}
        ]

_rag_store_instance = None

def get_legal_rag_store() -> LegalRAGStore:
    global _rag_store_instance
    if _rag_store_instance is None:
        persist_dir = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
        _rag_store_instance = LegalRAGStore(persist_dir=persist_dir)
    return _rag_store_instance
