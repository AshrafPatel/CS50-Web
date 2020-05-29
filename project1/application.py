import os
import requests
from flask import Flask, session, render_template, request, redirect, url_for, abort, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from passlib.hash import pbkdf2_sha256
from datetime import datetime

def resultproxy_to_dict_list(resultproxy):
    d, a = {}, []
    for rowproxy in resultproxy:
        # rowproxy.items() returns an array like [(key0, value0), (key1, value1)]
        for column, value in rowproxy.items():
            # build up the dictionary
            d = {**d, **{column: value}}
        a.append(d)
    return a


app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    try:
        os.environ["DATABASE_URL"] = ""
    except Exception:
        raise RuntimeError("DATABASE_URL is not set")

if not os.getenv("KEY"):
    try:
        os.environ["KEY"] = ""
    except Exception:
        raise RuntimeError("API_KEY is not set")


# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


# @app.route("/")
# def hom():
#     if session.get("user_id") is None:
#         return render_template("error.html", message="We provide reviews for all books", headline="Welcome to GoodBooks")
#     else:
#         return render_template("home.html", logged=True)


@app.route("/")
def index():
    if session.get("user_id") is None:
        return redirect(url_for("login"))
    else:
        session["user_id"] = session.get("user_id")
        return render_template("home.html", logged=True)


@app.route('/register', methods=["GET", "POST"])
def register():
    session.clear()
    if request.method == "GET":
        message = "Register"
        return render_template("register.html", message=message)
    elif request.method == "POST":
        username = request.form.get("email")
        password = request.form.get("password")
        result = resultproxy_to_dict_list(db.execute("SELECT * FROM users WHERE username = :username", {"username":username}).fetchall())
        
        if len(result) > 0:
            print(result)
            return render_template("error.html", message="Account already exists", headline="Error")
        else:
            password = pbkdf2_sha256.hash(password)
            db.execute("INSERT INTO users (username, password) VALUES (:username, :password)", {"username":username, "password":password})
            db.commit()
            user_id = db.execute("SELECT id FROM users WHERE username=:username", {"username":username}).fetchone()
            session["user_id"] = user_id[0]
            session.permanent = True
            return render_template("error.html", message="Your account has been successfully created", headline="Account created", logged=True)


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == "GET":
        message = "Login"
        return render_template("login.html", message=message)
    elif request.method == "POST":
        username = request.form.get("email")
        password = request.form.get("password")
        result = resultproxy_to_dict_list(db.execute("SELECT * FROM users WHERE username=:username", {"username":username}).fetchall())
        
        if result == []:
            print(result)
            return render_template("error.html", message="Could not login, please try again", headline="Error")
        else:
            user_password = result[0].get("password")
            if not pbkdf2_sha256.verify(password, user_password):
                print(result)
                return render_template("error.html", message="Could not login, please try again", headline="Error")
            else:
                session["user_id"] = result[0].get("id")
                return redirect("/")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")
            

@app.route("/books", methods=["GET", "POST"])
def books():
    if session["user_id"] is not None:
        if request.method=="POST":
            query = request.form.get("search")
            query_arr = []
            query_string = """SELECT * FROM books WHERE
                                    isbn LIKE :query OR
                                    title LIKE :query OR
                                    author LIKE :query OR 
                                    year LIKE :query"""
            bookresults = resultproxy_to_dict_list(db.execute(query_string, {"query": f"%{query}%"}).fetchall())
            if len(bookresults) <= 0:
                return render_template("error.html", message="No books found, please try again", headline="Error", logged=True)
            else:
                for book in bookresults:
                    isbn = book.get("isbn")
                    res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": os.getenv("KEY"), "isbns": isbn}).json()
                    res = res.get("books")
                    book['work_ratings_count'] = res[0].get("work_ratings_count")
                    average_rating = res[0].get("average_rating")
                    average_rating = str(int(float(average_rating)))
                    book['average_rating'] = average_rating
                return render_template("books.html", bookresults=bookresults, logged=True)
        elif request.method=="GET":
            return render_template("error.html", message="No books found, please try again", headline="Error", logged=True)
    else:
        return redirect(url_for("login"))


@app.route('/books/<int:book_id>', methods=["GET", "POST"])
def getbook(book_id):
    if session["user_id"] is not None:
        user_id = session.get("user_id")
        book = resultproxy_to_dict_list(db.execute("SELECT * FROM books WHERE id=:book_id", {"book_id":book_id}).fetchall())
        if request.method=="GET":
            no_reviews = False
            if len(book) <= 0:
                return render_template("error.html", message="Book not found. Please try searching again", headline="Error")
            reviews = resultproxy_to_dict_list(db.execute("""
                SELECT users.username, books.title, ratings.rating, ratings.text, ratings.date 
                FROM users
                JOIN ratings ON users.id = ratings.users_id
                JOIN books ON ratings.books_id=books.id
                WHERE books.id = :book_id""",
                {"user_id": user_id, "book_id": book_id}).fetchall())
            if len(reviews) <= 0:
                no_reviews = True
            book = book[0]
            res = requests.get("https://www.goodreads.com/book/review_counts.json", params={"key": os.getenv("KEY"), "isbns": book.get("isbn")}).json()
            res = res.get("books")
            book['work_ratings_count'] = res[0].get("work_ratings_count")
            book['average_rating'] = res[0].get("average_rating")
            return render_template("book.html", book=book, no_reviews=no_reviews, reviews=reviews, logged=True)
        elif request.method == "POST":
            star = int(request.form.get("star"))
            reviewtext = request.form.get("reviewtext")
            now = datetime.now()
            review = resultproxy_to_dict_list(
                        db.execute("SELECT * FROM ratings WHERE users_id = :user_id AND books_id = :book_id",
                        {"user_id":user_id, "book_id": book_id}).fetchall())
            if len(review) > 0:
                db.execute("""
                    UPDATE ratings
                    SET rating = :rating,
                    text = :text,
                    users_id = :users_id,
                    books_id = :books_id,
                    date = :date
                    WHERE users_id = :users_id
                    AND books_id = :books_id""",
                    {"rating":star, "text":reviewtext,"users_id":user_id, "books_id":book_id, "date":now})
                db.commit()
                return render_template("error.html", message="Your review has been updated", headline="Review updated", logged=True)
            else:
                db.execute("""INSERT INTO ratings (rating, text, users_id, books_id, date) 
                                VALUES(:rating, :text, :users_id, :books_id, :date)""", 
                                {"rating":star, "text":reviewtext, "users_id":user_id, "books_id":book_id, "date":now})
                db.commit()
                return render_template("error.html", message="Your review has been submitted", headline="Review submitted", logged=True)
    else:
        return redirect(url_for("login"))


@app.route('/api/<string:isbn>')
def apibook(isbn):
    book = resultproxy_to_dict_list(
        db.execute("SELECT * FROM books WHERE isbn = :isbn", 
        {"isbn": isbn}).fetchall())
    if len(book) <= 0:
        abort(404)
    book = book[0]
    res = requests.get("https://www.goodreads.com/book/review_counts.json",
            params={"key": os.getenv("KEY"), "isbns": book.get("isbn")}).json()
    res = res.get("books")
    book['work_ratings_count'] = res[0].get("work_ratings_count")
    book['average_rating'] = res[0].get("average_rating")
    return jsonify(book)

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='127.0.0.1', port=port)
