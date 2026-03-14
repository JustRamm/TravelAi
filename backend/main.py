import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Initialize Environmental Context
load_dotenv()

from api.router import router

def create_application() -> FastAPI:
    """
    Factory to construct the FastAPI service instance.
    Configures core middleware and attaches logic routes.
    """
    app = FastAPI(
        title="Travel Architect Core",
        description="Bespoke journey engineering interface."
    )

    # Cross-Origin Policies - Hardened for Industrial Performance
    # Note: allow_origins=["*"] and allow_credentials=True are mutually exclusive
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"]
    )

    app.include_router(router)
    return app

server = create_application()

if __name__ == "__main__":
    # Booting industrial-grade ASGI server
    uvicorn.run(
        "main:server", 
        host="0.0.0.0", 
        port=8000, 
        reload=False
    )
