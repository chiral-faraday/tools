import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'express_api',
  });
});

// root route
app.get('/', (req, res) => {
  res.send('Express API is running 🚀');
});

// start server (IMPORTANT: prevents container exit)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
