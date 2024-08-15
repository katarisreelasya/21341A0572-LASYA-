const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const windowSize = 10; // The size of the sliding window
let numberStore = [];  // Store to keep the latest numbers

// Mock function to simulate fetching from a third-party API
const fetchNumbersFromAPI = async (type) => {
  const numbers = {
    'e': [2, 4, 6, 8, 10],  // Even numbers
    'p': [2, 3, 5, 7, 11],  // Prime numbers
    'f': [1, 1, 2, 3, 5],   // Fibonacci sequence
    'r': [5, 12, 23, 45, 34]// Random numbers
  };
  return numbers[type];
};

// Calculate the average of an array of numbers
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIzNzAwNDY3LCJpYXQiOjE3MjM3MDAxNjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE0ODE1YjdhLWVmMjItNGE3NC1hZDgwLTBlODdjYTExZDJmNCIsInN1YiI6IjIxMzQxQTA1NzJAZ21yaXQuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiJhNDgxNWI3YS1lZjIyLTRhNzQtYWQ4MC0wZTg3Y2ExMWQyZjQiLCJjbGllbnRTZWNyZXQiOiJjaHNSbXZZclFERkh0Q0h3Iiwib3duZXJOYW1lIjoiS2F0YXJpIFNyZWVMYXN5YSIsIm93bmVyRW1haWwiOiIyMTM0MUEwNTcyQGdtcml0LmVkdS5pbiIsInJvbGxObyI6IjIxMzQxQTA1NzIifQ.0JxtkQl58_iO1hQq9IbdIn262TbkuAehCT2g-RjotDw";

  if (token !== validToken) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  next();
};

// Route to fetch numbers and calculate average
app.get('/numbers/:type', authenticate, async (req, res) => {
  const type = req.params.type;
  const newNumbers = await fetchNumbersFromAPI(type);

  const previousStore = [...numberStore];
  numberStore = [...new Set([...numberStore, ...newNumbers])].slice(-windowSize);

  const avg = calculateAverage(numberStore);

  res.json({ windowPrevState: previousStore, windowCurrState: numberStore, numbers: newNumbers, avg });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
