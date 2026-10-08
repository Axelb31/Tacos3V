const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date() });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));