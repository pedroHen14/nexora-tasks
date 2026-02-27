import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { tasksRouter } from './routes/tasks';
import { categoriesRouter } from './routes/categories';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Nexora Tasks server running on port ${PORT}`);
});

export default app;
