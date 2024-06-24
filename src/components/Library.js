import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Library.css'; // Für zusätzliche CSS-Stile

function Library() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('http://localhost:5001/books');
      console.log(response.data); // Konsolenausgabe zur Überprüfung der Buchdaten
      setBooks(response.data);
    };
    fetchBooks();
  }, []);

  return (
    <div className="library">
      <h2>Library</h2>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <Link to={`/book/${book.id}`}>
              <img src={book.coverUrl} alt={`${book.title} cover`} onError={(e) => { e.target.src = 'https://as1.ftcdn.net/v2/jpg/01/98/33/60/1000_F_198336047_z3kDffgchg0guzeafi9Nebyep4xVdDxT.jpg'; }} />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
