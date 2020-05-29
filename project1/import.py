import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import time
import csv

if not os.getenv("DATABASE_URL"):
    try:
        os.environ["DATABASE_URL"] = "postgres://bdwvnbqsiiaqkr:0837da1baef09ce34b5f3fab77d457b12e84690c3aa3354c65ca86df7cabb06b@ec2-35-168-54-239.compute-1.amazonaws.com:5432/d1g1mrs1o2a0t3"
    except Exception:
        raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

def create_users():
    try:
        db.execute("""CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(30) NOT NULL,
            password VARCHAR(100) NOT NULL
        )""")
        db.commit()
    except Exception as e:
        print("User table already created")


def create_books():
    try:
        db.execute("""CREATE TABLE books(
            id SERIAL PRIMARY KEY,
            isbn VARCHAR(20) NOT NULL,
            title VARCHAR(100) NOT NULL,
            author VARCHAR(100) NOT NULL,
            year VARCHAR(7) NOT NULL
        )""")
        db.commit()
    except Exception as e:
        print("Books table already created")


def create_ratings():
    try:
        db.execute("""CREATE TABLE ratings(
            id SERIAL PRIMARY KEY,
            rating NUMERIC(1)  NOT NULL,
            text VARCHAR(500) NOT NULL,
            users_id SERIAL NOT NULL,
            books_id SERIAL NOT NULL,
            date DATE NOT NULL,
            FOREIGN KEY (users_id) REFERENCES users(id),
            FOREIGN KEY (books_id) REFERENCES books(id)
        )""")
        db.commit()
    except Exception as e:
        print("Ratings table already created")


def insert():
    books = db.execute("SELECT * FROM books").fetchall()
    if len(books) > 0:
        db.execute("DELETE FROM books")
        db.commit()
    with open('books.csv', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            isbn = row.get("isbn")
            title = row.get("title")
            author = row.get("author")
            year = row.get("year")
            db.execute("""
                INSERT INTO books
                (isbn, title, author, year)
                VALUES (:isbn, :title, :author, :year)""",
                {"isbn":isbn, "title":title, "author":author, "year":year}
            )
    db.commit()


if __name__ == '__main__':
    insert()
