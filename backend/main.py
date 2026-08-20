# FastAPI Main Application Entry Point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.api import router as api_router

app = FastAPI(
    title="Universal Algorithm Visualizer API",
    description="Python FastAPI backend powering DSA step generation, benchmarks, and custom code execution.",
    version="1.0.0"
)

# CORS configuration allowing JS frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Universal Algorithm Visualizer Python Backend",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
