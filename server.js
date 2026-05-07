const express = require('express');
const cors = require('cors');

const runAgent = require('./agent/runAgent');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
  const result = runAgent(req.body.message);

  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
