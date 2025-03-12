import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

// Search algorithms
const searchAlgorithms = {
  // Linear Search
  linearSearch: {
    name: 'Linear Search',
    description: 'A simple search algorithm that checks each element in the list one by one until it finds the target element or reaches the end of the list.',
    getAnimationFrames: (array, target) => {
      const frames = [];
      
      for (let i = 0; i < array.length; i++) {
        // Add frame for current element being checked
        frames.push({
          type: 'compare',
          indices: [i],
          array,
        });
        
        if (array[i] === target) {
          // Target found
          frames.push({
            type: 'found',
            indices: [i],
            array,
          });
          return frames;
        }
      }
      
      // Target not found
      frames.push({
        type: 'not-found',
        indices: [],
        array,
      });
      
      return frames;
    },
    execute: (array, target) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === target) {
          return i;
        }
      }
      return -1;
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Binary Search
  binarySearch: {
    name: 'Binary Search',
    description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
    getAnimationFrames: (array, target) => {
      const frames = [];
      let left = 0;
      let right = array.length - 1;
      
      // Early check if the array is empty
      if (array.length === 0) {
        frames.push({
          type: 'not-found',
          indices: [],
          array,
        });
        return frames;
      }
      
      // Check if target is outside the array bounds
      if (target < array[0] || target > array[array.length - 1]) {
        frames.push({
          type: 'compare',
          indices: [0],
          array,
        });
        frames.push({
          type: 'compare',
          indices: [array.length - 1],
          array,
        });
        frames.push({
          type: 'not-found',
          indices: [],
          array,
        });
        return frames;
      }
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Add frame for current search range
        frames.push({
          type: 'range',
          indices: [left, mid, right],
          array,
        });
        
        // Add frame for comparing the middle element
        frames.push({
          type: 'compare',
          indices: [mid],
          array,
        });
        
        if (array[mid] === target) {
          // Target found
          frames.push({
            type: 'found',
            indices: [mid],
            array,
          });
          return frames;
        }
        
        if (array[mid] < target) {
          // Target is in the right half
          left = mid + 1;
        } else {
          // Target is in the left half
          right = mid - 1;
        }
      }
      
      // Target not found
      frames.push({
        type: 'not-found',
        indices: [],
        array,
      });
      
      return frames;
    },
    execute: (array, target) => {
      let left = 0;
      let right = array.length - 1;
      
      // Early check if the array is empty
      if (array.length === 0) {
        return -1;
      }
      
      // Check if target is outside the array bounds
      if (target < array[0] || target > array[array.length - 1]) {
        return -1;
      }
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (array[mid] === target) {
          return mid;
        }
        
        if (array[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      return -1;
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Jump Search
  jumpSearch: {
    name: 'Jump Search',
    description: 'A search algorithm that works on sorted arrays by jumping ahead by fixed steps and then performing a linear search.',
    getAnimationFrames: (array, target) => {
      const frames = [];
      const n = array.length;
      const step = Math.floor(Math.sqrt(n));
      
      let prev = 0;
      
      // Check if target is greater than the last element in the array
      if (target > array[n - 1]) {
        frames.push({
          type: 'compare',
          indices: [n - 1],
          array,
        });
        frames.push({
          type: 'not-found',
          indices: [],
          array,
        });
        return frames;
      }
      
      // Finding the block where the element may be present
      while (prev < n && array[Math.min(step, n) - 1] < target) {
        // Add frame for current block check
        frames.push({
          type: 'compare',
          indices: [Math.min(step, n) - 1],
          array,
        });
        
        prev = step;
        step += Math.floor(Math.sqrt(n));
        
        if (prev >= n) {
          // Target not found
          frames.push({
            type: 'not-found',
            indices: [],
            array,
          });
          return frames;
        }
      }
      
      // Doing a linear search in the identified block
      let linearSearchLimit = Math.min(step, n);
      for (let i = prev; i < linearSearchLimit; i++) {
        // Add frame for current element being checked
        frames.push({
          type: 'compare',
          indices: [i],
          array,
        });
        
        if (array[i] === target) {
          // Target found
          frames.push({
            type: 'found',
            indices: [i],
            array,
          });
          return frames;
        }
        
        // If we encounter a value greater than the target, we know the target is not in the array
        if (array[i] > target) {
          frames.push({
            type: 'not-found',
            indices: [],
            array,
          });
          return frames;
        }
      }
      
      // Target not found
      frames.push({
        type: 'not-found',
        indices: [],
        array,
      });
      
      return frames;
    },
    execute: (array, target) => {
      const n = array.length;
      const step = Math.floor(Math.sqrt(n));
      
      let prev = 0;
      
      // Check if target is greater than the last element in the array
      if (target > array[n - 1]) {
        return -1;
      }
      
      while (prev < n && array[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        
        if (prev >= n) {
          return -1;
        }
      }
      
      // Linear search in the identified block
      let linearSearchLimit = Math.min(step, n);
      for (let i = prev; i < linearSearchLimit; i++) {
        if (array[i] === target) {
          return i;
        }
        
        // If we encounter a value greater than the target, we know the target is not in the array
        if (array[i] > target) {
          return -1;
        }
      }
      
      return -1;
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(√n)',
      worst: 'O(√n)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Interpolation Search
  interpolationSearch: {
    name: 'Interpolation Search',
    description: 'An improved variant of binary search that works on uniformly distributed sorted arrays. It uses a formula to estimate the position of the target element.',
    getAnimationFrames: (array, target) => {
      const frames = [];
      let left = 0;
      let right = array.length - 1;
      
      // Early check if the array is empty
      if (array.length === 0) {
        frames.push({
          type: 'not-found',
          indices: [],
          array,
        });
        return frames;
      }
      
      // Check if target is outside the array bounds
      if (target < array[0] || target > array[array.length - 1]) {
        frames.push({
          type: 'compare',
          indices: [0],
          array,
        });
        frames.push({
          type: 'compare',
          indices: [array.length - 1],
          array,
        });
        frames.push({
          type: 'not-found',
          indices: [],
          array,
        });
        return frames;
      }
      
      while (
        left <= right &&
        target >= array[left] &&
        target <= array[right]
      ) {
        if (left === right) {
          if (array[left] === target) {
            // Target found
            frames.push({
              type: 'found',
              indices: [left],
              array,
            });
          } else {
            // Target not found
            frames.push({
              type: 'not-found',
              indices: [],
              array,
            });
          }
          return frames;
        }
        
        // Check for division by zero (when all elements are equal)
        if (array[right] === array[left]) {
          // If target equals the common value, it can be anywhere, so check left first
          if (array[left] === target) {
            frames.push({
              type: 'compare',
              indices: [left],
              array,
            });
            
            frames.push({
              type: 'found',
              indices: [left],
              array,
            });
            return frames;
          } else {
            frames.push({
              type: 'compare',
              indices: [left],
              array,
            });
            
            frames.push({
              type: 'not-found',
              indices: [],
              array,
            });
            return frames;
          }
        }
        
        // Calculate the probable position using the interpolation formula
        const pos = left + Math.floor(
          ((right - left) / (array[right] - array[left])) *
            (target - array[left])
        );
        
        // Ensure pos is within bounds
        const safePos = Math.max(left, Math.min(right, pos));
        
        // Add frame for current position
        frames.push({
          type: 'compare',
          indices: [safePos],
          array,
        });
        
        if (array[safePos] === target) {
          // Target found
          frames.push({
            type: 'found',
            indices: [safePos],
            array,
          });
          return frames;
        }
        
        if (array[safePos] < target) {
          // Target is in the right sub-array
          left = safePos + 1;
        } else {
          // Target is in the left sub-array
          right = safePos - 1;
        }
      }
      
      // Target not found
      frames.push({
        type: 'not-found',
        indices: [],
        array,
      });
      
      return frames;
    },
    execute: (array, target) => {
      let left = 0;
      let right = array.length - 1;
      
      // Early check if the array is empty
      if (array.length === 0) {
        return -1;
      }
      
      // Check if target is outside the array bounds
      if (target < array[0] || target > array[array.length - 1]) {
        return -1;
      }
      
      while (
        left <= right &&
        target >= array[left] &&
        target <= array[right]
      ) {
        if (left === right) {
          return array[left] === target ? left : -1;
        }
        
        // Check for division by zero (when all elements are equal)
        if (array[right] === array[left]) {
          return array[left] === target ? left : -1;
        }
        
        const pos = left + Math.floor(
          ((right - left) / (array[right] - array[left])) *
            (target - array[left])
        );
        
        // Ensure pos is within bounds
        const safePos = Math.max(left, Math.min(right, pos));
        
        if (array[safePos] === target) {
          return safePos;
        }
        
        if (array[safePos] < target) {
          left = safePos + 1;
        } else {
          right = safePos - 1;
        }
      }
      
      return -1;
    },
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log log n)',
      worst: 'O(n)',
    },
    spaceComplexity: 'O(1)',
  },
};

const SearchVisualizer = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [animationFrames, setAnimationFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [algorithm, setAlgorithm] = useState('linearSearch');
  const [speed, setSpeed] = useState(50); // Animation speed (0-100)
  const [message, setMessage] = useState('');
  const [compareIndices, setCompareIndices] = useState([]);
  const [rangeIndices, setRangeIndices] = useState([]);
  const [foundIndex, setFoundIndex] = useState(null);
  
  const animationRef = useRef(null);
  
  // Generate a sorted random array
  const generateRandomArray = (size = 15) => {
    let newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 100));
    }
    
    // Sort the array (required for binary and other searches)
    newArray.sort((a, b) => a - b);
    
    setArray(newArray);
    resetAnimation();
    setMessage(`Generated a sorted random array with ${size} elements`);
  };
  
  // Initialize with a random array
  useEffect(() => {
    generateRandomArray();
  }, []);
  
  // Reset animation state
  const resetAnimation = () => {
    setAnimationFrames([]);
    setCurrentFrame(0);
    setIsAnimating(false);
    setCompareIndices([]);
    setRangeIndices([]);
    setFoundIndex(null);
    setSearchResult(null);
  };
  
  // Handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetAnimation();
    setMessage(`Selected ${searchAlgorithms[e.target.value].name}`);
  };
  
  // Handle target value change
  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    resetAnimation();
  };
  
  // Execute search
  const executeSearch = () => {
    setFoundIndex(null); // Reset the found index at the beginning of a new search
    if (!target || isNaN(parseInt(target))) {
      setMessage('Please enter a valid target value');
      return;
    }
    
    const targetValue = parseInt(target);
    resetAnimation();
    
    // Log for debugging
    console.log(`Searching for target: ${targetValue} in array:`, array);
    
    // Generate animation frames
    const frames = searchAlgorithms[algorithm].getAnimationFrames(array, targetValue);
    setAnimationFrames(frames);
    
    // Execute the search algorithm
    const result = searchAlgorithms[algorithm].execute(array, targetValue);
    setSearchResult(result);
    
    console.log(`Search result: ${result}`);
    console.log('Animation frames:', frames);
    
    // Start animation
    startAnimation(frames);
  };
  
  const startAnimation = (frames) => {
    if (frames.length === 0) {
      setMessage('No frames to animate. Please try again with a different target.');
      return;
    }
    
    setIsAnimating(true);
    setMessage(`Visualizing ${searchAlgorithms[algorithm].name}...`);
    setCurrentFrame(0); // Start from the beginning
    
    // Start animation loop
    const animate = () => {
      setCurrentFrame((prevFrame) => {
        // Process the current frame
        const frame = frames[prevFrame];
        
        if (frame) {
          switch (frame.type) {
            case 'compare':
              setCompareIndices(frame.indices);
              setRangeIndices([]);
              setFoundIndex(null);
              break;
            case 'range':
              setRangeIndices(frame.indices);
              setCompareIndices([frame.indices[1]]); // middle element
              setFoundIndex(null);
              break;
            case 'found':
              setCompareIndices([]);
              setRangeIndices([]);
              setFoundIndex(frame.indices[0]);
              break;
            case 'not-found':
              setCompareIndices([]);
              setRangeIndices([]);
              setFoundIndex(null);
              break;
            default:
              break;
          }
        }
        
        // Check if animation is complete
        const nextFrame = prevFrame + 1;
        if (nextFrame >= frames.length) {
          setTimeout(() => {
            setIsAnimating(false);
            
            if (frames[frames.length - 1].type === 'found') {
              setMessage(`Target found at index ${foundIndex !== null ? foundIndex : searchResult}`);
            } else {
              setMessage('Target not found in the array');
            }
          }, 1000); // Show the final state for a second
          
          return prevFrame; // Keep the same frame (the last one)
        }
        
        return nextFrame; // Advance to next frame
      });
      
      // Calculate delay based on speed (inverted: higher speed = lower delay)
      const delay = 1000 - (speed * 9);
      animationRef.current = setTimeout(animate, delay);
    };
    
    // Process the first frame immediately
    if (frames.length > 0) {
      const frame = frames[0];
      switch (frame.type) {
        case 'compare':
          setCompareIndices(frame.indices);
          break;
        case 'range':
          setRangeIndices(frame.indices);
          setCompareIndices([frame.indices[1]]);
          break;
        default:
          break;
      }
    }
    
    // Start animation with a slight delay
    setTimeout(animate, 500);
  };
  
  // Pause the animation
  const pauseAnimation = () => {
    setIsAnimating(false);
    clearTimeout(animationRef.current);
    setMessage(`${searchAlgorithms[algorithm].name} paused`);
  };
  
  // Reset and stop the animation
  const resetVisualization = () => {
    pauseAnimation();
    resetAnimation();
    // Force re-render by creating a new array with the same values
    setArray([...array]);
    setMessage('Visualization reset');
  };
  
  // Hard reset - create a new array
  const hardReset = () => {
    pauseAnimation();
    resetAnimation();
    generateRandomArray(array.length);
    setMessage('Hard reset completed - generated new array');
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimeout(animationRef.current);
    };
  }, []);
  
  // Get class name for array elements based on their state
  const getElementClassName = (index) => {
    let className = 'array-element';
    
    if (foundIndex === index) {
      className += ' success-animation';
    } else if (compareIndices.includes(index)) {
      className += ' search-animation';
    } else if (rangeIndices.length > 0 && index >= rangeIndices[0] && index <= rangeIndices[2]) {
      className += ' range-highlight';
    }
    
    return className;
  };
  
  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Search Algorithms Visualizer</h1>
      <p className="visualizer-description">
        Visualize and compare different search algorithms and their performance.
        Select an algorithm, enter a target value, and watch the search process step by step.
      </p>
      
      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Array</h3>
          <div className="control-row">
            <button className="btn" onClick={() => generateRandomArray(10)}>
              Small Array (10)
            </button>
            <button className="btn" onClick={() => generateRandomArray(20)}>
              Medium Array (20)
            </button>
            <button className="btn" onClick={() => generateRandomArray(50)}>
              Large Array (50)
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Algorithm</h3>
          <div className="control-row">
            <select value={algorithm} onChange={handleAlgorithmChange}>
              {Object.keys(searchAlgorithms).map((key) => (
                <option key={key} value={key}>
                  {searchAlgorithms[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Search</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Target value"
              value={target}
              onChange={handleTargetChange}
            />
            <button 
              className={`btn ${target && !isAnimating ? 'btn-ready' : ''}`} 
              onClick={executeSearch} 
              disabled={isAnimating || !target}
            >
              {isAnimating ? 'Running...' : (target ? 'Search' : 'Enter Target')}
            </button>
            {isAnimating && (
              <button className="btn btn-secondary" onClick={pauseAnimation}>
                Pause
              </button>
            )}
            <button className="btn btn-secondary" onClick={resetVisualization}>
              Reset
            </button>
            <button className="btn btn-secondary" onClick={hardReset}>
              Hard Reset
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
      </div>
      
      {/* Message box and instructions */}
      {message && <div className="message">{message}</div>}
      
      {/* Animation instructions */}
      <div className="instructions">
        <p><strong>How to use:</strong></p>
        <ol>
          <li>Select an array size from the buttons above</li>
          <li>Choose a search algorithm from the dropdown</li>
          <li>Enter a target value to search for</li>
          <li>Click the "Search" button to start the animation</li>
        </ol>
        <p><strong>Color guide:</strong></p>
        <ul>
          <li><span style={{ color: '#ff9800' }}>Orange</span> = Currently examining this element</li>
          <li><span style={{ color: '#2196f3' }}>Blue highlight</span> = Current search range (Binary Search)</li>
          <li><span style={{ color: '#4caf50' }}>Green</span> = Target found at this position</li>
        </ul>
        <p><strong>Troubleshooting:</strong> If the animation doesn't work as expected, try regenerating the array and searching again.</p>
      </div>
      
      {/* Visualization area */}
      <div className="visualization-area">
        <div className="array-container">
          {array.map((value, index) => (
            <div
              key={index}
              className={getElementClassName(index)}
              style={{
                width: `${Math.max(30, Math.min(60, 800 / array.length - 4))}px`,
                height: `${Math.max(30, Math.min(60, 800 / array.length - 4))}px`,
                fontSize: array.length > 30 ? '10px' : 'inherit'
              }}
            >
              {value}
              {array.length <= 20 && <div className="element-index">{index}</div>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Algorithm Information */}
      <div className="algorithm-info">
        <h3>{searchAlgorithms[algorithm].name}</h3>
        <p>{searchAlgorithms[algorithm].description}</p>
        
        {/* Complexity information */}
        <div className="complexity-info">
          <h4>Time Complexity</h4>
          <table className="complexity-table">
            <thead>
              <tr>
                <th>Best Case</th>
                <th>Average Case</th>
                <th>Worst Case</th>
                <th>Space Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchAlgorithms[algorithm].timeComplexity.best}</td>
                <td>{searchAlgorithms[algorithm].timeComplexity.average}</td>
                <td>{searchAlgorithms[algorithm].timeComplexity.worst}</td>
                <td>{searchAlgorithms[algorithm].spaceComplexity}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {algorithm === 'binarySearch' && (
          <div className="note">
            <p><strong>Note:</strong> Binary Search requires a sorted array to work correctly.</p>
          </div>
        )}
        
        {(algorithm === 'jumpSearch' || algorithm === 'interpolationSearch') && (
          <div className="note">
            <p><strong>Note:</strong> This search algorithm requires a sorted array to work correctly.</p>
          </div>
        )}
      </div>
      
      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
          {algorithm === 'linearSearch' && `
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    // If the current element is equal to the target
    if (arr[i] === target) {
      return i; // Return the index where target is found
    }
  }
  
  return -1; // Target not found
}`}
          
          {algorithm === 'binarySearch' && `
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Find the middle element
    const mid = Math.floor((left + right) / 2);
    
    // If target is found at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target is greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    }
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`}
          
          {algorithm === 'jumpSearch' && `
function jumpSearch(arr, target) {
  const n = arr.length;
  
  // Finding the block size to be jumped
  const step = Math.floor(Math.sqrt(n));
  
  // Finding the block where the target may be present
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    
    // If out of bounds, target not in array
    if (prev >= n) {
      return -1;
    }
  }
  
  // Linear search in the identified block
  while (arr[prev] < target) {
    prev++;
    
    // If we reached the next block or end of array
    if (prev == Math.min(step, n)) {
      return -1;
    }
  }
  
  // If the element is found
  if (arr[prev] === target) {
    return prev;
  }
  
  return -1; // Target not found
}`}
          
          {algorithm === 'interpolationSearch' && `
function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (
    left <= right && 
    target >= arr[left] && 
    target <= arr[right]
  ) {
    // If there is only one element
    if (left === right) {
      if (arr[left] === target) return left;
      return -1;
    }
    
    // Estimate the position using interpolation formula
    const pos = left + Math.floor(
      ((right - left) / (arr[right] - arr[left])) * 
      (target - arr[left])
    );
    
    // If target is found
    if (arr[pos] === target) {
      return pos;
    }
    
    // If target is larger, target is in right sub-array
    if (arr[pos] < target) {
      left = pos + 1;
    }
    // If target is smaller, target is in left sub-array
    else {
      right = pos - 1;
    }
  }
  
  return -1; // Target not found
}`}
        </pre>
      </div>
    </div>
  );
};

export default SearchVisualizer;