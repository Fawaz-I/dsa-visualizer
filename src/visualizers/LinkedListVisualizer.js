import React, { useState, useEffect } from 'react';
import './Visualizer.css';

// Class representation of a linked list node
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Class representation of a linked list
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Add a node to the end of the list
  append(value) {
    const newNode = new ListNode(value);
    this.size++;
    
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  // Add a node to the beginning of the list
  prepend(value) {
    const newNode = new ListNode(value);
    this.size++;
    
    newNode.next = this.head;
    this.head = newNode;
  }

  // Insert a node at a specific position
  insertAt(value, position) {
    if (position < 0 || position > this.size) {
      return false;
    }
    
    if (position === 0) {
      this.prepend(value);
      return true;
    }
    
    if (position === this.size) {
      this.append(value);
      return true;
    }
    
    const newNode = new ListNode(value);
    let current = this.head;
    let index = 0;
    
    while (index < position - 1) {
      current = current.next;
      index++;
    }
    
    newNode.next = current.next;
    current.next = newNode;
    this.size++;
    return true;
  }

  // Remove a node from a specific position
  removeAt(position) {
    if (position < 0 || position >= this.size || !this.head) {
      return null;
    }
    
    let removedNode;
    
    if (position === 0) {
      removedNode = this.head;
      this.head = this.head.next;
    } else {
      let current = this.head;
      let index = 0;
      
      while (index < position - 1) {
        current = current.next;
        index++;
      }
      
      removedNode = current.next;
      current.next = removedNode.next;
    }
    
    this.size--;
    return removedNode.value;
  }

  // Search for a value in the list
  search(value) {
    let current = this.head;
    let index = 0;
    
    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }
    
    return -1;
  }

  // Convert the linked list to an array for visualization
  toArray() {
    const result = [];
    let current = this.head;
    
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    
    return result;
  }
}

const LinkedListVisualizer = () => {
  const [linkedList, setLinkedList] = useState(new LinkedList());
  const [listArray, setListArray] = useState([]);
  const [value, setValue] = useState('');
  const [position, setPosition] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [visualState, setVisualState] = useState({
    highlightedIndices: [],
    animation: null,
  });

  // Update the array representation whenever the linked list changes
  useEffect(() => {
    setListArray(linkedList.toArray());
  }, [linkedList]);

  // Initialize with some random values
  useEffect(() => {
    generateRandomList();
  }, []);

  const generateRandomList = () => {
    const newList = new LinkedList();
    const size = Math.floor(Math.random() * 5) + 3; // 3-7 elements
    
    for (let i = 0; i < size; i++) {
      newList.append(Math.floor(Math.random() * 100));
    }
    
    setLinkedList(newList);
    setMessage('New random linked list created');
    resetVisualState();
  };

  const resetVisualState = () => {
    setVisualState({
      highlightedIndices: [],
      animation: null,
    });
  };

  const handleAppend = () => {
    if (value === '' || isNaN(parseInt(value))) {
      setMessage('Please enter a valid number');
      return;
    }

    const newValue = parseInt(value);
    
    // Highlight the last node to show where we're adding
    if (listArray.length > 0) {
      setVisualState({
        highlightedIndices: [listArray.length - 1],
        animation: 'search',
      });
    }

    // After a delay, add the new node and highlight it
    setTimeout(() => {
      const newList = { ...linkedList };
      newList.append(newValue);
      setLinkedList(newList);
      
      setTimeout(() => {
        setVisualState({
          highlightedIndices: [listArray.length],
          animation: 'insert',
        });
        
        setMessage(`Appended ${newValue} to the end of the list`);
        setValue('');
        
        setTimeout(resetVisualState, 1000);
      }, 300);
    }, 1000);
  };

  const handlePrepend = () => {
    if (value === '' || isNaN(parseInt(value))) {
      setMessage('Please enter a valid number');
      return;
    }

    const newValue = parseInt(value);
    
    // Highlight the head to show where we're adding
    if (listArray.length > 0) {
      setVisualState({
        highlightedIndices: [0],
        animation: 'search',
      });
    }

    // After a delay, add the new node and highlight it
    setTimeout(() => {
      const newList = { ...linkedList };
      newList.prepend(newValue);
      setLinkedList(newList);
      
      setTimeout(() => {
        setVisualState({
          highlightedIndices: [0],
          animation: 'insert',
        });
        
        setMessage(`Prepended ${newValue} to the beginning of the list`);
        setValue('');
        
        setTimeout(resetVisualState, 1000);
      }, 300);
    }, 1000);
  };

  const handleInsertAt = () => {
    if (value === '' || isNaN(parseInt(value))) {
      setMessage('Please enter a valid number');
      return;
    }

    if (position === '' || isNaN(parseInt(position))) {
      setMessage('Please enter a valid position');
      return;
    }

    const newValue = parseInt(value);
    const pos = parseInt(position);

    if (pos < 0 || pos > linkedList.size) {
      setMessage(`Position out of bounds. Valid range: 0 to ${linkedList.size}`);
      return;
    }

    // Visualize finding the position
    const animateSearch = (currentIndex = 0) => {
      if (currentIndex > pos) {
        // Insertion animation
        const newList = { ...linkedList };
        const success = newList.insertAt(newValue, pos);
        
        if (success) {
          setLinkedList(newList);
          
          setTimeout(() => {
            setVisualState({
              highlightedIndices: [pos],
              animation: 'insert',
            });
            
            setMessage(`Inserted ${newValue} at position ${pos}`);
            setValue('');
            setPosition('');
            
            setTimeout(resetVisualState, 1000);
          }, 300);
        } else {
          setMessage('Failed to insert at the specified position');
        }
        
        return;
      }

      // Highlight current node during search
      setVisualState({
        highlightedIndices: [currentIndex],
        animation: 'search',
      });

      setTimeout(() => {
        animateSearch(currentIndex + 1);
      }, 300);
    };

    animateSearch();
  };

  const handleRemoveAt = () => {
    if (position === '' || isNaN(parseInt(position))) {
      setMessage('Please enter a valid position');
      return;
    }

    const pos = parseInt(position);

    if (pos < 0 || pos >= linkedList.size) {
      setMessage(`Position out of bounds. Valid range: 0 to ${linkedList.size - 1}`);
      return;
    }

    // Visualize finding the position
    const animateSearch = (currentIndex = 0) => {
      if (currentIndex > pos) {
        return;
      }

      // Highlight current node during search
      setVisualState({
        highlightedIndices: [currentIndex],
        animation: currentIndex === pos ? 'delete' : 'search',
      });

      if (currentIndex === pos) {
        // On reaching the node to be deleted, show delete animation
        setTimeout(() => {
          const newList = { ...linkedList };
          const removedValue = newList.removeAt(pos);
          
          if (removedValue !== null) {
            setLinkedList(newList);
            setMessage(`Removed value ${removedValue} from position ${pos}`);
            setPosition('');
          } else {
            setMessage('Failed to remove from the specified position');
          }
          
          setTimeout(resetVisualState, 1000);
        }, 1000);
      } else {
        setTimeout(() => {
          animateSearch(currentIndex + 1);
        }, 300);
      }
    };

    animateSearch();
  };

  const handleSearch = () => {
    if (searchValue === '' || isNaN(parseInt(searchValue))) {
      setMessage('Please enter a valid search value');
      return;
    }

    const valueToSearch = parseInt(searchValue);
    
    // Perform the search first to know the result
    const foundIndex = linkedList.search(valueToSearch);
    
    // Visualize the search process
    const animateSearch = (currentIndex = 0) => {
      if (currentIndex >= listArray.length) {
        setMessage(`Value ${valueToSearch} not found in the list`);
        setSearchValue('');
        setTimeout(resetVisualState, 1000);
        return;
      }

      setVisualState({
        highlightedIndices: [currentIndex],
        animation: 'search',
      });

      setTimeout(() => {
        if (currentIndex === foundIndex) {
          // Found the value
          setVisualState({
            highlightedIndices: [currentIndex],
            animation: 'success',
          });
          setMessage(`Found value ${valueToSearch} at position ${currentIndex}`);
          setSearchValue('');
          setTimeout(resetVisualState, 1500);
        } else {
          // Continue searching
          animateSearch(currentIndex + 1);
        }
      }, 500);
    };

    if (foundIndex !== -1) {
      animateSearch();
    } else {
      // If we know it's not found, still animate the whole search
      const animateFullSearch = (currentIndex = 0) => {
        if (currentIndex >= listArray.length) {
          setMessage(`Value ${valueToSearch} not found in the list`);
          setSearchValue('');
          setTimeout(resetVisualState, 1000);
          return;
        }

        setVisualState({
          highlightedIndices: [currentIndex],
          animation: 'search',
        });

        setTimeout(() => {
          animateFullSearch(currentIndex + 1);
        }, 300);
      };

      animateFullSearch();
    }
  };

  const getNodeClassName = (index) => {
    let className = 'node-content';
    
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
      <h1 className="visualizer-title">Linked List Visualizer</h1>
      <p className="visualizer-description">
        A linked list is a linear data structure where elements are not stored in contiguous memory locations.
        Each element (node) contains a data value and a reference (link) to the next node in the sequence.
      </p>

      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Create Linked List</h3>
          <div className="control-row">
            <button className="btn" onClick={generateRandomList}>
              Generate Random List
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Add/Remove Node</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="btn" onClick={handlePrepend}>
              Prepend
            </button>
            <button className="btn" onClick={handleAppend}>
              Append
            </button>
          </div>
          <div className="control-row">
            <input
              type="number"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <button className="btn" onClick={handleInsertAt}>
              Insert At
            </button>
            <button className="btn" onClick={handleRemoveAt}>
              Remove At
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Search</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Search Value"
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
        <div className="linked-list-container">
          {listArray.map((value, index) => (
            <div className="node" key={index}>
              <div className={getNodeClassName(index)}>{value}</div>
              {index < listArray.length - 1 && <div className="node-pointer"></div>}
            </div>
          ))}
          {listArray.length === 0 && <div className="empty-message">List is empty</div>}
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
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Search</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Insert at beginning</td>
              <td>O(1)</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Insert at end</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Insert at position</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Delete from beginning</td>
              <td>O(1)</td>
              <td>O(1)</td>
            </tr>
            <tr>
              <td>Delete from end</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Delete from position</td>
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
{`// Node class for a singly linked list
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// LinkedList class implementation
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // Add a node to the beginning of the list
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }
  
  // Add a node to the end of the list
  append(value) {
    const newNode = new Node(value);
    
    // If list is empty, make new node the head
    if (!this.head) {
      this.head = newNode;
    } else {
      // Traverse to the end of the list
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      // Add the new node at the end
      current.next = newNode;
    }
    
    this.size++;
  }
  
  // Insert a node at a specific position
  insertAt(value, position) {
    // Validate position
    if (position < 0 || position > this.size) {
      return false;
    }
    
    // Insert at the beginning
    if (position === 0) {
      this.prepend(value);
      return true;
    }
    
    // Insert at any other position
    const newNode = new Node(value);
    let current = this.head;
    let index = 0;
    
    // Traverse to the node just before the desired position
    while (index < position - 1) {
      current = current.next;
      index++;
    }
    
    // Insert the new node
    newNode.next = current.next;
    current.next = newNode;
    this.size++;
    
    return true;
  }
  
  // Remove a node from a specific position
  removeAt(position) {
    // Validate position
    if (position < 0 || position >= this.size || !this.head) {
      return null;
    }
    
    let removedNode;
    
    // Remove the head
    if (position === 0) {
      removedNode = this.head;
      this.head = this.head.next;
    } else {
      let current = this.head;
      let index = 0;
      
      // Traverse to the node just before the one to be removed
      while (index < position - 1) {
        current = current.next;
        index++;
      }
      
      // Remove the node
      removedNode = current.next;
      current.next = removedNode.next;
    }
    
    this.size--;
    return removedNode.value;
  }
  
  // Search for a value in the list
  search(value) {
    let current = this.head;
    let index = 0;
    
    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }
    
    return -1; // Value not found
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;