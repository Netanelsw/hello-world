const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('\n Budget Proofer Web App is running!');
  console.log(`\n   Open in your browser: http://localhost:${PORT}\n`);
});
