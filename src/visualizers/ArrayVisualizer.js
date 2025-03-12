import React, { useState, useEffect } from 'react';
import './Visualizer.css';

const ArrayVisualizer = () => {
  const [array, setArray] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [visualState, setVisualState] = useState({
    highlightedIndices: [],
    animation: null,
  });

  // Initialize with some random values
  useEffect(() => {
    generateRandomArray();
  }, []);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const randomArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100)
    );
    setArray(randomArray);
    setMessage('New random array created');
    resetVisualState();
  };

  const resetVisualState = () => {
    setVisualState({
      highlightedIndices: [],
      animation: null,
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCreateArray = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter values for the array');
      return;
    }

    try {
      // Parse the input as a comma-separated list of numbers
      const parsedArray = inputValue
        .split(',')
        .map((val) => {
          const num = Number(val.trim());
          if (isNaN(num)) {
            throw new Error('Invalid number');
          }
          return num;
        });

      setArray(parsedArray);
      setMessage('Array created successfully');
      resetVisualState();
    } catch (error) {
      setMessage('Invalid input. Please enter numbers separated by commas.');
    }
  };

  const handleInsert = () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);

    if (isNaN(index) || isNaN(value)) {
      setMessage('Please enter valid index and value');
      return;
    }

    if (index < 0 || index > array.length) {
      setMessage(`Index out of bounds. Valid range: 0 to ${array.length}`);
      return;
    }

    // Visualize the insertion
    setVisualState({
      highlightedIndices: [],
      animation: 'insert',
    });

    // Animate shifting elements (if needed)
    const animateShift = (currentIndex) => {
      if (currentIndex < index) {
        setTimeout(() => {
          setVisualState((prevState) => ({
            ...prevState,
            highlightedIndices: [currentIndex],
          }));
          animateShift(currentIndex + 1);
        }, 300);
      } else {
        // Finally insert the element
        setTimeout(() => {
          const newArray = [...array];
          newArray.splice(index, 0, value);
          setArray(newArray);
          setVisualState({
            highlightedIndices: [index],
            animation: null,
          });
          setMessage(`Inserted ${value} at index ${index}`);
          setInsertIndex('');
          setInsertValue('');
        }, 300);
      }
    };

    animateShift(0);
  };

  const handleDelete = () => {
    const index = parseInt(deleteIndex);

    if (isNaN(index)) {
      setMessage('Please enter a valid index');
      return;
    }

    if (index < 0 || index >= array.length) {
      setMessage(`Index out of bounds. Valid range: 0 to ${array.length - 1}`);
      return;
    }

    // Visualize the deletion
    setVisualState({
      highlightedIndices: [index],
      animation: 'delete',
    });

    // Wait a bit to show the highlighted element before deleting
    setTimeout(() => {
      const newArray = [...array];
      const deletedValue = newArray[index];
      newArray.splice(index, 1);
      setArray(newArray);
      setMessage(`Deleted value ${deletedValue} from index ${index}`);
      setDeleteIndex('');
      resetVisualState();
    }, 1000);
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);

    if (isNaN(value)) {
      setMessage('Please enter a valid search value');
      return;
    }

    // Linear search visualization
    const searchAnimation = (currentIndex) => {
      if (currentIndex >= array.length) {
        setMessage(`Value ${value} not found in array`);
        setTimeout(() => {
          resetVisualState();
        }, 1000);
        return;
      }

      setVisualState({
        highlightedIndices: [currentIndex],
        animation: 'search',
      });

      setTimeout(() => {
        if (array[currentIndex] === value) {
          setMessage(`Found ${value} at index ${currentIndex}`);
          setVisualState({
            highlightedIndices: [currentIndex],
            animation: 'success',
          });
          setTimeout(() => {
            resetVisualState();
          }, 1500);
        } else {
          searchAnimation(currentIndex + 1);
        }
      }, 500);
    };

    searchAnimation(0);
  };

  const getElementClassName = (index) => {
    let className = 'array-element';
    
    if (visualState.highlightedIndices.includes(index)) {
      className += ' highlighted';
      
      if (visualState.animation === 'insert') {
        className += ' insert-animation';
      } else if (visualState.animation === 'delete') {
        className += ' delete-animation';
      } else if (visualState.animation === 'search') {
        className += ' search-animation';
      } else if (visualState.animation === 'success') {
        className += ' success-animation';
      }
    }
    
    return className;
  };

  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Array Visualizer</h1>
      <p className="visualizer-description">
        Arrays are contiguous memory locations used to store multiple items of the same type.
        This visualizer demonstrates basic array operations like insertion, deletion, and searching.
      </p>

      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Create Array</h3>
          <div className="control-row">
            <input
              type="text"
              placeholder="e.g. 10, 20, 30, 40"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button className="btn" onClick={handleCreateArray}>
              Create
            </button>
            <button className="btn" onClick={generateRandomArray}>
              Random
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Insert Element</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Index"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
            />
            <input
              type="number"
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
            />
            <button className="btn" onClick={handleInsert}>
              Insert
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Delete Element</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Index"
              value={deleteIndex}
              onChange={(e) => setDeleteIndex(e.target.value)}
            />
            <button className="btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Search Element</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Message box */}
      {message && <div className="message">{message}</div>}

      {/* Visualization area */}
      <div className="visualization-area">
        <div className="array-container">
          {array.map((value, index) => (
            <div
              key={index}
              className={getElementClassName(index)}
              style={{ 
                width: `${Math.max(50, 100 / array.length)}px`,
                height: `${Math.max(50, 100 / array.length)}px`
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="array-indices">
          {array.map((_, index) => (
            <div 
              key={index} 
              className="index-label"
              style={{ 
                width: `${Math.max(50, 100 / array.length)}px`,
              }}
            >
              {index}
            </div>
          ))}
        </div>
      </div>

      {/* Complexity information */}
      <div className="complexity-info">
        <h3>Time Complexity</h3>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Operation</th>
              <th>Average Case</th>
              <th>Worst Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Access by Index</td>
              <td>O(1)</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Search</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Insertion</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Deletion</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
{`// Array insertion
function insertAt(arr, index, value) {
  // Make a copy to avoid modifying the original
  const newArray = [...arr];
  
  // Move all elements after the index one position to the right
  // and then insert the new value at the index
  newArray.splice(index, 0, value);
  
  return newArray;
}

// Array deletion
function deleteAt(arr, index) {
  // Make a copy to avoid modifying the original
  const newArray = [...arr];
  
  // Remove the element at the specified index
  newArray.splice(index, 1);
  
  return newArray;
}

// Array search (linear search)
function linearSearch(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i; // Return the index where value is found
    }
  }
  return -1; // Return -1 if value is not found
}`}
        </pre>
      </div>
    </div>
  );
};

export default ArrayVisualizer;