import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">DS&A Visualizer</Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">Home</Link>
          <div className="navbar-dropdown">
            <button className="dropdown-button">Data Structures</button>
            <div className="dropdown-content">
              <Link to="/array" className="dropdown-item">Array</Link>
              <Link to="/linked-list" className="dropdown-item">Linked List</Link>
              <Link to="/stack" className="dropdown-item">Stack</Link>
              <Link to="/queue" className="dropdown-item">Queue</Link>
              <Link to="/tree" className="dropdown-item">Tree</Link>
              <Link to="/graph" className="dropdown-item">Graph</Link>
            </div>
          </div>
          <div className="navbar-dropdown">
            <button className="dropdown-button">Algorithms</button>
            <div className="dropdown-content">
              <Link to="/sorting" className="dropdown-item">Sorting</Link>
              <Link to="/searching" className="dropdown-item">Searching</Link>
              <Link to="/pathfinding" className="dropdown-item">Pathfinding</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;