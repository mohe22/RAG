# 🧠 Local RAG Application

A fully local Retrieval-Augmented Generation (RAG) system using **FastAPI**, **ChromaDB**, and **Ollama**. This app lets you upload documents (PDF, CSV, JSON, URLs) and chat with them using **LLaMA 3** — all without any API keys or cloud services.

---

## 🔍 What Is This?

This project demonstrates how RAG (Retrieval-Augmented Generation) works in practice. You can ingest a file or webpage, ask questions about it, and get context-aware responses generated locally by a language model.

It loads, splits, embeds, and stores your documents using `nomic-embed-text`, and retrieves relevant parts at query time to answer using `llama3`.

👉 **Full Blog with Technical Walkthrough:**  
[https://portfolio-three-alpha-27.vercel.app/Blogs/rag-system](https://portfolio-three-alpha-27.vercel.app/Blogs/rag-system)

---

## ⚙️ Prerequisites

- **Python 3.10+**
- **Node.js + npm** (for the frontend)
- **Ollama** installed and running
- Sufficient RAM/CPU (LLaMA 3 is resource-intensive)

---
---

## 📝 TODO
- [ ] Integrate advanced Ollama tooling  
  👉 [Ollama Tooling Blog](https://ollama.com/blog/tool-support)
- [ ] Export chat history with source references


## 🦙 Installing Ollama

Ollama is required to run LLaMA 3 and the embedding model locally.

### 1. Download and Install

Visit: [https://ollama.com/download](https://ollama.com/download)  
Install Ollama for your OS (macOS, Windows, Linux).

### 2. Pull Required Models

Run the following in terminal:

```bash
ollama pull llama3
ollama pull nomic-embed-text
```

---

## 🛠️ Backend Installation (FastAPI)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rag-app.git
cd rag-app
```

### 2. Set up Python virtual environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the backend server

```bash
uvicorn main:app --reload

```

Visit:  
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 💻 Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

The frontend should now be running at:  
[http://localhost:3000](http://localhost:3000)

---

## Learn More

To understand how this project works under the hood, including embeddings, document splitting, and context-aware generation:

👉 [Read the full guide](https://portfolio-three-alpha-27.vercel.app/Blogs/rag-system)
