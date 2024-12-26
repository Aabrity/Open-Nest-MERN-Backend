import { EventEmitter } from 'events'; 
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRouter from './routes/user_route.js'; 
import adminRoutes from './routes/admin_routes.js';
import authRouter from './routes/auth_route.js';
import listingRouter from './routes/listing_route.js';
import commentRoutes from './routes/comment_routes.js';
import connectDB from './config/db.js'; 

EventEmitter.defaultMaxListeners = 20; 

const app = express();
const port = 3000;

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/comments', commentRoutes);

// Static Files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
