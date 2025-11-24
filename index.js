const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

app.post('/vote', (req, res) => {
  const { vote } = req.body;
  if (!vote) {
    return res.status(400).json({ error: 'Vote is required' });
  }
  const cipher = crypto.createCipher('aes-256-cbc', 'your-secret-key');
  let encryptedVote = cipher.update(vote, 'utf8', 'hex');
  encryptedVote += cipher.final('hex');
  res.json({ encryptedVote });
});

app.listen(3000, () => console.log('Server running on port 3000'));