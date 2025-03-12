import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import StackVisualizer from './visualizers/StackVisualizer';
import QueueVisualizer from './visualizers/QueueVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import SortingVisualizer from './visualizers/SortingVisualizer';
import SearchVisualizer from './visualizers/SearchVisualizer';
import PathfindingVisualizer from './visualizers/PathfindingVisualizer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/array" element={<ArrayVisualizer />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/stack" element={<StackVisualizer />} />
            <Route path="/queue" element={<QueueVisualizer />} />
            <Route path="/tree" element={<TreeVisualizer />} />
            <Route path="/graph" element={<GraphVisualizer />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/searching" element={<SearchVisualizer />} />
            <Route path="/pathfinding" element={<PathfindingVisualizer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;