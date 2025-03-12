import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

// Sorting algorithms
const sortingAlgorithms = {
  // Bubble Sort
  bubbleSort: {
    name: 'Bubble Sort',
    description: 'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    getAnimationFrames: (array) => {
      const frames = [];
      const arrayCopy = [...array];
      const n = arrayCopy.length;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          // Add frame for comparison (highlighting elements being compared)
          frames.push({
            type: 'compare',
            indices: [j, j + 1],
            array: [...arrayCopy],
          });
          
          if (arrayCopy[j] > arrayCopy[j + 1]) {
            // Swap elements
            [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
            
            // Add frame for swap
            frames.push({
              type: 'swap',
              indices: [j, j + 1],
              array: [...arrayCopy],
            });
          }
        }
        
        // Mark the last - i element as sorted
        frames.push({
          type: 'sorted',
          indices: [n - i - 1],
          array: [...arrayCopy],
        });
      }
      
      // Mark the first element as sorted (last iteration)
      frames.push({
        type: 'sorted',
        indices: [0],
        array: [...arrayCopy],
      });
      
      return frames;
    },
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Selection Sort
  selectionSort: {
    name: 'Selection Sort',
    description: 'A simple comparison-based sorting algorithm that divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
    getAnimationFrames: (array) => {
      const frames = [];
      const arrayCopy = [...array];
      const n = arrayCopy.length;
      
      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // Add frame for current position
        frames.push({
          type: 'position',
          indices: [i],
          array: [...arrayCopy],
        });
        
        for (let j = i + 1; j < n; j++) {
          // Add frame for comparison
          frames.push({
            type: 'compare',
            indices: [minIndex, j],
            array: [...arrayCopy],
          });
          
          if (arrayCopy[j] < arrayCopy[minIndex]) {
            minIndex = j;
          }
        }
        
        if (minIndex !== i) {
          // Add frame before swap
          frames.push({
            type: 'swap',
            indices: [i, minIndex],
            array: [...arrayCopy],
          });
          
          // Swap elements
          [arrayCopy[i], arrayCopy[minIndex]] = [arrayCopy[minIndex], arrayCopy[i]];
          
          // Add frame after swap
          frames.push({
            type: 'swap',
            indices: [i, minIndex],
            array: [...arrayCopy],
          });
        }
        
        // Mark the element at position i as sorted
        frames.push({
          type: 'sorted',
          indices: [i],
          array: [...arrayCopy],
        });
      }
      
      // Mark the last element as sorted
      frames.push({
        type: 'sorted',
        indices: [n - 1],
        array: [...arrayCopy],
      });
      
      return frames;
    },
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Insertion Sort
  insertionSort: {
    name: 'Insertion Sort',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time, by inserting each unsorted element into its correct position among the previously sorted elements.',
    getAnimationFrames: (array) => {
      const frames = [];
      const arrayCopy = [...array];
      const n = arrayCopy.length;
      
      // Mark the first element as sorted
      frames.push({
        type: 'sorted',
        indices: [0],
        array: [...arrayCopy],
      });
      
      for (let i = 1; i < n; i++) {
        const key = arrayCopy[i];
        let j = i - 1;
        
        // Highlight the current element to be inserted
        frames.push({
          type: 'position',
          indices: [i],
          array: [...arrayCopy],
        });
        
        while (j >= 0 && arrayCopy[j] > key) {
          // Compare current element with the element at position j
          frames.push({
            type: 'compare',
            indices: [j, j + 1],
            array: [...arrayCopy],
          });
          
          // Move elements that are greater than key one position ahead
          arrayCopy[j + 1] = arrayCopy[j];
          
          // Show the shift
          frames.push({
            type: 'swap',
            indices: [j, j + 1],
            array: [...arrayCopy],
          });
          
          j--;
        }
        
        arrayCopy[j + 1] = key;
        
        // Show the insertion
        frames.push({
          type: 'insert',
          indices: [j + 1],
          array: [...arrayCopy],
        });
        
        // Mark elements up to index i as sorted
        for (let k = 0; k <= i; k++) {
          frames.push({
            type: 'sorted',
            indices: [k],
            array: [...arrayCopy],
          });
        }
      }
      
      return frames;
    },
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
  },
  
  // Merge Sort
  mergeSort: {
    name: 'Merge Sort',
    description: 'An efficient, comparison-based, divide and conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    getAnimationFrames: (array) => {
      const frames = [];
      const arrayCopy = [...array];
      
      const merge = (arr, left, mid, right) => {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        
        // Create temporary arrays
        const L = new Array(n1);
        const R = new Array(n2);
        
        // Copy data to temporary arrays L[] and R[]
        for (let i = 0; i < n1; i++) {
          L[i] = arr[left + i];
        }
        for (let j = 0; j < n2; j++) {
          R[j] = arr[mid + 1 + j];
        }
        
        // Merge the temporary arrays back into arr[left..right]
        let i = 0; // Initial index of first subarray
        let j = 0; // Initial index of second subarray
        let k = left; // Initial index of merged subarray
        
        while (i < n1 && j < n2) {
          // Compare elements from both subarrays
          frames.push({
            type: 'compare',
            indices: [left + i, mid + 1 + j],
            array: [...arr],
          });
          
          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          
          // Show the placement in the merged array
          frames.push({
            type: 'insert',
            indices: [k],
            array: [...arr],
          });
          
          k++;
        }
        
        // Copy the remaining elements of L[], if any
        while (i < n1) {
          arr[k] = L[i];
          
          // Show the placement in the merged array
          frames.push({
            type: 'insert',
            indices: [k],
            array: [...arr],
          });
          
          i++;
          k++;
        }
        
        // Copy the remaining elements of R[], if any
        while (j < n2) {
          arr[k] = R[j];
          
          // Show the placement in the merged array
          frames.push({
            type: 'insert',
            indices: [k],
            array: [...arr],
          });
          
          j++;
          k++;
        }
      };
      
      const mergeSortHelper = (arr, left, right) => {
        if (left < right) {
          // Same as (left + right) / 2, but avoids overflow
          const mid = left + Math.floor((right - left) / 2);
          
          // Show the division
          frames.push({
            type: 'divide',
            indices: [left, mid, right],
            array: [...arr],
          });
          
          // Sort first and second halves
          mergeSortHelper(arr, left, mid);
          mergeSortHelper(arr, mid + 1, right);
          
          // Merge the sorted halves
          merge(arr, left, mid, right);
          
          // Mark the merged section as sorted
          for (let i = left; i <= right; i++) {
            frames.push({
              type: 'sorted',
              indices: [i],
              array: [...arr],
            });
          }
        }
      };
      
      mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1);
      
      return frames;
    },
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
  },
  
  // Quick Sort
  quickSort: {
    name: 'Quick Sort',
    description: 'An efficient, comparison-based, divide and conquer sorting algorithm that selects a "pivot" element and partitions the array around the pivot, such that elements less than the pivot are on the left and elements greater than the pivot are on the right.',
    getAnimationFrames: (array) => {
      const frames = [];
      const arrayCopy = [...array];
      
      const partition = (arr, low, high) => {
        // Choose the rightmost element as pivot
        const pivot = arr[high];
        
        // Highlight the pivot
        frames.push({
          type: 'pivot',
          indices: [high],
          array: [...arr],
        });
        
        // Index of smaller element
        let i = low - 1;
        
        for (let j = low; j <= high - 1; j++) {
          // Compare current element with pivot
          frames.push({
            type: 'compare',
            indices: [j, high],
            array: [...arr],
          });
          
          // If current element is smaller than the pivot
          if (arr[j] < pivot) {
            i++;
            
            // Swap elements
            if (i !== j) {
              frames.push({
                type: 'swap',
                indices: [i, j],
                array: [...arr],
              });
              
              [arr[i], arr[j]] = [arr[j], arr[i]];
              
              frames.push({
                type: 'swap',
                indices: [i, j],
                array: [...arr],
              });
            }
          }
        }
        
        // Swap pivot element with element at i+1
        if (i + 1 !== high) {
          frames.push({
            type: 'swap',
            indices: [i + 1, high],
            array: [...arr],
          });
          
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          
          frames.push({
            type: 'swap',
            indices: [i + 1, high],
            array: [...arr],
          });
        }
        
        // Mark the pivot as in its correct position
        frames.push({
          type: 'sorted',
          indices: [i + 1],
          array: [...arr],
        });
        
        return i + 1;
      };
      
      const quickSortHelper = (arr, low, high) => {
        if (low < high) {
          // Partition the array and get the pivot index
          const pivotIndex = partition(arr, low, high);
          
          // Recursively sort elements before and after the pivot
          quickSortHelper(arr, low, pivotIndex - 1);
          quickSortHelper(arr, pivotIndex + 1, high);
        } else if (low === high) {
          // Single element is always sorted
          frames.push({
            type: 'sorted',
            indices: [low],
            array: [...arr],
          });
        }
      };
      
      quickSortHelper(arrayCopy, 0, arrayCopy.length - 1);
      
      return frames;
    },
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
  },
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [animationFrames, setAnimationFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [speed, setSpeed] = useState(50); // Animation speed (0-100)
  const [message, setMessage] = useState('');
  const [sortedIndices, setSortedIndices] = useState([]);
  const [comparedIndices, setComparedIndices] = useState([]);
  const [pivotIndices, setPivotIndices] = useState([]);
  
  const animationRef = useRef(null);
  
  // Generate a random array
  const generateRandomArray = (size = 15) => {
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5); // Values between 5 and 104
    }
    
    setArray(newArray);
    resetAnimation();
    setMessage(`Generated a random array with ${size} elements`);
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
    setSortedIndices([]);
    setComparedIndices([]);
    setPivotIndices([]);
  };
  
  // Handle algorithm selection
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetAnimation();
    setMessage(`Selected ${sortingAlgorithms[e.target.value].name}`);
  };
  
  // Start the animation
  const startAnimation = () => {
    if (isAnimating) return;
    
    // Generate animation frames if not already generated
    if (animationFrames.length === 0) {
      const frames = sortingAlgorithms[algorithm].getAnimationFrames(array);
      setAnimationFrames(frames);
    }
    
    setIsAnimating(true);
    setMessage(`Visualizing ${sortingAlgorithms[algorithm].name}...`);
    
    // Start animation loop
    const animate = () => {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + 1;
        
        // Check if animation is complete
        if (nextFrame >= animationFrames.length) {
          setIsAnimating(false);
          setMessage(`${sortingAlgorithms[algorithm].name} completed!`);
          return prevFrame;
        }
        
        // Process the next frame
        const frame = animationFrames[nextFrame];
        
        switch (frame.type) {
          case 'compare':
            setComparedIndices(frame.indices);
            setPivotIndices([]);
            break;
          case 'swap':
            setComparedIndices(frame.indices);
            break;
          case 'sorted':
            setSortedIndices((prev) => [...prev, ...frame.indices]);
            setComparedIndices([]);
            setPivotIndices([]);
            break;
          case 'pivot':
            setPivotIndices(frame.indices);
            setComparedIndices([]);
            break;
          case 'insert':
          case 'position':
          case 'divide':
            setComparedIndices(frame.indices);
            setPivotIndices([]);
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
    setMessage(`${sortingAlgorithms[algorithm].name} paused`);
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
  
  // Update array display when frame changes
  useEffect(() => {
    if (currentFrame > 0 && currentFrame < animationFrames.length) {
      setArray(animationFrames[currentFrame].array);
    }
  }, [currentFrame, animationFrames]);
  
  // Get class name for array bars based on their state
  const getBarClassName = (index) => {
    let className = 'array-bar';
    
    if (sortedIndices.includes(index)) {
      className += ' sorted-bar';
    } else if (comparedIndices.includes(index)) {
      className += ' compared-bar';
    } else if (pivotIndices.includes(index)) {
      className += ' pivot-bar';
    }
    
    return className;
  };
  
  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Sorting Visualizer</h1>
      <p className="visualizer-description">
        Visualize and compare different sorting algorithms and their performance.
        Select an algorithm, adjust the speed, and watch the sorting process step by step.
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
            <button className="btn" onClick={() => generateRandomArray(30)}>
              Large Array (30)
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <h3>Algorithm</h3>
          <div className="control-row">
            <select value={algorithm} onChange={handleAlgorithmChange}>
              {Object.keys(sortingAlgorithms).map((key) => (
                <option key={key} value={key}>
                  {sortingAlgorithms[key].name}
                </option>
              ))}
            </select>
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
            {!isAnimating ? (
              <button className="btn" onClick={startAnimation} disabled={currentFrame === animationFrames.length}>
                {currentFrame === 0 ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button className="btn" onClick={pauseAnimation}>
                Pause
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
        <div className="array-container sorting-container">
          {array.map((value, index) => (
            <div
              key={index}
              className={getBarClassName(index)}
              style={{
                height: `${value * 3}px`,
                width: `${Math.max(8, 800 / array.length - 4)}px`,
              }}
            >
              {array.length <= 20 && <span className="bar-value">{value}</span>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Algorithm Information */}
      <div className="algorithm-info">
        <h3>{sortingAlgorithms[algorithm].name}</h3>
        <p>{sortingAlgorithms[algorithm].description}</p>
        
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
                <td>{sortingAlgorithms[algorithm].timeComplexity.best}</td>
                <td>{sortingAlgorithms[algorithm].timeComplexity.average}</td>
                <td>{sortingAlgorithms[algorithm].timeComplexity.worst}</td>
                <td>{sortingAlgorithms[algorithm].spaceComplexity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
          {algorithm === 'bubbleSort' && `
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Last i elements are already sorted
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in the wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`}
          
          {algorithm === 'selectionSort' && `
function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the element at index i
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`}
          
          {algorithm === 'insertionSort' && `
function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    // Store the current element to be inserted
    const key = arr[i];
    
    // Find the position where the key should be inserted
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      // Move elements that are greater than key one position ahead
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert the key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}`}
          
          {algorithm === 'mergeSort' && `
function mergeSort(arr) {
  // Base case: array with 0 or 1 element is already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide the array into two halves
  const mid = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);
  
  // Recursively sort both halves
  const sortedLeft = mergeSort(leftArr);
  const sortedRight = mergeSort(rightArr);
  
  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add the smaller one to result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from either array
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`}
          
          {algorithm === 'quickSort' && `
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after the pivot
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  
  // Index of smaller element
  let i = low - 1;
  
  for (let j = low; j <= high - 1; j++) {
    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      i++;
      // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Swap pivot element with element at i+1
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; // Return the pivot index
}`}
        </pre>
      </div>
    </div>
  );
};

export default SortingVisualizer;