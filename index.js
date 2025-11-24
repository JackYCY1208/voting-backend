const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// 根路徑 – 讓你打開網址時看到成功畫面
app.get('/', (req, res) => {
  res.send(`
    <h1>E-Voting Backend 運行成功！</h1>
    <p>https://voting-backend-bmsc.onrender.com</p>
    <p>Testing Testing</p>
    <pre>{"vote": "Candidate A"}</pre>
  `);
});

// 正確的加密方式（Node.js 17+ 必須使用 createCipheriv）
app.post('/vote', (req, res) => {
  const { vote } = req.body;
  
  if (!vote) {
    return res.status(400).json({ error: '缺少 vote 欄位' });
  }

  try {
    // 固定 key 和 iv（生產環境建議用環境變數）
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync('my-super-secret-key-2025', 'salt', 32); // 32 bytes key
    const iv = crypto.randomBytes(16); // 每次都不一樣，更安全

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(vote, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // 把 iv 也回傳，解密時需要
    const encryptedVote = iv.toString('hex') + ':' + encrypted;

    res.json({
      success: true,
      encryptedVote: encryptedVote,
      message: `「${vote}」加密成功（使用 createCipheriv）`
    });

  } catch (error) {
    console.error('加密錯誤:', error);
    res.status(500).json({
      error: 'Encryption failed',
      details: error.message
    });
  }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`後端已啟動 → https://voting-backend-bmsc.onrender.com`);
});

module.exports = app;