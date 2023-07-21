from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi_sqlalchemy import DBSessionMiddleware, db

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from models import DictionaryWord, Base

app = FastAPI()

# Configure database
SQLALCHEMY_DATABASE_URL = "sqlite:///./dictionary.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Register middleware
app.add_middleware(DBSessionMiddleware, db_url=SQLALCHEMY_DATABASE_URL)

# Configure templates
templates = Jinja2Templates(directory="templates")

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from typing import List

# Mount static files (for CSS and JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Home page to list words in alphabetical order
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    words = db.session.query(DictionaryWord).order_by(DictionaryWord.word).all()
    return templates.TemplateResponse("home.html", {"request": request, "words": words})

# Search for words starting with the search input
@app.get("/search/", response_model=List[str])
def search_word(prefix: str):
    words = db.session.query(DictionaryWord.word).filter(DictionaryWord.word.startswith(prefix)).all()
    return [word[0] for word in words]

# Page with the definition of a word
@app.get("/word/{word}", response_class=HTMLResponse)
def word_definition(request: Request, word: str):
    word_entry = db.session.query(DictionaryWord).filter_by(word=word).first()
    if not word_entry:
        raise HTTPException(status_code=404, detail="Word not found.")
    return templates.TemplateResponse("word.html", {"request": request, "word_entry": word_entry})

# Add a word and its definition
@app.post("/add/")
def add_word(word: str = Form(...), definition: str = Form(...)):
    word_entry = DictionaryWord(word=word, definition=definition)
    db.session.add(word_entry)
    db.session.commit()
    return {"message": "Word added successfully."}

# Upload a file related to a word (not fully implemented in this example)
@app.post("/upload/")
def upload_file(word: str = Form(...), file: UploadFile = File(...)):
    # Implement file handling and storage here
    return {"message": "File uploaded successfully."}

