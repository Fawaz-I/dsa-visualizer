import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

// Graph algorithms and operations
const graphAlgorithms = {
  // Breadth-First Search (BFS)
  bfs: {
    name: 'Breadth-First Search',
    description: 'A graph traversal algorithm that explores all the vertices of a graph at the current depth level before moving to the next depth level.',
    execute: (graph, startVertex) => {
      if (!graph.vertices.includes(startVertex)) {
        return {
          visited: [],
          frames: [],
        };
      }
      
      const visited = [];
      const frames = [];
      const queue = [startVertex];
      
      // Mark the start vertex as visited
      visited.push(startVertex);
      
      // Add initial frame
      frames.push({
        type: 'start',
        vertex: startVertex,
        visited: [...visited],
        queue: [...queue],
      });
      
      while (queue.length > 0) {
        // Dequeue a vertex from queue
        const currentVertex = queue.shift();
        
        // Add frame for current vertex processing
        frames.push({
          type: 'process',
          vertex: currentVertex,
          visited: [...visited],
          queue: [...queue],
        });
        
        // Get all adjacent vertices of the dequeued vertex
        // If an adjacent vertex has not been visited, mark it as visited and enqueue it
        const adjacentVertices = graph.adjacencyList[currentVertex] || [];
        
        for (const adjacentVertex of adjacentVertices) {
          if (!visited.includes(adjacentVertex)) {
            visited.push(adjacentVertex);
            queue.push(adjacentVertex);
            
            // Add frame for visiting adjacent vertex
            frames.push({
              type: 'visit',
              vertex: currentVertex,
              adjacent: adjacentVertex,
              visited: [...visited],
              queue: [...queue],
            });
          } else {
            // Add frame for already visited adjacent vertex
            frames.push({
              type: 'revisit',
              vertex: currentVertex,
              adjacent: adjacentVertex,
              visited: [...visited],
              queue: [...queue],
            });
          }
        }
      }
      
      // Add final frame
      frames.push({
        type: 'complete',
        visited: [...visited],
        queue: [],
      });
      
      return {
        visited,
        frames,
      };
    },
  },
  
  // Depth-First Search (DFS)
  dfs: {
    name: 'Depth-First Search',
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    execute: (graph, startVertex) => {
      if (!graph.vertices.includes(startVertex)) {
        return {
          visited: [],
          frames: [],
        };
      }
      
      const visited = [];
      const frames = [];
      
      // Add initial frame
      frames.push({
        type: 'start',
        vertex: startVertex,
        visited: [],
        stack: [startVertex],
      });
      
      const dfsHelper = (vertex, stack = []) => {
        // Mark the current vertex as visited
        visited.push(vertex);
        
        // Add frame for current vertex processing
        frames.push({
          type: 'process',
          vertex,
          visited: [...visited],
          stack: [...stack],
        });
        
        // Get all adjacent vertices of the current vertex
        const adjacentVertices = graph.adjacencyList[vertex] || [];
        
        for (const adjacentVertex of adjacentVertices) {
          if (!visited.includes(adjacentVertex)) {
            // Add frame for visiting adjacent vertex
            frames.push({
              type: 'visit',
              vertex,
              adjacent: adjacentVertex,
              visited: [...visited],
              stack: [...stack, adjacentVertex],
            });
            
            // Recursively visit adjacent vertex
            dfsHelper(adjacentVertex, [...stack, adjacentVertex]);
          } else {
            // Add frame for already visited adjacent vertex
            frames.push({
              type: 'revisit',
              vertex,
              adjacent: adjacentVertex,
              visited: [...visited],
              stack: [...stack],
            });
          }
        }
        
        // Add frame for backtracking
        if (stack.length > 0) {
          frames.push({
            type: 'backtrack',
            vertex,
            visited: [...visited],
            stack: stack.slice(0, -1),
          });
        }
      };
      
      dfsHelper(startVertex, [startVertex]);
      
      // Add final frame
      frames.push({
        type: 'complete',
        visited: [...visited],
        stack: [],
      });
      
      return {
        visited,
        frames,
      };
    },
  },
};

// Graph class for creating and managing graphs
class Graph {
  constructor(directed = false) {
    this.vertices = [];
    this.adjacencyList = {};
    this.directed = directed;
  }
  
  // Add a vertex to the graph
  addVertex(vertex) {
    if (!this.vertices.includes(vertex)) {
      this.vertices.push(vertex);
      this.adjacencyList[vertex] = [];
      return true;
    }
    return false;
  }
  
  // Add an edge between two vertices
  addEdge(vertex1, vertex2, weight = 1) {
    if (this.vertices.includes(vertex1) && this.vertices.includes(vertex2)) {
      if (!this.adjacencyList[vertex1].includes(vertex2)) {
        this.adjacencyList[vertex1].push(vertex2);
        
        if (!this.directed) {
          if (!this.adjacencyList[vertex2].includes(vertex1)) {
            this.adjacencyList[vertex2].push(vertex1);
          }
        }
        return true;
      }
    }
    return false;
  }
  
  // Remove a vertex and all its connections
  removeVertex(vertex) {
    if (!this.vertices.includes(vertex)) return false;
    
    // Remove the vertex from adjacency lists of other vertices
    for (const v of this.vertices) {
      this.adjacencyList[v] = this.adjacencyList[v].filter(
        (adjVertex) => adjVertex !== vertex
      );
    }
    
    // Remove the vertex from the vertices list
    this.vertices = this.vertices.filter((v) => v !== vertex);
    
    // Remove the vertex's adjacency list
    delete this.adjacencyList[vertex];
    
    return true;
  }
  
  // Remove an edge between two vertices
  removeEdge(vertex1, vertex2) {
    if (this.vertices.includes(vertex1) && this.vertices.includes(vertex2)) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
        (v) => v !== vertex2
      );
      
      if (!this.directed) {
        this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
          (v) => v !== vertex1
        );
      }
      return true;
    }
    return false;
  }
  
  // Get all vertices in the graph
  getVertices() {
    return [...this.vertices];
  }
  
  // Get all edges in the graph
  getEdges() {
    const edges = [];
    
    for (const vertex of this.vertices) {
      for (const adjacent of this.adjacencyList[vertex]) {
        if (this.directed || vertex < adjacent) {
          edges.push([vertex, adjacent]);
        }
      }
    }
    
    return edges;
  }
  
  // Check if there is an edge between two vertices
  hasEdge(vertex1, vertex2) {
    if (this.vertices.includes(vertex1) && this.vertices.includes(vertex2)) {
      return this.adjacencyList[vertex1].includes(vertex2);
    }
    return false;
  }
  
  // Clear the graph
  clear() {
    this.vertices = [];
    this.adjacencyList = {};
  }
  
  // Create a random graph
  static createRandomGraph(numVertices = 6, edgeProbability = 0.4, directed = false) {
    const graph = new Graph(directed);
    
    // Add vertices
    for (let i = 0; i < numVertices; i++) {
      graph.addVertex(String.fromCharCode(65 + i)); // A, B, C, ...
    }
    
    // Add random edges
    for (let i = 0; i < numVertices; i++) {
      for (let j = directed ? 0 : i + 1; j < numVertices; j++) {
        if (i !== j && Math.random() < edgeProbability) {
          const vertex1 = String.fromCharCode(65 + i);
          const vertex2 = String.fromCharCode(65 + j);
          graph.addEdge(vertex1, vertex2);
        }
      }
    }
    
    return graph;
  }
}

const GraphVisualizer = () => {
  const [graph, setGraph] = useState(new Graph());
  const [vertex1, setVertex1] = useState('');
  const [vertex2, setVertex2] = useState('');
  const [startVertex, setStartVertex] = useState('');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [animationFrames, setAnimationFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [visualState, setVisualState] = useState({
    activeVertex: null,
    activeEdge: null,
    visitedVertices: [],
    currentQueue: [],
    currentStack: [],
  });
  const [speed, setSpeed] = useState(50); // Animation speed (0-100)
  const [graphType, setGraphType] = useState('undirected');
  
  const animationRef = useRef(null);
  const svgRef = useRef(null);
  
  // Initialize with a random graph
  useEffect(() => {
    generateRandomGraph();
  }, []);
  
  // Generate a random graph
  const generateRandomGraph = () => {
    const isDirected = graphType === 'directed';
    const newGraph = Graph.createRandomGraph(6, 0.4, isDirected);
    setGraph(newGraph);
    resetAnimation();
    setMessage(`Generated a random ${isDirected ? 'directed' : 'undirected'} graph`);
  };
  
  // Reset animation state
  const resetAnimation = () => {
    setAnimationFrames([]);
    setCurrentFrame(0);
    setIsAnimating(false);
    setVisualState({
      activeVertex: null,
      activeEdge: null,
      visitedVertices: [],
      currentQueue: [],
      currentStack: [],
    });
  };
  
  // Handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetAnimation();
    setMessage(`Selected ${graphAlgorithms[e.target.value].name}`);
  };
  
  // Handle graph type selection
  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
    resetAnimation();
  };
  
  // Add vertex to the graph
  const handleAddVertex = () => {
    if (!vertex1) {
      setMessage('Please enter a vertex label');
      return;
    }
    
    const success = graph.addVertex(vertex1.toUpperCase());
    
    if (success) {
      setMessage(`Added vertex ${vertex1.toUpperCase()}`);
      setVertex1('');
      // Create a new graph instance to trigger re-render
      setGraph(new Graph(graph.directed, { ...graph.adjacencyList }));
    } else {
      setMessage(`Vertex ${vertex1.toUpperCase()} already exists`);
    }
  };
  
  // Add edge to the graph
  const handleAddEdge = () => {
    if (!vertex1 || !vertex2) {
      setMessage('Please enter both vertices for the edge');
      return;
    }
    
    const v1 = vertex1.toUpperCase();
    const v2 = vertex2.toUpperCase();
    
    if (!graph.vertices.includes(v1)) {
      graph.addVertex(v1);
    }
    
    if (!graph.vertices.includes(v2)) {
      graph.addVertex(v2);
    }
    
    const success = graph.addEdge(v1, v2);
    
    if (success) {
      setMessage(`Added edge ${v1}-${v2}`);
      setVertex1('');
      setVertex2('');
      // Create a new graph instance to trigger re-render
      setGraph(new Graph(graph.directed, { ...graph.adjacencyList }));
    } else {
      setMessage(`Edge ${v1}-${v2} already exists`);
    }
  };
  
  // Execute algorithm
  const executeAlgorithm = () => {
    if (!startVertex) {
      setMessage('Please select a start vertex');
      return;
    }
    
    if (!graph.vertices.includes(startVertex.toUpperCase())) {
      setMessage(`Vertex ${startVertex.toUpperCase()} does not exist in the graph`);
      return;
    }
    
    resetAnimation();
    
    const result = graphAlgorithms[algorithm].execute(
      graph,
      startVertex.toUpperCase()
    );
    
    setAnimationFrames(result.frames);
    startAnimation(result.frames);
  };
  
  // Start the animation
  const startAnimation = (frames) => {
    setIsAnimating(true);
    setMessage(`Visualizing ${graphAlgorithms[algorithm].name}...`);
    
    // Start animation loop
    const animate = () => {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + 1;
        
        // Check if animation is complete
        if (nextFrame >= frames.length) {
          setIsAnimating(false);
          setMessage(`${graphAlgorithms[algorithm].name} completed!`);
          return prevFrame;
        }
        
        // Process the next frame
        const frame = frames[nextFrame];
        
        switch (frame.type) {
          case 'start':
            setVisualState({
              activeVertex: frame.vertex,
              activeEdge: null,
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          case 'process':
            setVisualState({
              activeVertex: frame.vertex,
              activeEdge: null,
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          case 'visit':
            setVisualState({
              activeVertex: frame.adjacent,
              activeEdge: [frame.vertex, frame.adjacent],
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          case 'revisit':
            setVisualState({
              activeVertex: frame.vertex,
              activeEdge: [frame.vertex, frame.adjacent],
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          case 'backtrack':
            setVisualState({
              activeVertex: frame.vertex,
              activeEdge: null,
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          case 'complete':
            setVisualState({
              activeVertex: null,
              activeEdge: null,
              visitedVertices: frame.visited,
              currentQueue: frame.queue || [],
              currentStack: frame.stack || [],
            });
            break;
          default:
            break;
        }
        
        return nextFrame;
      });
      
      // Calculate delay based on speed (inverted: higher speed = lower delay)
      const delay = 1000 - (speed * 9);
      animationRef.current = setTimeout(animate, delay);
    };
    
    animate();
  };
  
  // Pause the animation
  const pauseAnimation = () => {
    setIsAnimating(false);
    clearTimeout(animationRef.current);
    setMessage(`${graphAlgorithms[algorithm].name} paused`);
  };
  
  // Reset and stop the animation
  const resetVisualization = () => {
    pauseAnimation();
    resetAnimation();
    setMessage('Visualization reset');
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimeout(animationRef.current);
    };
  }, []);
  
  // Calculate vertex positions for visualization
  const getVertexPositions = () => {
    const positions = {};
    const numVertices = graph.vertices.length;
    const radius = 150;
    const centerX = 250;
    const centerY = 200;
    
    graph.vertices.forEach((vertex, index) => {
      const angle = (index / numVertices) * 2 * Math.PI;
      positions[vertex] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    return positions;
  };
  
  // Get class name for a vertex based on its state
  const getVertexClassName = (vertex) => {
    let className = 'graph-node';
    
    if (visualState.activeVertex === vertex) {
      className += ' active-node';
    } else if (visualState.visitedVertices.includes(vertex)) {
      className += ' visited-node';
    }
    
    if (vertex === startVertex.toUpperCase()) {
      className += ' start-node';
    }
    
    return className;
  };
  
  // Get class name for an edge based on its state
  const getEdgeClassName = (v1, v2) => {
    let className = 'graph-edge';
    
    if (
      (visualState.activeEdge &&
        ((visualState.activeEdge[0] === v1 && visualState.activeEdge[1] === v2) ||
         (!graph.directed && visualState.activeEdge[0] === v2 && visualState.activeEdge[1] === v1)))
    ) {
      className += ' active-edge';
    }
    
    return className;
  };
  
  // Vertex positions for the graph visualization
  const vertexPositions = getVertexPositions();
  
  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Graph Visualizer</h1>
      <p className="visualizer-description">
        Visualize graph data structures and algorithms like BFS and DFS.
        You can create your own graphs or generate random ones.
      </p>
      
      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Graph Type</h3>
          <div className="control-row">
            <select value={graphType} onChange={handleGraphTypeChange}>
              <option value="undirected">Undirected Graph</option>
              <option value="directed">Directed Graph</option>
            </select>
            <button className="btn" onClick={generateRandomGraph}>
              Generate Random Graph
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Add Vertex</h3>
          <div className="control-row">
            <input
              type="text"
              placeholder="Vertex (e.g., A, B, C)"
              value={vertex1}
              onChange={(e) => setVertex1(e.target.value)}
              maxLength={1}
            />
            <button className="btn" onClick={handleAddVertex}>
              Add Vertex
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Add Edge</h3>
          <div className="control-row">
            <input
              type="text"
              placeholder="From (e.g., A)"
              value={vertex1}
              onChange={(e) => setVertex1(e.target.value)}
              maxLength={1}
            />
            <input
              type="text"
              placeholder="To (e.g., B)"
              value={vertex2}
              onChange={(e) => setVertex2(e.target.value)}
              maxLength={1}
            />
            <button className="btn" onClick={handleAddEdge}>
              Add Edge
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Algorithm</h3>
          <div className="control-row">
            <select value={algorithm} onChange={handleAlgorithmChange}>
              {Object.keys(graphAlgorithms).map((key) => (
                <option key={key} value={key}>
                  {graphAlgorithms[key].name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Start Vertex (e.g., A)"
              value={startVertex}
              onChange={(e) => setStartVertex(e.target.value)}
              maxLength={1}
            />
            <button className="btn" onClick={executeAlgorithm} disabled={isAnimating}>
              Execute
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Animation Speed</h3>
          <div className="speed-control">
            <span>Slow</span>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isAnimating}
            />
            <span>Fast</span>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Controls</h3>
          <div className="control-row">
            {isAnimating ? (
              <button className="btn" onClick={pauseAnimation}>
                Pause
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => startAnimation(animationFrames)}
                disabled={animationFrames.length === 0 || currentFrame === animationFrames.length - 1}
              >
                {currentFrame === 0 ? 'Start' : 'Resume'}
              </button>
            )}
            <button className="btn" onClick={resetVisualization}>
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Message box */}
      {message && <div className="message">{message}</div>}
      
      {/* Visualization area */}
      <div className="visualization-area">
        <div className="graph-container" ref={svgRef}>
          <svg width="100%" height="400" viewBox="0 0 500 400">
            {/* Draw edges */}
            {graph.getEdges().map(([v1, v2], index) => {
              const start = vertexPositions[v1];
              const end = vertexPositions[v2];
              
              if (!start || !end) return null;
              
              // For directed graphs, add an arrow
              let markerEnd = '';
              if (graph.directed) {
                markerEnd = 'url(#arrowhead)';
              }
              
              return (
                <g key={`edge-${index}`}>
                  <line
                    className={getEdgeClassName(v1, v2)}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    markerEnd={markerEnd}
                  />
                  {graph.directed && (
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                      </marker>
                    </defs>
                  )}
                </g>
              );
            })}
            
            {/* Draw vertices */}
            {graph.vertices.map((vertex) => {
              const position = vertexPositions[vertex];
              if (!position) return null;
              
              return (
                <g key={`vertex-${vertex}`}>
                  <circle
                    className={getVertexClassName(vertex)}
                    cx={position.x}
                    cy={position.y}
                    r="20"
                  />
                  <text
                    x={position.x}
                    y={position.y}
                    dy=".3em"
                    textAnchor="middle"
                    className="vertex-label"
                  >
                    {vertex}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Queue or Stack visualization based on the algorithm */}
        {(visualState.currentQueue.length > 0 || visualState.currentStack.length > 0) && (
          <div className="data-structure-container">
            <h3>{algorithm === 'bfs' ? 'Queue' : 'Stack'}</h3>
            <div className={algorithm === 'bfs' ? 'queue-display' : 'stack-display'}>
              {algorithm === 'bfs'
                ? visualState.currentQueue.map((v, i) => (
                    <div key={`queue-${i}`} className="data-structure-element">
                      {v}
                    </div>
                  ))
                : visualState.currentStack.map((v, i) => (
                    <div key={`stack-${i}`} className="data-structure-element">
                      {v}
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Algorithm Information */}
      <div className="algorithm-info">
        <h3>{graphAlgorithms[algorithm].name}</h3>
        <p>{graphAlgorithms[algorithm].description}</p>
        
        {/* Visited vertices */}
        {visualState.visitedVertices.length > 0 && (
          <div className="visited-vertices">
            <h4>Visited Vertices</h4>
            <div className="visited-list">
              {visualState.visitedVertices.join(' → ')}
            </div>
          </div>
        )}
      </div>
      
      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
          {algorithm === 'bfs' && `
// Breadth-First Search (BFS) implementation
function bfs(graph, startVertex) {
  // Create a queue for BFS
  const queue = [startVertex];
  
  // Create a list to track visited vertices
  const visited = [];
  
  // Mark the start vertex as visited
  visited.push(startVertex);
  
  // Loop until queue is empty
  while (queue.length > 0) {
    // Dequeue a vertex from queue
    const currentVertex = queue.shift();
    
    console.log(currentVertex); // Process the vertex (print for this example)
    
    // Get all adjacent vertices of the dequeued vertex
    const adjacentVertices = graph.adjacencyList[currentVertex] || [];
    
    // If an adjacent vertex has not been visited, mark it as visited and enqueue it
    for (const adjacentVertex of adjacentVertices) {
      if (!visited.includes(adjacentVertex)) {
        visited.push(adjacentVertex);
        queue.push(adjacentVertex);
      }
    }
  }
  
  return visited; // Return the visited vertices in BFS order
}`}
          
          {algorithm === 'dfs' && `
// Depth-First Search (DFS) implementation
function dfs(graph, startVertex) {
  // Create a list to track visited vertices
  const visited = [];
  
  // Define the recursive helper function
  function dfsHelper(vertex) {
    // Mark the current vertex as visited
    visited.push(vertex);
    
    console.log(vertex); // Process the vertex (print for this example)
    
    // Recursively visit all adjacent vertices that haven't been visited
    const adjacentVertices = graph.adjacencyList[vertex] || [];
    
    for (const adjacentVertex of adjacentVertices) {
      if (!visited.includes(adjacentVertex)) {
        dfsHelper(adjacentVertex);
      }
    }
  }
  
  // Start DFS from the given vertex
  dfsHelper(startVertex);
  
  return visited; // Return the visited vertices in DFS order
}`}
        </pre>
      </div>
    </div>
  );
};

export default GraphVisualizer;