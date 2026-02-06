# Main entry point for the application
# This file allows running uvicorn main:app from the backend directory
from src.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)