from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from utils.dependencies import get_current_user

# 🔐 Auth
from routes.auth import router as auth_router

# 📚 Feature routes (unchanged)
from routes.study_plan import router as study_router
from routes.quiz import router as quiz_router
from routes.progress import router as progress_router
from routes import explain
from routes import resources
from routes import notes
from routes import saved_content
from models import study_plan
from models import plan_progress

app = FastAPI(
    title="EduMentor AI",
    version="0.1.0",
    openapi_version="3.1.0"
)

# 🌐 CORS (frontend safe)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# 🚏 Routers (NO LOGIC CHANGED)
app.include_router(study_router)
app.include_router(quiz_router, prefix="/quiz", tags=["Quiz"])
app.include_router(progress_router, prefix="/progress", tags=["Progress"])
app.include_router(explain.router, tags=["AI Explain"])
app.include_router(resources.router, tags=["Resources"])
app.include_router(notes.router, tags=["Notes"])
app.include_router(saved_content.router, prefix="/saved", tags=["Saved Content"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])


# 🏠 Root
@app.get("/", tags=["Root"])
def root():
    return {"message": "EduMentor AI backend running 🚀"}

@app.get("/me")
def read_me(user_id: str = Depends(get_current_user)):
    return {"user_id": user_id}
