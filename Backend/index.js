const express = require('express');
const menu = require('./menu.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));

// Demo only: orders live in memory and reset when the container restarts.
const orders = [];
let nextOrderNumber = 1;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date() });
});

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.post('/api/orders', (req, res) => {
  const { name, pickupTime, items } = req.body || {};

  if (typeof name !== 'string' || !name.trim() || name.length > 50) {
    return res.status(400).json({ error: 'Nom invalide.' });
  }
  if (pickupTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime)) {
    return res.status(400).json({ error: 'Heure de retrait invalide.' });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ error: 'Le panier est vide.' });
  }

  // Prices come from the server menu, never from the client.
  const lines = [];
  for (const item of items) {
    const product = menu.find((p) => p.id === item?.id);
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ error: 'Article invalide dans le panier.' });
    }
    lines.push({ id: product.id, name: product.name, qty, price: product.price });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const order = {
    number: nextOrderNumber++,
    name: name.trim(),
    pickupTime: pickupTime || null,
    items: lines,
    total,
    createdAt: new Date(),
  };
  orders.push(order);
  console.log(`Order #${order.number} for ${order.name}: ${(total / 100).toFixed(2)} EUR`);

  res.status(201).json(order);
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
