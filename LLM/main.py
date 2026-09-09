from typing import Optional
from enum import Enum
from pydantic import BaseModel
from fastapi import UploadFile, File
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from os import listdir
import shutil
from typing import List, Literal
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
ollama_bearer_token = os.getenv("OLLAMA_API_KEY", "")
llm_reasoning_gpt_oss = ChatOllama(
    model="gpt-oss:120b:cloud",
    base_url="https://api.ollama.com",  # correct cloud API endpoint
    client_kwargs={
        "headers": {
            "Authorization": "Bearer " + ollama_bearer_token
        }
    }
)

app = FastAPI(title="LLM-Chat", version="1.0.0", description="RAG API")

origins = [
    "http://localhost",
    "http://localhost:4200",
    "http://0.0.0.0:8080",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


@app.post("/chat")
def chat(req: ChatRequest):
    if not req.messages:
        return {"reply": ""}

    # Convert the ENTIRE conversation into LangChain message objects
    # so the model actually sees the full history, not just the latest turn
    langchain_messages = []
    for m in req.messages:
        if m.role == "user":
            langchain_messages.append(HumanMessage(content=m.content))
        elif m.role == "assistant":
            langchain_messages.append(AIMessage(content=m.content))

    response = llm_reasoning_gpt_oss.invoke(langchain_messages)

    # response is an AIMessage object — extract just the text content
    reply_text = response.content

    return {"reply": reply_text}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)