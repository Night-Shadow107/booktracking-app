import React, { useState } from 'react';
import axios from 'axios';
import './CreateBook.css';

// Funktion zur Bereinigung und Formatierung der ISBN
function cleanISBN(isbn) {
  return isbn.replace(/[^0-9X]/gi, ''); // Entfernt Bindestriche und Leerzeichen
}

function CreateBook() {
  const [isbn, setIsbn] = useState('');
  const [bookPreview, setBookPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setIsbn(e.target.value);
  };

  const handleFetchPreview = async () => {
    try {
      const cleanedIsbn = cleanISBN(isbn);
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanedIsbn}`);
      if (response.data.totalItems === 0) {
        setMessage('Book not found');
        return;
      }
      const bookData = response.data.items[0].volumeInfo;
      setBookPreview({
        title: bookData.title,
        author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
        pages: bookData.pageCount || 'N/A',
        coverUrl: bookData.imageLinks ? bookData.imageLinks.thumbnail : 'https://as1.ftcdn.net/v2/jpg/01/98/33/60/1000_F_198336047_z3kDffgchg0guzeafi9Nebyep4xVdDxT.jpg',
        description: bookData.description || 'No description available'
      });
      setMessage('');
    } catch (error) {
      setMessage('Error fetching book preview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedIsbn = cleanISBN(isbn);
      await axios.post('http://localhost:5001/books', { isbn: cleanedIsbn });
      setMessage('Book added successfully');
    } catch (error) {
      setMessage('Error adding book');
    }
    setIsbn('');
    setBookPreview(null);
  };

  return (
    <div>
      <h2>Create a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ISBN:</label>
          <input type="text" name="isbn" value={isbn} onChange={handleChange} required />
          <button type="button" onClick={handleFetchPreview}>Fetch Preview</button>
        </div>
        {bookPreview && (
          <div className="book-preview">
            <img src={bookPreview.coverUrl} alt={`${bookPreview.title} cover`} />
            <div>
              <h3>{bookPreview.title}</h3>
              <p>by {bookPreview.author}</p>
              <p>Pages: {bookPreview.pages}</p>
              <p>{bookPreview.description}</p>
            </div>
          </div>
        )}
        <button type="submit">Add Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateBook;
