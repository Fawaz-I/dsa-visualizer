import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

// Pathfinding algorithms
const pathfindingAlgorithms = {
  // Dijkstra's Algorithm
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: "A graph search algorithm that finds the shortest path from a start node to all other nodes in a weighted graph with non-negative edge weights.",
    execute: (grid, startNode, endNode) => {
      if (!startNode || !endNode || startNode === endNode) {
        return {
          visitedNodesInOrder: [],
          shortestPath: [],
        };
      }
      
      const visitedNodesInOrder = [];
      startNode.distance = 0;
      const unvisitedNodes = getAllNodes(grid);
      
      while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        // If closest node is at infinity, we're trapped and should stop
        if (closestNode.distance === Infinity) break;
        
        // If the closest node is the end node, we've reached the end
        if (closestNode === endNode) break;
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        
        updateUnvisitedNeighbors(closestNode, grid);
      }
      
      const shortestPath = getShortestPath(endNode);
      
      return {
        visitedNodesInOrder,
        shortestPath,
      };
    },
  },
  
  // A* Algorithm
  aStar: {
    name: "A* Algorithm",
    description: "A search algorithm that uses a heuristic function to guide the search towards the goal, typically resulting in better performance than Dijkstra's algorithm.",
    execute: (grid, startNode, endNode) => {
      if (!startNode || !endNode || startNode === endNode) {
        return {
          visitedNodesInOrder: [],
          shortestPath: [],
        };
      }
      
      const visitedNodesInOrder = [];
      startNode.distance = 0;
      startNode.heuristic = calculateHeuristic(startNode, endNode);
      startNode.totalDistance = startNode.distance + startNode.heuristic;
      const unvisitedNodes = getAllNodes(grid);
      
      while (unvisitedNodes.length) {
        sortNodesByTotalDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        // If closest node is at infinity, we're trapped and should stop
        if (closestNode.distance === Infinity) break;
        
        // If the closest node is the end node, we've reached the end
        if (closestNode === endNode) break;
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        
        updateUnvisitedNeighborsAStar(closestNode, grid, endNode);
      }
      
      const shortestPath = getShortestPath(endNode);
      
      return {
        visitedNodesInOrder,
        shortestPath,
      };
    },
  },
  
  // Breadth-First Search (BFS)
  bfs: {
    name: "Breadth-First Search",
    description: "A graph traversal algorithm that explores all the vertices at the current depth level before moving to the next depth level. It finds the shortest path in an unweighted graph.",
    execute: (grid, startNode, endNode) => {
      if (!startNode || !endNode || startNode === endNode) {
        return {
          visitedNodesInOrder: [],
          shortestPath: [],
        };
      }
      
      const visitedNodesInOrder = [];
      const queue = [startNode];
      startNode.isVisited = true;
      visitedNodesInOrder.push(startNode);
      
      while (queue.length) {
        const currentNode = queue.shift();
        
        // If the current node is the end node, we've reached the end
        if (currentNode === endNode) break;
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        
        for (const neighbor of neighbors) {
          neighbor.previousNode = currentNode;
          neighbor.isVisited = true;
          visitedNodesInOrder.push(neighbor);
          queue.push(neighbor);
          
          // If the neighbor is the end node, we've reached the end
          if (neighbor === endNode) {
            queue.length = 0; // Clear the queue to exit the while loop
            break;
          }
        }
      }
      
      const shortestPath = getShortestPath(endNode);
      
      return {
        visitedNodesInOrder,
        shortestPath,
      };
    },
  },
};

// Helper functions for pathfinding algorithms
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(nodes) {
  nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function sortNodesByTotalDistance(nodes) {
  nodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    const newDistance = node.distance + neighbor.weight;
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
}

function updateUnvisitedNeighborsAStar(node, grid, endNode) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    const newDistance = node.distance + neighbor.weight;
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.heuristic = calculateHeuristic(neighbor, endNode);
      neighbor.totalDistance = neighbor.distance + neighbor.heuristic;
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  
  // North (up)
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // East (right)
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  // South (down)
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  // West (left)
  if (col > 0) neighbors.push(grid[row][col - 1]);
  
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
}

function calculateHeuristic(node, endNode) {
  // Manhattan distance
  return (
    Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col)
  );
}

function getShortestPath(endNode) {
  const shortestPath = [];
  let currentNode = endNode;
  
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return shortestPath;
}

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ row: 5, col: 5 });
  const [endNode, setEndNode] = useState({ row: 5, col: 15 });
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isStartNodeMoving, setIsStartNodeMoving] = useState(false);
  const [isEndNodeMoving, setIsEndNodeMoving] = useState(false);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [visualizationSpeed, setVisualizationSpeed] = useState(50);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Constants for grid
  const numRows = 15;
  const numCols = 25;
  
  // useRef for animation timeouts
  const animationTimeouts = useRef([]);
  
  // Initialize the grid
  useEffect(() => {
    initializeGrid();
  }, []);
  
  const initializeGrid = () => {
    const initialGrid = [];
    
    for (let row = 0; row < numRows; row++) {
      const currentRow = [];
      for (let col = 0; col < numCols; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    
    setGrid(initialGrid);
    setMessage('Grid initialized. Click and drag to create walls.');
  };
  
  // Create a node object
  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.col,
      isEnd: row === endNode.row && col === endNode.col,
      distance: Infinity,
      totalDistance: Infinity,
      heuristic: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      weight: 1,
    };
  };
  
  // Handle mouse events for drawing walls and moving start/end nodes
  const handleMouseDown = (row, col) => {
    if (isAnimating) return;
    
    setMouseIsPressed(true);
    
    const node = grid[row][col];
    
    if (node.isStart) {
      setIsStartNodeMoving(true);
      return;
    }
    
    if (node.isEnd) {
      setIsEndNodeMoving(true);
      return;
    }
    
    // Toggle wall
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };
  
  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    if (isAnimating) return;
    
    if (isStartNodeMoving) {
      // Move start node
      const newGrid = getNewGridWithStartNodeMoved(grid, row, col);
      setGrid(newGrid);
      setStartNode({ row, col });
      return;
    }
    
    if (isEndNodeMoving) {
      // Move end node
      const newGrid = getNewGridWithEndNodeMoved(grid, row, col);
      setGrid(newGrid);
      setEndNode({ row, col });
      return;
    }
    
    // Draw wall
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };
  
  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setIsStartNodeMoving(false);
    setIsEndNodeMoving(false);
  };
  
  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    // Don't toggle wall for start or end nodes
    if (node.isStart || node.isEnd) return newGrid;
    
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    
    newGrid[row][col] = newNode;
    return newGrid;
  };
  
  const getNewGridWithStartNodeMoved = (grid, row, col) => {
    const newGrid = grid.slice();
    const oldStartNode = newGrid[startNode.row][startNode.col];
    
    // If the target cell is the end node or a wall, do nothing
    if (newGrid[row][col].isEnd || newGrid[row][col].isWall) return newGrid;
    
    // Update the old start node
    const newOldStartNode = {
      ...oldStartNode,
      isStart: false,
    };
    
    // Update the new start node
    const newStartNode = {
      ...newGrid[row][col],
      isStart: true,
    };
    
    newGrid[startNode.row][startNode.col] = newOldStartNode;
    newGrid[row][col] = newStartNode;
    
    return newGrid;
  };
  
  const getNewGridWithEndNodeMoved = (grid, row, col) => {
    const newGrid = grid.slice();
    const oldEndNode = newGrid[endNode.row][endNode.col];
    
    // If the target cell is the start node or a wall, do nothing
    if (newGrid[row][col].isStart || newGrid[row][col].isWall) return newGrid;
    
    // Update the old end node
    const newOldEndNode = {
      ...oldEndNode,
      isEnd: false,
    };
    
    // Update the new end node
    const newEndNode = {
      ...newGrid[row][col],
      isEnd: true,
    };
    
    newGrid[endNode.row][endNode.col] = newOldEndNode;
    newGrid[row][col] = newEndNode;
    
    return newGrid;
  };
  
  // Handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setMessage(`Selected ${pathfindingAlgorithms[e.target.value].name}`);
  };
  
  // Visualize the algorithm
  const visualizeAlgorithm = () => {
    if (isAnimating) return;
    
    clearPath();
    setIsAnimating(true);
    setMessage(`Visualizing ${pathfindingAlgorithms[algorithm].name}...`);
    
    // Get the current start and end nodes from the grid
    const currentStartNode = grid[startNode.row][startNode.col];
    const currentEndNode = grid[endNode.row][endNode.col];
    
    // Execute the algorithm
    const result = pathfindingAlgorithms[algorithm].execute(
      grid,
      currentStartNode,
      currentEndNode
    );
    
    const { visitedNodesInOrder, shortestPath } = result;
    
    // Animate the algorithm
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  };
  
  // Animate the algorithm
  const animateAlgorithm = (visitedNodesInOrder, shortestPath) => {
    // Clear previous timeouts
    clearTimeouts();
    
    // Base delay calculated from visualization speed (inverted: higher speed = lower delay)
    const baseDelay = 1000 - (visualizationSpeed * 9);
    
    // Animate the visited nodes
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const timeout = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        
        // Update the node's CSS class
        document.getElementById(`node-${node.row}-${node.col}`).className = 
          `grid-node ${getNodeExtraClasses(node)} visited-node`;
        
        // If this is the last node, animate the shortest path
        if (i === visitedNodesInOrder.length - 1) {
          animateShortestPath(shortestPath);
        }
      }, baseDelay * i);
      
      animationTimeouts.current.push(timeout);
    }
    
    // If no nodes were visited, set message
    if (visitedNodesInOrder.length === 0) {
      setMessage('No path found.');
      setIsAnimating(false);
    }
  };
  
  // Animate the shortest path
  const animateShortestPath = (shortestPath) => {
    // Base delay calculated from visualization speed (inverted: higher speed = lower delay)
    const baseDelay = 1000 - (visualizationSpeed * 9);
    
    for (let i = 0; i < shortestPath.length; i++) {
      const timeout = setTimeout(() => {
        const node = shortestPath[i];
        
        // Update the node's CSS class
        document.getElementById(`node-${node.row}-${node.col}`).className = 
          `grid-node ${getNodeExtraClasses(node)} shortest-path-node`;
        
        // If this is the last node, set message and update state
        if (i === shortestPath.length - 1) {
          setMessage(`${pathfindingAlgorithms[algorithm].name} completed. Path length: ${shortestPath.length}`);
          setIsAnimating(false);
        }
      }, baseDelay * i);
      
      animationTimeouts.current.push(timeout);
    }
    
    // If no path was found, set message
    if (shortestPath.length === 0) {
      setMessage('No path found.');
      setIsAnimating(false);
    }
  };
  
  // Clear previous animation timeouts
  const clearTimeouts = () => {
    for (const timeout of animationTimeouts.current) {
      clearTimeout(timeout);
    }
    animationTimeouts.current = [];
  };
  
  // Clear the path but keep walls
  const clearPath = () => {
    const newGrid = grid.slice();
    
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const node = newGrid[row][col];
        
        // Reset all nodes except walls
        const newNode = {
          ...node,
          distance: Infinity,
          totalDistance: Infinity,
          heuristic: Infinity,
          isVisited: false,
          previousNode: null,
        };
        
        newGrid[row][col] = newNode;
        
        // Reset node styling
        document.getElementById(`node-${row}-${col}`).className = 
          `grid-node ${getNodeExtraClasses(newNode)}`;
      }
    }
    
    setGrid(newGrid);
    setMessage('Path cleared.');
  };
  
  // Reset the grid (clear walls and path)
  const resetGrid = () => {
    clearTimeouts();
    setIsAnimating(false);
    initializeGrid();
    setMessage('Grid reset.');
  };
  
  // Get extra CSS classes for a node
  const getNodeExtraClasses = (node) => {
    if (node.isStart) return 'start-node';
    if (node.isEnd) return 'end-node';
    if (node.isWall) return 'wall-node';
    return '';
  };
  
  // Get full CSS classes for a node
  const getNodeClassName = (node) => {
    let className = 'grid-node';
    
    // Add extra classes
    if (node.isStart) {
      className += ' start-node';
    } else if (node.isEnd) {
      className += ' end-node';
    } else if (node.isWall) {
      className += ' wall-node';
    }
    
    return className;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, []);
  
  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Pathfinding Visualizer</h1>
      <p className="visualizer-description">
        Visualize pathfinding algorithms on a grid. Click and drag to create walls,
        and drag the start and end nodes to reposition them.
      </p>
      
      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Algorithm</h3>
          <div className="control-row">
            <select value={algorithm} onChange={handleAlgorithmChange} disabled={isAnimating}>
              {Object.keys(pathfindingAlgorithms).map((key) => (
                <option key={key} value={key}>
                  {pathfindingAlgorithms[key].name}
                </option>
              ))}
            </select>
            <button className="btn" onClick={visualizeAlgorithm} disabled={isAnimating}>
              Visualize
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Controls</h3>
          <div className="control-row">
            <button className="btn" onClick={clearPath} disabled={isAnimating}>
              Clear Path
            </button>
            <button className="btn" onClick={resetGrid} disabled={isAnimating}>
              Reset Grid
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
              value={visualizationSpeed}
              onChange={(e) => setVisualizationSpeed(parseInt(e.target.value))}
              disabled={isAnimating}
            />
            <span>Fast</span>
          </div>
        </div>
      </div>
      
      {/* Message box */}
      {message && <div className="message">{message}</div>}
      
      {/* Instructions */}
      <div className="instructions">
        <p><strong>Instructions:</strong> Click and drag to draw walls. Drag the green start node or the red end node to reposition them.</p>
      </div>
      
      {/* Grid */}
      <div className="visualization-area">
        <div className="grid-container">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((node, nodeIdx) => (
                <div
                  id={`node-${node.row}-${node.col}`}
                  key={nodeIdx}
                  className={getNodeClassName(node)}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                  onMouseUp={handleMouseUp}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Algorithm Information */}
      <div className="algorithm-info">
        <h3>{pathfindingAlgorithms[algorithm].name}</h3>
        <p>{pathfindingAlgorithms[algorithm].description}</p>
        
        {/* Node type legend */}
        <div className="node-legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <div className="legend-node start-node"></div>
            <span>Start Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node end-node"></div>
            <span>End Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node wall-node"></div>
            <span>Wall</span>
          </div>
          <div className="legend-item">
            <div className="legend-node visited-node"></div>
            <span>Visited Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-node shortest-path-node"></div>
            <span>Shortest Path</span>
          </div>
        </div>
      </div>
      
      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
          {algorithm === 'dijkstra' && `
// Dijkstra's Algorithm Implementation
function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    // Sort nodes by distance
    sortNodesByDistance(unvisitedNodes);
    
    // Get the closest node
    const closestNode = unvisitedNodes.shift();
    
    // If we encounter a wall, skip it
    if (closestNode.isWall) continue;
    
    // If the closest node is at infinity, we're trapped and should stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    // Mark the node as visited
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    // If we've reached the end node, we're done
    if (closestNode === endNode) return visitedNodesInOrder;
    
    // Otherwise, update the distances to its neighbors
    updateUnvisitedNeighbors(closestNode, grid);
  }
  
  // If we've reached this point, there is no path to the end node
  return visitedNodesInOrder;
}`}
          
          {algorithm === 'aStar' && `
// A* Algorithm Implementation
function aStar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristic = calculateHeuristic(startNode, endNode);
  startNode.totalDistance = startNode.distance + startNode.heuristic;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    // Sort nodes by total distance (f = g + h)
    sortNodesByTotalDistance(unvisitedNodes);
    
    // Get the node with the lowest total distance
    const closestNode = unvisitedNodes.shift();
    
    // If we encounter a wall, skip it
    if (closestNode.isWall) continue;
    
    // If the closest node is at infinity, we're trapped and should stop
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    // Mark the node as visited
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    // If we've reached the end node, we're done
    if (closestNode === endNode) return visitedNodesInOrder;
    
    // Otherwise, update the distances to its neighbors
    updateUnvisitedNeighborsAStar(closestNode, grid, endNode);
  }
  
  // If we've reached this point, there is no path to the end node
  return visitedNodesInOrder;
}

// Calculate Manhattan distance heuristic
function calculateHeuristic(node, endNode) {
  return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}`}
          
          {algorithm === 'bfs' && `
// Breadth-First Search (BFS) Implementation
function bfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;
  visitedNodesInOrder.push(startNode);
  
  while (queue.length) {
    const currentNode = queue.shift();
    
    // If we've reached the end node, we're done
    if (currentNode === endNode) return visitedNodesInOrder;
    
    // Get all unvisited neighbors
    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      // If the neighbor is a wall, skip it
      if (neighbor.isWall) continue;
      
      // Mark as visited and add to the queue
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      visitedNodesInOrder.push(neighbor);
      queue.push(neighbor);
      
      // If we've reached the end node, we're done
      if (neighbor === endNode) return visitedNodesInOrder;
    }
  }
  
  // If we've reached this point, there is no path to the end node
  return visitedNodesInOrder;
}`}
        </pre>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;