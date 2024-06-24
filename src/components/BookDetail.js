import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css'; // Importiere die CSS-Datei

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [pagesRead, setPagesRead] = useState(0);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkPage, setBookmarkPage] = useState('');
  const [bookmarkColor, setBookmarkColor] = useState('red');
  const [bookmarkText, setBookmarkText] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/books/${id}`);
        if (response.status === 404) {
          console.error('Book not found');
          return;
        }
        setBook(response.data);
        setPagesRead(response.data.pagesRead);
        setNotes(response.data.notes);
        fetchBookmarks();
      } catch (error) {
        console.error('Error fetching book', error);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/books/${id}/bookmarks`);
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks', error);
      }
    };

    fetchBook();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/books/${id}`, {
        pagesRead,
        notes,
        bookmarks
      });
      alert('Book updated successfully');
    } catch (error) {
      alert('Error updating book');
    }
  };

  const handleAddBookmark = async () => {
    if (bookmarkPage > book.pages || bookmarkPage < 1) {
      alert('Invalid page number');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5001/bookmarks`, {
        bookId: id,
        page: bookmarkPage,
        color: bookmarkColor,
        text: bookmarkText
      });
      setBookmarks([...bookmarks, { id: response.data.id, page: bookmarkPage, color: bookmarkColor, text: bookmarkText }]);
      setBookmarkPage('');
      setBookmarkColor('red');
      setBookmarkText('');
    } catch (error) {
      alert('Error adding bookmark');
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-detail">
      <h2>{book.title}</h2>
      <img src={book.coverUrl} alt={`${book.title} cover`} />
      <p>Author: {book.author}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Total Pages: {book.pages}</p>
      <div className="form-group">
        <label>Pages Read:</label>
        <input type="number" value={pagesRead} onChange={(e) => setPagesRead(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
      </div>
      <div className="form-group">
        <label>New Bookmark:</label>
        <input type="number" placeholder="Page" value={bookmarkPage} onChange={(e) => setBookmarkPage(e.target.value)} />
        <select value={bookmarkColor} onChange={(e) => setBookmarkColor(e.target.value)}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
        <input type="text" placeholder="Text" value={bookmarkText} onChange={(e) => setBookmarkText(e.target.value)} />
        <button onClick={handleAddBookmark}>Add Bookmark</button>
      </div>
      <div className="bookmarks-list">
        <h3>Bookmarks:</h3>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bookmark" style={{ backgroundColor: bookmark.color }}>
            <p>Page: {bookmark.page}</p>
            <p>{bookmark.text}</p>
          </div>
        ))}
      </div>
      <button onClick={handleUpdate}>Update Book</button>
    </div>
  );
}

export default BookDetail;
