const express = require('express');
const crypto = require('crypto');
const app = express();

// 啟用 JSON 解析
app.use(express.json());

// 修復：添加根路徑 GET /（瀏覽器訪問時顯示）
app.get('/', (req, res) => {
  res.send(`
    <h1>🎉 E-Voting Backend 已成功上線！</h1>
    <p><strong>公共網址：</strong> https://voting-backend-bmsc.onrender.com</p>
    <p><strong>可用端點：</strong></p>
    <ul>
      <li>GET / - 顯示此頁面</li>
      <li>POST /vote - 加密選票（JSON: {"vote": "Candidate A"}）</li>
    </ul>
    <p><strong>測試方法：</strong> 用 Postman POST /vote，Body: {"vote": "Candidate A"}</p>
    <hr>
    <p>伺服器狀態：運行中 | 部署日期：2025-11-24 | Render Free Tier</p>
  `);
});

// 你的 /vote 端點（POST，加密選票）
app.post('/vote', (req, res) => {
  const { vote } = req.body;
  if (!vote) {
    return res.status(400).json({ error: 'Vote is required' });
  }
  try {
    const cipher = crypto.createCipher('aes-256-cbc', 'your-secret-key');
    let encryptedVote = cipher.update(vote, 'utf8', 'hex');
    encryptedVote += cipher.final('hex');
    res.json({ 
      success: true, 
      encryptedVote: encryptedVote,
      message: `選票 "${vote}" 已加密成功！`
    });
  } catch (error) {
    res.status(500).json({ error: 'Encryption failed', details: error.message });
  }
});

// 捕捉所有未定義路由（可選，避免 404）
app.use('*', (req, res) => {
  res.status(404).send(`<h1>404 - 路徑未找到</h1><p>${req.method} ${req.url} 不存在。試試 <a href="/">首頁</a> 或 POST /vote。</p>`);
});

// 啟動伺服器（Render 會自動使用 process.env.PORT）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行於端口 ${PORT}`);
  console.log(`🌐 公共網址：https://voting-backend-bmsc.onrender.com`);
  console.log(`🧪 測試：POST /vote {"vote": "Candidate A"}`);
});