import "dotenv/config";
import express from 'express';
import userRoutes from './routes/userRoutes.js';   
import postRoutes from './routes/postRoutes.js';
import CommentRoutes from './routes/commentRoutes.js'   

const app = express();
const PORT = 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Mount routers
app.use('/api/users', userRoutes);  
app.use('/api/post', postRoutes);
app.use('/api/comment', CommentRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
