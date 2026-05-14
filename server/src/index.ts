import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import goalRoutes from './routes/goal.routes';
import workoutRoutes from './routes/workout.routes';
import scheduleRoutes from './routes/schedule.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('Gym Backend works');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});