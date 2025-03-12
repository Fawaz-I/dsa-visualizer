import React, { useState, useEffect, useRef } from 'react';
import './Visualizer.css';

// Class representation of a binary tree node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Class representation of a binary search tree
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert a value into the BST
  insert(value) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    const insertNode = (node, newNode) => {
      // If value is less than node's value, go to the left
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        // If value is greater than or equal to node's value, go to the right
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };

    insertNode(this.root, newNode);
    return this;
  }

  // Search for a value in the BST
  search(value) {
    const searchNode = (node, value) => {
      if (node === null) {
        return null;
      }

      if (value === node.value) {
        return node;
      }

      if (value < node.value) {
        return searchNode(node.left, value);
      } else {
        return searchNode(node.right, value);
      }
    };

    return searchNode(this.root, value);
  }

  // Find the node with the minimum value
  findMin() {
    let current = this.root;
    
    if (!current) {
      return null;
    }
    
    while (current.left) {
      current = current.left;
    }
    
    return current.value;
  }

  // Find the node with the maximum value
  findMax() {
    let current = this.root;
    
    if (!current) {
      return null;
    }
    
    while (current.right) {
      current = current.right;
    }
    
    return current.value;
  }

  // Remove a node with the given value
  remove(value) {
    const removeNode = (node, value) => {
      if (node === null) {
        return null;
      }

      if (value < node.value) {
        node.left = removeNode(node.left, value);
        return node;
      }

      if (value > node.value) {
        node.right = removeNode(node.right, value);
        return node;
      }

      // If value equals node.value, this is the node to be removed

      // Case 1: No children
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: Only one child
      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      // Case 3: Two children
      // Find the smallest value in the right subtree
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      // Replace the node's value with the successor's value
      node.value = successor.value;

      // Remove the successor
      node.right = removeNode(node.right, successor.value);
      return node;
    };

    this.root = removeNode(this.root, value);
    return this;
  }

  // Get all values in-order (sorted)
  inOrder() {
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };

    traverse(this.root);
    return result;
  }

  // Get all values pre-order
  preOrder() {
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };

    traverse(this.root);
    return result;
  }

  // Get all values post-order
  postOrder() {
    const result = [];

    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };

    traverse(this.root);
    return result;
  }

  // Convert tree to an array of node objects with position information for visualization
  toArray() {
    if (!this.root) return [];

    const result = [];
    const queue = [{ node: this.root, level: 0, position: 0, parent: null }];

    while (queue.length > 0) {
      const { node, level, position, parent } = queue.shift();

      result.push({
        value: node.value,
        level,
        position,
        parentPosition: parent ? parent.position : null,
        parentLevel: parent ? parent.level : null,
      });

      if (node.left) {
        queue.push({
          node: node.left,
          level: level + 1,
          position: position * 2 - 1,
          parent: { position, level },
        });
      }

      if (node.right) {
        queue.push({
          node: node.right,
          level: level + 1,
          position: position * 2 + 1,
          parent: { position, level },
        });
      }
    }

    return result;
  }
}

const TreeVisualizer = () => {
  const [tree, setTree] = useState(new BinarySearchTree());
  const [treeArray, setTreeArray] = useState([]);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [traversalResult, setTraversalResult] = useState('');
  const [traversalType, setTraversalType] = useState('inOrder');
  const [visualState, setVisualState] = useState({
    highlightedValues: [],
    animation: null,
  });

  // Update the array representation whenever the tree changes
  useEffect(() => {
    setTreeArray(tree.toArray());
  }, [tree]);

  // Initialize with some random values
  useEffect(() => {
    generateRandomTree();
  }, []);

  const generateRandomTree = () => {
    const newTree = new BinarySearchTree();
    const size = Math.floor(Math.random() * 7) + 5; // 5-11 elements
    const values = [];
    
    // Generate unique random values
    while (values.length < size) {
      const randomValue = Math.floor(Math.random() * 100);
      if (!values.includes(randomValue)) {
        values.push(randomValue);
      }
    }
    
    // Insert values in a balanced way by sorting first and then using the middle as root
    values.sort((a, b) => a - b);
    
    const insertBalanced = (arr, start, end) => {
      if (start > end) return;
      
      const mid = Math.floor((start + end) / 2);
      newTree.insert(arr[mid]);
      
      insertBalanced(arr, start, mid - 1);
      insertBalanced(arr, mid + 1, end);
    };
    
    insertBalanced(values, 0, values.length - 1);
    
    setTree(newTree);
    setMessage('New random binary search tree created');
    resetVisualState();
  };

  const resetVisualState = () => {
    setVisualState({
      highlightedValues: [],
      animation: null,
    });
  };

  const handleInsert = () => {
    if (value === '' || isNaN(parseInt(value))) {
      setMessage('Please enter a valid number');
      return;
    }

    const newValue = parseInt(value);
    
    // Check if value already exists in the tree
    if (tree.search(newValue)) {
      setMessage(`Value ${newValue} already exists in the tree`);
      return;
    }

    // Visualize the insertion path
    const visualizeInsertPath = () => {
      const path = [];
      let current = tree.root;
      
      if (!current) {
        // Tree is empty, just insert
        const newTree = new BinarySearchTree();
        newTree.insert(newValue);
        setTree(newTree);
        setValue('');
        setMessage(`Inserted ${newValue} as the root node`);
        setVisualState({
          highlightedValues: [newValue],
          animation: 'insert',
        });
        setTimeout(resetVisualState, 1500);
        return;
      }
      
      // Find the path to the insertion point
      while (true) {
        path.push(current.value);
        
        if (newValue < current.value) {
          if (current.left === null) {
            break; // Insert to the left
          }
          current = current.left;
        } else {
          if (current.right === null) {
            break; // Insert to the right
          }
          current = current.right;
        }
      }
      
      // Animate the path traversal
      const animatePath = (index = 0) => {
        if (index >= path.length) {
          // Insert the value after path animation
          const newTree = { ...tree };
          newTree.insert(newValue);
          setTree(newTree);
          setValue('');
          setMessage(`Inserted ${newValue} into the tree`);
          
          setTimeout(() => {
            setVisualState({
              highlightedValues: [newValue],
              animation: 'insert',
            });
            setTimeout(resetVisualState, 1500);
          }, 500);
          
          return;
        }
        
        setVisualState({
          highlightedValues: [path[index]],
          animation: 'search',
        });
        
        setTimeout(() => {
          animatePath(index + 1);
        }, 800);
      };
      
      animatePath();
    };
    
    visualizeInsertPath();
  };

  const handleRemove = () => {
    if (value === '' || isNaN(parseInt(value))) {
      setMessage('Please enter a valid number');
      return;
    }

    const removeValue = parseInt(value);
    
    // Check if value exists in the tree
    if (!tree.search(removeValue)) {
      setMessage(`Value ${removeValue} does not exist in the tree`);
      return;
    }

    // Visualize the removal
    setVisualState({
      highlightedValues: [removeValue],
      animation: 'delete',
    });
    
    setTimeout(() => {
      const newTree = new BinarySearchTree();
      // Recreate the tree without the removed value
      tree.inOrder().forEach(val => {
        if (val !== removeValue) {
          newTree.insert(val);
        }
      });
      
      setTree(newTree);
      setValue('');
      setMessage(`Removed ${removeValue} from the tree`);
      
      setTimeout(resetVisualState, 500);
    }, 1500);
  };

  const handleSearch = () => {
    if (searchValue === '' || isNaN(parseInt(searchValue))) {
      setMessage('Please enter a valid search value');
      return;
    }

    const valueToFind = parseInt(searchValue);
    
    // Visualize the search path
    const visualizeSearchPath = () => {
      const path = [];
      let current = tree.root;
      let found = false;
      
      if (!current) {
        setMessage('Tree is empty');
        return;
      }
      
      // Find the path to the value or to where it should be
      while (current) {
        path.push(current.value);
        
        if (valueToFind === current.value) {
          found = true;
          break;
        }
        
        if (valueToFind < current.value) {
          current = current.left;
        } else {
          current = current.right;
        }
      }
      
      // Animate the path traversal
      const animatePath = (index = 0) => {
        if (index >= path.length) {
          if (found) {
            setMessage(`Found value ${valueToFind} in the tree`);
            setVisualState({
              highlightedValues: [valueToFind],
              animation: 'success',
            });
          } else {
            setMessage(`Value ${valueToFind} not found in the tree`);
          }
          
          setSearchValue('');
          setTimeout(resetVisualState, 1500);
          return;
        }
        
        setVisualState({
          highlightedValues: [path[index]],
          animation: path[index] === valueToFind && index === path.length - 1 ? 'success' : 'search',
        });
        
        setTimeout(() => {
          animatePath(index + 1);
        }, 800);
      };
      
      animatePath();
    };
    
    visualizeSearchPath();
  };

  const handleTraversal = () => {
    let result = [];
    
    switch (traversalType) {
      case 'inOrder':
        result = tree.inOrder();
        setMessage('In-order traversal: Left -> Root -> Right');
        break;
      case 'preOrder':
        result = tree.preOrder();
        setMessage('Pre-order traversal: Root -> Left -> Right');
        break;
      case 'postOrder':
        result = tree.postOrder();
        setMessage('Post-order traversal: Left -> Right -> Root');
        break;
      default:
        result = tree.inOrder();
    }
    
    setTraversalResult(result.join(', '));
    
    // Visualize the traversal
    const animateTraversal = (index = 0) => {
      if (index >= result.length) {
        setTimeout(resetVisualState, 500);
        return;
      }
      
      setVisualState({
        highlightedValues: [result[index]],
        animation: 'search',
      });
      
      setTimeout(() => {
        animateTraversal(index + 1);
      }, 800);
    };
    
    animateTraversal();
  };

  const getNodeClassName = (nodeValue) => {
    let className = 'tree-node';
    
    if (visualState.highlightedValues.includes(nodeValue)) {
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

  // Calculate maximum tree width for visualization scaling
  const maxTreeWidth = treeArray.reduce((max, node) => {
    return Math.max(max, Math.abs(node.position));
  }, 0) * 2 + 1;

  // Calculate horizontal position based on node position and level
  const getNodeLeftPosition = (position, level) => {
    const baseWidth = 50; // Base node width
    const spacing = 20; // Minimum spacing between nodes
    
    const levelWidth = Math.pow(2, level);
    const totalWidth = (baseWidth + spacing) * levelWidth;
    
    const adjustedPosition = position + Math.pow(2, level) / 2;
    return (adjustedPosition / levelWidth) * totalWidth;
  };

  return (
    <div className="visualizer-container">
      <h1 className="visualizer-title">Binary Search Tree Visualizer</h1>
      <p className="visualizer-description">
        A Binary Search Tree (BST) is a node-based binary tree data structure which has the following properties:
        <br />
        • The left subtree of a node contains only nodes with keys less than the node's key.
        <br />
        • The right subtree of a node contains only nodes with keys greater than the node's key.
        <br />
        • Both the left and right subtrees must also be binary search trees.
      </p>

      {/* Controls section */}
      <div className="controls-section">
        <div className="control-group">
          <h3>Create Tree</h3>
          <div className="control-row">
            <button className="btn" onClick={generateRandomTree}>
              Generate Random BST
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>Tree Operations</h3>
          <div className="control-row">
            <input
              type="number"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="btn" onClick={handleInsert}>
              Insert
            </button>
            <button className="btn" onClick={handleRemove}>
              Remove
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

        <div className="control-group">
          <h3>Traversal</h3>
          <div className="control-row">
            <select
              value={traversalType}
              onChange={(e) => setTraversalType(e.target.value)}
            >
              <option value="inOrder">In-Order</option>
              <option value="preOrder">Pre-Order</option>
              <option value="postOrder">Post-Order</option>
            </select>
            <button className="btn" onClick={handleTraversal}>
              Traverse
            </button>
          </div>
        </div>
      </div>

      {/* Message box */}
      {message && <div className="message">{message}</div>}

      {/* Traversal result */}
      {traversalResult && (
        <div className="traversal-result">
          <strong>Traversal Result:</strong> {traversalResult}
        </div>
      )}

      {/* Visualization area */}
      <div className="visualization-area">
        <div className="tree-container" style={{ position: 'relative', height: `${(treeArray.length > 0 ? Math.max(...treeArray.map(node => node.level)) + 1 : 1) * 100}px` }}>
          {treeArray.length === 0 ? (
            <div className="empty-message">Tree is empty</div>
          ) : (
            <>
              {/* Draw edges */}
              {treeArray.map((node, index) => (
                node.parentPosition !== null && (
                  <div
                    key={`edge-${index}`}
                    className="tree-edge"
                    style={{
                      position: 'absolute',
                      top: `${node.parentLevel * 100 + 25}px`,
                      left: `${getNodeLeftPosition(node.parentPosition, node.parentLevel) + 25}px`,
                      width: `${Math.abs(getNodeLeftPosition(node.position, node.level) - getNodeLeftPosition(node.parentPosition, node.parentLevel))}px`,
                      height: '50px',
                      borderTop: '2px solid #666',
                      borderRight: node.position > node.parentPosition ? '2px solid #666' : 'none',
                      borderLeft: node.position < node.parentPosition ? '2px solid #666' : 'none',
                      borderTopLeftRadius: node.position < node.parentPosition ? '10px' : '0',
                      borderTopRightRadius: node.position > node.parentPosition ? '10px' : '0',
                      zIndex: 1,
                      transform: node.position < node.parentPosition 
                        ? 'translateX(-100%)' 
                        : 'none'
                    }}
                  />
                )
              ))}
              
              {/* Draw nodes */}
              {treeArray.map((node, index) => (
                <div
                  key={`node-${index}`}
                  className={getNodeClassName(node.value)}
                  style={{
                    position: 'absolute',
                    top: `${node.level * 100}px`,
                    left: `${getNodeLeftPosition(node.position, node.level)}px`,
                    zIndex: 2,
                  }}
                >
                  {node.value}
                </div>
              ))}
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
              <th>Average Case</th>
              <th>Worst Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Search</td>
              <td>O(log n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Insert</td>
              <td>O(log n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Delete</td>
              <td>O(log n)</td>
              <td>O(n)</td>
            </tr>
            <tr>
              <td>Traversal</td>
              <td>O(n)</td>
              <td>O(n)</td>
            </tr>
          </tbody>
        </table>
        <p className="note">
          Note: The worst-case time complexity is O(n) for a skewed tree (more like a linked list).
          Average case is O(log n) for a balanced tree.
        </p>
      </div>

      {/* Code implementation section */}
      <div className="code-section">
        <h3>JavaScript Implementation</h3>
        <pre>
{`// Node class for a binary search tree
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Binary Search Tree implementation
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // Insert a value into the BST
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    const insertNode = (node, newNode) => {
      // If value is less than node's value, go to the left
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        // If value is greater than or equal to node's value, go to the right
        if (node.right === null) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };
    
    insertNode(this.root, newNode);
    return this;
  }
  
  // Search for a value in the BST
  search(value) {
    const searchNode = (node, value) => {
      if (node === null) {
        return null;
      }
      
      if (value === node.value) {
        return node;
      }
      
      if (value < node.value) {
        return searchNode(node.left, value);
      } else {
        return searchNode(node.right, value);
      }
    };
    
    return searchNode(this.root, value);
  }
  
  // In-order traversal (Left -> Root -> Right)
  inOrder() {
    const result = [];
    
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    
    traverse(this.root);
    return result;
  }
  
  // Pre-order traversal (Root -> Left -> Right)
  preOrder() {
    const result = [];
    
    const traverse = (node) => {
      if (node !== null) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };
    
    traverse(this.root);
    return result;
  }
  
  // Post-order traversal (Left -> Right -> Root)
  postOrder() {
    const result = [];
    
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };
    
    traverse(this.root);
    return result;
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default TreeVisualizer;