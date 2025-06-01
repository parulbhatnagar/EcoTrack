import os
import nltk
import shutil
from pathlib import Path
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from ibm_watson_machine_learning.foundation_models.utils.enums import ModelTypes
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import EmbeddingTypes

nltk.download('averaged_perceptron_tagger_eng', quiet=True)
nltk.download('punkt_tab', quiet=True)

PERSIST_DIR = "./vectorstore_data"

class EnvironmentalSuggestionGenerator:
    def __init__(self, pdf_paths, credentials=None, project_id=None):
        self.pdf_paths = [Path(path) for path in pdf_paths]
        self.credentials = credentials or {
            "url": "https://us-south.ml.cloud.ibm.com",
            "apikey": "MlJwNH1p61gypsRUpRTyz_RB50TrrhTqfC6iofDY-LJa"
        }
        self.project_id = project_id or "1b38f253-5ae2-4a73-b1b2-550d6b32fdd0"
        self.vectorstore = None
        self.retriever = None
        self.llm_chain = None

    def load_and_prepare_documents(self):
        documents = []
        doc_id = 0
        for path in self.pdf_paths:
            if not path.exists():
                print(f"Warning: PDF file not found: {path}")
                continue
            try:
                loader = UnstructuredPDFLoader(str(path))
                data = loader.load()
                for doc in data:
                    doc.page_content = " ".join(doc.page_content.split())
                    doc.metadata["id"] = doc_id
                    documents.append(doc)
                    doc_id += 1
            except Exception as e:
                print(f"Error loading PDF {path}: {str(e)}")
        return documents

    def split_documents(self, documents):
        splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=0)
        return splitter.split_documents(documents)

    def create_or_load_vectorstore(self):
        embeddings = WatsonxEmbeddings(
            model_id=EmbeddingTypes.IBM_SLATE_30M_ENG.value,
            url=self.credentials["url"],
            apikey=self.credentials["apikey"],
            project_id=self.project_id
        )
        if os.path.exists(PERSIST_DIR) and os.listdir(PERSIST_DIR):
            self.vectorstore = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
        else:
            documents = self.load_and_prepare_documents()
            if not documents:
                raise ValueError("No valid documents loaded from provided PDFs.")
            docs = self.split_documents(documents)
            self.vectorstore = Chroma.from_documents(
                documents=docs,
                embedding=embeddings,
                persist_directory=PERSIST_DIR
            )
            self.vectorstore.persist()
        self.retriever = self.vectorstore.as_retriever()

    def initialize_llm_chain(self):
        parameters = {
            GenParams.DECODING_METHOD: 'greedy',
            GenParams.TEMPERATURE: 2,
            GenParams.TOP_P: 0,
            GenParams.TOP_K: 100,
            GenParams.MIN_NEW_TOKENS: 10,
            GenParams.MAX_NEW_TOKENS: 512,
            GenParams.REPETITION_PENALTY: 1.2,
            GenParams.STOP_SEQUENCES: ['B)', '\n'],
            GenParams.RETURN_OPTIONS: {
                'input_tokens': True,
                'generated_tokens': True,
                'token_logprobs': True,
                'token_ranks': True
            }
        }
        llm = WatsonxLLM(
            model_id="ibm/granite-3-8b-instruct",
            url=self.credentials["url"],
            apikey=self.credentials["apikey"],
            project_id=self.project_id,
            params=parameters
        )
        prompt_template = """Generate a summary of the context that answers the question. Explain the answer in multiple steps if possible.
Answer style should match the context. Ideal Answer Length 2-3 sentences.\n\nQuestion: {question}\nAnswer:"""
        prompt = ChatPromptTemplate.from_template(prompt_template)
        def format_docs(docs):
            return "\n\n".join([d.page_content for d in docs])
        self.llm_chain = (
            {"context": self.retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

    def get_suggestion(self, question):
        if self.llm_chain is None:
            raise ValueError("LLM chain is not initialized. Run `run_pipeline()` first.")
        return self.llm_chain.invoke(question)

    def reset_vectorstore(self):
        if os.path.exists(PERSIST_DIR):
            shutil.rmtree(PERSIST_DIR)
            print(f"Vector store at {PERSIST_DIR} cleared.")

    def run_pipeline(self):
        self.create_or_load_vectorstore()
        self.initialize_llm_chain()

if __name__ == "__main__":
    pdf_paths = [
        "./RAGDatasources/SuggestionRAGStaticDataSources/53326-001-eia-en_8.pdf",
        "./RAGDatasources/SuggestionRAGStaticDataSources/BCAP_FullReport_091224.pdf",
        "./RAGDatasources/SuggestionRAGStaticDataSources/metro-paper-empri - converted.pdf",
        "./RAGDatasources/SuggestionRAGStaticDataSources/source_apportionment_study.pdf"
    ]
    question = "What are the key recommendations for reducing urban air pollution?"
    generator = EnvironmentalSuggestionGenerator(pdf_paths)
    generator.run_pipeline()
    result = generator.get_suggestion(question)
    print("Response:", result)