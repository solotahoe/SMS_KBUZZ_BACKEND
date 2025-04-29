import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from './routes/usersRoutes.js'
import planRoutes from './routes/planRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'

dotenv.config();
const app = express();

//Parse req.body into a JavaScript object."
app.use(express.json());

//Allow Cross-Origin Resource Sharing
app.use(cors());

//Routes
app.use('/api/user', userRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/sub', subscriptionRoutes);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
// Connect MongoDB and Start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas is Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
