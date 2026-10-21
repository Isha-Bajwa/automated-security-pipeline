const express = require('express');
const helmet = require('helmet');

const app = express();

// Security-hardened HTTP headers
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Health check endpoint for container orchestrators and ALB
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Parameterized greeting endpoint with input sanitization
app.get('/greet', (req, res) => {
  const name = String(req.query.name || 'world').slice(0, 50);
  res.json({ message: `Hello, ${name}` });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Security-hardened server running on port ${PORT}`);
  });
}

module.exports = app;
