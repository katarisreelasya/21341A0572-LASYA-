// SERVER/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const windowSize = 10;
let numberStore = [];

const fetchNumbersFromAPI = async (type) => {
  
  const numbers = {
    'e': [2, 4, 6, 8, 10],
    'p': [2, 3, 5, 7, 11],
    'f': [1, 1, 2, 3, 5],
    'r': [5, 12, 23, 45, 34]
  };
  return numbers[type];
};

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  const newNumbers = await fetchNumbersFromAPI(type);

  numberStore = [...new Set([...numberStore, ...newNumbers])].slice(-windowSize);
  const avg = calculateAverage(numberStore);

  res.json({ windowPrevState: [], windowCurrState: numberStore, numbers: newNumbers, avg });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
