import React, { useState, useEffect } from 'react';
import './Visualizer.css';

// Class representation of a queue
class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the end of the queue
  enqueue(element) {
    this.items.push(element);
    return this.items.length;
  }

  // Remove and return the first element from the queue
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  // Return the first element without removing it
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // Return the last element without removing it
  rear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the number of elements in the queue
  size() {
    return this.items.length;
  }

  // Return the entire queue array
  getItems() {
    return [...this.items];
  }

  // Clear the queue
  clear() {
    this.items = [];
  }
}

const QueueVisualizer = () => {
  const [queue, setQueue] = useState(new Queue());
  const [queueItems, setQueueItems] = useState([]);
  const [enqueueValue, setEnqueueValue] = useState('');
  const [message, setMessage] = useState('');
  const [visualState, setVisualState] = useState({
    highlightedIndex: null,
    animation: null,
  });

  // Update the items array whenever the queue changes
  useEffect(() => {
    setQueueItems(queue.getItems());
  }, [queue]);

  // Initialize with some random values
  useEffect(() => {
    generateRandomQueue();
  }, []);

  const generateRandomQueue = () => {
    const newQueue = new Queue();
    const size = Math.floor(Math.random() * 5) + 2; // 2-6 elements
    
    for (let i = 0; i < size; i++) {
      newQueue.enqueue(Math.floor(Math.random() * 100));
    }
    
    setQueue(newQueue);
    setMessage('New random queue created');
    resetVisualState();
  };

  const resetVisualState = () => {
    setVisualState({
      highlightedIndex: null,
      animation: null,
    });
  };

  const handleEnqueue = () => {
    if (enqueueValue === '' || isNaN(parseInt(enqueueValue))) {
      setMessage('Please enter a valid number');
      return;
    }

    const value = parseInt(enqueueValue);

    // Show enqueue animation
    setVisualState({
      highlightedIndex: queue.size(),
      animation: 'enqueue',
    });

    setTimeout(() => {
      const newQueue = new Queue();
      newQueue.items = [...queue.getItems()];
      newQueue.enqueue(value);
      setQueue(newQueue);
      setEnqueueValue('');
      setMessage(`Enqueued ${value} to the queue`);
      
      setTimeout(resetVisualState, 1000);
    }, 500);
  };

  const handleDequeue = () => {
    if (queue.isEmpty()) {
      setMessage('Queue is empty, cannot dequeue');
      return;
    }

    // Show dequeue animation
    setVisualState({
      highlightedIndex: 0,
      animation: 'dequeue',
    });

    setTimeout(() => {
      const newQueue = new Queue();
      newQueue.items = [...queue.getItems()];
      const dequeuedValue = newQueue.dequeue();
      setQueue(newQueue);
      setMessage(`Dequeued ${dequeuedValue} from the queue`);
      
      setTimeout(resetVisualState, 1000);
    }, 1000);
  };

  const handleFront = () => {
    if (queue.isEmpty()) {
      setMessage('Queue is empty, no front element');
      return;
    }

    const frontValue = queue.front();
    
    // Show front element animation
    setVisualState({
      highlightedIndex: 0,
      animation: 'peek',
    });

    setMessage(`Front element is ${frontValue}`);
    
    setTimeout(resetVisualState, 1500);
  };

  const handleRear = () => {
    if (queue.isEmpty()) {
      setMessage('Queue is empty, no rear element');
      return;
    }

    const rearValue = queue.rear();
    
    // Show rear element animation
    setVisualState({
      highlightedIndex: queue.size() - 1,
      animation: 'peek',
    });

    setMessage(`Rear element is ${rearValue}`);
    
    setTimeout(resetVisualState, 1500);
  };

  const handleClear = () => {
    if (queue.isEmpty()) {
      setMessage('Queue is already empty');
      return;
    }

    // Show clear animation for all elements
    setVisualState({
      highlightedIndex: 'all',
      animation: 'clear',
    });

    setTimeout(() => {
      const newQueue = new Queue();
      setQueue(newQueue);
      setMessage('Queue cleared');
      
      setTimeout(resetVisualState, 500);
    }, 1000);
  };

  const getElementClassName = (index) => {
    let className = 'queue-element';
    
    const isHighlighted = 
      visualState.highlightedIndex === index || 
      (visualState.highlightedIndex === 'all' && visualState.animation === 'clear');
    
    if (isHighlighted) {
      className += ' highlighted';
      
      if (visualState.animation === 'enqueue') {
        className += ' insert-animation';
      } else if (visualState.animation === 'dequeue' || visualState.animation === 'clear') {
        className += ' delete-animation';
      } else if (visualState.animation === 'peek') {
        className += ' search-animation';
      }
    }
    
    return className;
  };

  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Queue Visualizer</h1>
      <p className="visualizer-description">
        A queue is a linear data structure that follows the First In, First Out (FIFO) principle.
        Elements are added at the rear and removed from the front, similar to a line of people waiting.
      </p>

      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Create Queue</h3>
          <div className="control-row">
            <button className="btn" onClick={generateRandomQueue}>
              Generate Random Queue
            </button>
            <button className="btn" onClick={handleClear}>
              Clear Queue
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Queue Operations</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Value to enqueue"
              value={enqueueValue}
              onChange={(e) => setEnqueueValue(e.target.value)}
            />
            <button className="btn" onClick={handleEnqueue}>
              Enqueue
            </button>
          </div>
          <div className="control-row">
            <button className="btn" onClick={handleDequeue}>
              Dequeue
            </button>
            <button className="btn" onClick={handleFront}>
              Front
            </button>
            <button className="btn" onClick={handleRear}>
              Rear
            </button>
          </div>
        </div>
      </div>

      {/* Message box */}
      {message && <div className="message">{message}</div>}

      {/* Visualization area */}
      <div className="visualization-area">
        <div className="queue-visual">
          {queueItems.length === 0 ? (
            <div className="empty-message">Queue is empty</div>
          ) : (
            <>
              <div className="queue-container">
                {queueItems.map((value, index) => (
                  <div
                    key={index}
                    className={getElementClassName(index)}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="queue-pointers">
                <div className="front-pointer">
                  <span>Front</span>
                  <div className="pointer-arrow">↑</div>
                </div>
                <div className="rear-pointer">
                  <span>Rear</span>
                  <div className="pointer-arrow">↑</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Complexity information */}
      <div className="complexity-info">
        <h3>Time Complexity</h3>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Time Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Enqueue</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Dequeue</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Front</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Rear</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>isEmpty</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>O(1)</td>
            </tr>
          </tbody>
        </table>
        <p className="note">
          Note: The dequeue operation is O(n) because in a simple array implementation,
          removing an element from the beginning requires shifting all other elements.
          In a more efficient implementation using a circular buffer or linked list,
          it can be O(1).
        </p>
      </div>

      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
{`// Queue implementation
class Queue {
  constructor() {
    this.items = [];
  }
  
  // Add an element to the end of the queue
  enqueue(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  // Remove and return the first element from the queue
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }
  
  // Return the first element without removing it
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }
  
  // Return the last element without removing it
  rear() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the number of elements in the queue
  size() {
    return this.items.length;
  }
  
  // Clear the queue
  clear() {
    this.items = [];
  }
}

// Example usage:
const queue = new Queue();

queue.enqueue(10);   // Add 10 to the queue
queue.enqueue(20);   // Add 20 to the queue
queue.enqueue(30);   // Add 30 to the queue

console.log(queue.front());   // Output: 10 (first element)
console.log(queue.rear());    // Output: 30 (last element)
console.log(queue.dequeue()); // Output: 10 (removes and returns first element)
console.log(queue.size());    // Output: 2

// Applications of queues:
// - Task scheduling in operating systems
// - Print job processing
// - Breadth-First Search in graphs
// - Message queues in distributed systems
// - Handling of requests on shared resources like CPU`}
        </pre>
      </div>
    </div>
  );
};

export default QueueVisualizer;