import React, { useState, useEffect } from 'react';
import './Visualizer.css';

// Class representation of a stack
class Stack {
  constructor() {
    this.items = [];
  }

  // Add an element to the top of the stack
  push(element) {
    this.items.push(element);
    return this.items.length;
  }

  // Remove and return the top element from the stack
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  // Return the top element without removing it
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the number of elements in the stack
  size() {
    return this.items.length;
  }

  // Return the entire stack array
  getItems() {
    return [...this.items];
  }

  // Clear the stack
  clear() {
    this.items = [];
  }
}

const StackVisualizer = () => {
  const [stack, setStack] = useState(new Stack());
  const [stackItems, setStackItems] = useState([]);
  const [pushValue, setPushValue] = useState('');
  const [message, setMessage] = useState('');
  const [visualState, setVisualState] = useState({
    highlightedIndex: null,
    animation: null,
  });

  // Update the items array whenever the stack changes
  useEffect(() => {
    setStackItems(stack.getItems());
  }, [stack]);

  // Initialize with some random values
  useEffect(() => {
    generateRandomStack();
  }, []);

  const generateRandomStack = () => {
    const newStack = new Stack();
    const size = Math.floor(Math.random() * 4) + 1; // 1-4 elements
    
    for (let i = 0; i < size; i++) {
      newStack.push(Math.floor(Math.random() * 100));
    }
    
    setStack(newStack);
    setMessage('New random stack created');
    resetVisualState();
  };

  const resetVisualState = () => {
    setVisualState({
      highlightedIndex: null,
      animation: null,
    });
  };

  const handlePush = () => {
    if (pushValue === '' || isNaN(parseInt(pushValue))) {
      setMessage('Please enter a valid number');
      return;
    }

    const value = parseInt(pushValue);

    // Show push animation
    setVisualState({
      highlightedIndex: stack.size(),
      animation: 'push',
    });

    setTimeout(() => {
      const newStack = new Stack();
      newStack.items = [...stack.getItems()];
      newStack.push(value);
      setStack(newStack);
      setPushValue('');
      setMessage(`Pushed ${value} to the stack`);
      
      setTimeout(resetVisualState, 1000);
    }, 500);
  };

  const handlePop = () => {
    if (stack.isEmpty()) {
      setMessage('Stack is empty, cannot pop');
      return;
    }

    // Show pop animation
    setVisualState({
      highlightedIndex: stack.size() - 1,
      animation: 'pop',
    });

    setTimeout(() => {
      const newStack = new Stack();
      newStack.items = [...stack.getItems()];
      const poppedValue = newStack.pop();
      setStack(newStack);
      setMessage(`Popped ${poppedValue} from the stack`);
      
      setTimeout(resetVisualState, 1000);
    }, 1000);
  };

  const handlePeek = () => {
    if (stack.isEmpty()) {
      setMessage('Stack is empty, nothing to peek');
      return;
    }

    const topValue = stack.peek();
    
    // Show peek animation
    setVisualState({
      highlightedIndex: stack.size() - 1,
      animation: 'peek',
    });

    setMessage(`Top element is ${topValue}`);
    
    setTimeout(resetVisualState, 1500);
  };

  const handleClear = () => {
    if (stack.isEmpty()) {
      setMessage('Stack is already empty');
      return;
    }

    // Show clear animation for all elements
    setVisualState({
      highlightedIndex: 'all',
      animation: 'clear',
    });

    setTimeout(() => {
      const newStack = new Stack();
      setStack(newStack);
      setMessage('Stack cleared');
      
      setTimeout(resetVisualState, 500);
    }, 1000);
  };

  const getElementClassName = (index) => {
    let className = 'stack-element';
    
    const isHighlighted = 
      visualState.highlightedIndex === index || 
      (visualState.highlightedIndex === 'all' && visualState.animation === 'clear');
    
    if (isHighlighted) {
      className += ' highlighted';
      
      if (visualState.animation === 'push') {
        className += ' insert-animation';
      } else if (visualState.animation === 'pop' || visualState.animation === 'clear') {
        className += ' delete-animation';
      } else if (visualState.animation === 'peek') {
        className += ' search-animation';
      }
    }
    
    return className;
  };

  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Stack Visualizer</h1>
      <p className="visualizer-description">
        A stack is a linear data structure that follows the Last In, First Out (LIFO) principle.
        Elements are added to and removed from the top of the stack, similar to a stack of plates.
      </p>

      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Create Stack</h3>
          <div className="control-row">
            <button className="btn" onClick={generateRandomStack}>
              Generate Random Stack
            </button>
            <button className="btn" onClick={handleClear}>
              Clear Stack
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Stack Operations</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Value to push"
              value={pushValue}
              onChange={(e) => setPushValue(e.target.value)}
            />
            <button className="btn" onClick={handlePush}>
              Push
            </button>
          </div>
          <div className="control-row">
            <button className="btn" onClick={handlePop}>
              Pop
            </button>
            <button className="btn" onClick={handlePeek}>
              Peek
            </button>
          </div>
        </div>
      </div>

      {/* Message box */}
      {message && <div className="message">{message}</div>}

      {/* Visualization area */}
      <div className="visualization-area">
        <div className="stack-visual">
          <div className="stack-container">
            {stackItems.map((value, index) => (
              <div
                key={index}
                className={getElementClassName(index)}
              >
                {value}
              </div>
            ))}
            {stackItems.length === 0 && (
              <div className="empty-message">Stack is empty</div>
            )}
          </div>
          {stackItems.length > 0 && (
            <div className="stack-pointer">
              <span>Top</span>
              <div className="pointer-arrow">↑</div>
            </div>
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
              <td>Push</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Pop</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Peek</td>
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
      </div>

      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
{`// Stack implementation
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Add an element to the top of the stack
  push(element) {
    this.items.push(element);
    return this.items.length;
  }
  
  // Remove and return the top element from the stack
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }
  
  // Return the top element without removing it
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the number of elements in the stack
  size() {
    return this.items.length;
  }
  
  // Clear the stack
  clear() {
    this.items = [];
  }
}

// Example usage:
const stack = new Stack();

stack.push(10);   // Add 10 to the stack
stack.push(20);   // Add 20 to the stack
stack.push(30);   // Add 30 to the stack

console.log(stack.peek());  // Output: 30 (top element)
console.log(stack.pop());   // Output: 30 (removes and returns top element)
console.log(stack.size());  // Output: 2
console.log(stack.isEmpty()); // Output: false

// Applications of stacks:
// - Function call management (call stack)
// - Expression evaluation
// - Backtracking algorithms
// - Undo functionality in applications
// - Syntax parsing in compilers`}
        </pre>
      </div>
    </div>
  );
};

export default StackVisualizer;