const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World! This is a test server.');
});

app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});
