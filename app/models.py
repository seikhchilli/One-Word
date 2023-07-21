from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DictionaryWord(Base):
    __tablename__ = "dictionary"
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(50), unique=True, index=True)
    definition = Column(String(500))
