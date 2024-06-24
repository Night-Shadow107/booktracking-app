import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create">Create Book</Link></li>
        <li><Link to="/library">Library</Link></li>
        <li><Link to="/statistics">Statistics</Link></li>
        <li><Link to="/goal">Daily Goal</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/tbr">To Be Read List</Link></li>
        <li><Link to="/category">Search</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
