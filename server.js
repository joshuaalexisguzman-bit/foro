// simple express server to serve build and listen on all network interfaces
const express = require('express');
const path = require('path');
const app = express();

// serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'build')));

// fallback to index.html for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
