import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const dataStructures = [
    {
      id: 'array',
      title: 'Arrays',
      description: 'Visualize array operations and manipulations.',
      imageClass: 'array-icon',
    },
    {
      id: 'linked-list',
      title: 'Linked Lists',
      description: 'Explore singly and doubly linked lists with visual representations.',
      imageClass: 'linked-list-icon',
    },
    {
      id: 'stack',
      title: 'Stacks',
      description: 'Understand LIFO (Last In, First Out) data structures.',
      imageClass: 'stack-icon',
    },
    {
      id: 'queue',
      title: 'Queues',
      description: 'Learn FIFO (First In, First Out) data structures.',
      imageClass: 'queue-icon',
    },
    {
      id: 'tree',
      title: 'Trees',
      description: 'Explore binary trees, BSTs, AVL trees, and more.',
      imageClass: 'tree-icon',
    },
    {
      id: 'graph',
      title: 'Graphs',
      description: 'Visualize graph structures and operations.',
      imageClass: 'graph-icon',
    },
  ];

  const algorithms = [
    {
      id: 'sorting',
      title: 'Sorting Algorithms',
      description: 'Visualize and compare various sorting algorithms.',
      imageClass: 'sorting-icon',
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      description: 'Learn different methods for finding elements in data structures.',
      imageClass: 'searching-icon',
    },
    {
      id: 'pathfinding',
      title: 'Pathfinding Algorithms',
      description: 'Explore algorithms for finding paths in graphs.',
      imageClass: 'pathfinding-icon',
    },
  ];

  return (
    <div className="home">
      <div className="hero">
        <h1>Data Structures & Algorithms Visualizer</h1>
        <p>
          Interactive visualizations to help you understand the core concepts
          of computer science and programming.
        </p>
      </div>

      <section>
        <h2 className="section-title">Data Structures</h2>
        <div className="cards-container">
          {dataStructures.map((ds) => (
            <Link to={`/${ds.id}`} className="card-link" key={ds.id}>
              <div className="card">
                <div className={`card-icon ${ds.imageClass}`}></div>
                <h3 className="card-title">{ds.title}</h3>
                <p className="card-description">{ds.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Algorithms</h2>
        <div className="cards-container">
          {algorithms.map((algo) => (
            <Link to={`/${algo.id}`} className="card-link" key={algo.id}>
              <div className="card">
                <div className={`card-icon ${algo.imageClass}`}></div>
                <h3 className="card-title">{algo.title}</h3>
                <p className="card-description">{algo.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">About This Tool</h2>
        <div className="about-content">
          <p>
            This interactive tool is designed to help students and developers visualize and understand
            data structures and algorithms. Each visualization includes:
          </p>
          <ul>
            <li>Step-by-step execution of operations</li>
            <li>Visual representation of data structures</li>
            <li>Pseudocode and actual code implementation</li>
            <li>Time and space complexity analysis</li>
          </ul>
          <p>
            Learning computer science concepts becomes easier when you can see them in action!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;