from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from cryptography.fernet import Fernet
import base64
import os

app = FastAPI()

# Allow CORS from React frontend during development
origins = [
    "http://localhost:3000",  # frontend dev server
    "https://stealth-crypt.vercel.app",  # backend server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === API ENDPOINTS ===

@app.post("/encrypt")
async def encrypt_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        key = Fernet.generate_key()
        fernet = Fernet(key)
        encrypted = fernet.encrypt(contents)

        encrypted_b64 = base64.b64encode(encrypted).decode('utf-8')
        key_str = key.decode('utf-8')

        return JSONResponse(content={"encrypted_file": encrypted_b64, "key": key_str})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Encryption error: {e}")

@app.post("/decrypt")
async def decrypt_file(file: UploadFile = File(...), key: str = Form(...)):
    try:
        contents = await file.read()
        fernet = Fernet(key.encode('utf-8'))
        decrypted = fernet.decrypt(contents)

        decrypted_b64 = base64.b64encode(decrypted).decode('utf-8')

        return JSONResponse(content={"decrypted_file": decrypted_b64})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Decryption error: {e}")

# === FRONTEND SETUP ===

# Path to React build
frontend_path = os.path.join(os.path.dirname(__file__), "build")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
