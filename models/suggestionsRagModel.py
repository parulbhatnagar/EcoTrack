import os
import getpass

from ibm_watson_machine_learning.foundation_models.utils.enums import ModelTypes
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import EmbeddingTypes

from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain_community.vectorstores import Chroma

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from langchain_community.document_loaders import UnstructuredURLLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai import Credentials

import nltk
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('punkt_tab')

class EnvironmentalSuggestionGenerator:
    def __init__(self, urls_dictionary):
        self.urls = list(urls_dictionary.values())
        self.credentials = {
            "url": "https://us-south.ml.cloud.ibm.com",
            "apikey": "MlJwNH1p61gypsRUpRTyz_RB50TrrhTqfC6iofDY-LJa"
        }
        self.project_id = "1b38f253-5ae2-4a73-b1b2-550d6b32fdd0"
        self.documents = []
        self.vectorstore = None
        self.retriever = None
        self.llm_chain = None

    def load_and_prepare_documents(self):
        doc_id = 0
        for url in self.urls:
            loader = UnstructuredURLLoader(urls=[url])
            data = loader.load()
            for doc in data:
                doc.page_content = " ".join(doc.page_content.split())
                doc.metadata["id"] = doc_id
                self.documents.append(doc)
                doc_id += 1

    def split_documents(self):
        splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=0)
        return splitter.split_documents(self.documents)

    def create_vectorstore(self, docs):
        embeddings = WatsonxEmbeddings(
            model_id=EmbeddingTypes.IBM_SLATE_30M_ENG.value,
            url=self.credentials["url"],
            apikey=self.credentials["apikey"],
            project_id=self.project_id
        )
        self.vectorstore = Chroma.from_documents(documents=docs, embedding=embeddings)
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
Answer style should match the context. Ideal Answer Length 2-3 sentences.\n\nQuestion:question\nAnswer:\nQuestion: {question}\nAnswer:\nQuestion:question\nAnswer:"""

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

    def run_pipeline(self):
        self.load_and_prepare_documents()
        docs = self.split_documents()
        self.create_vectorstore(docs)
        self.initialize_llm_chain()
