import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const workouts = await prisma.trainingSession.findMany({
      include: {
        user: true,
      },
      orderBy: {
        sessionDate: 'desc',
      },
    });

    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching workouts',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, duration, userId } = req.body;

    if (!title || !duration || !userId) {
      return res.status(400).json({
        message: 'Title, duration and userId are required',
      });
    }

    const workout = await prisma.trainingSession.create({
      data: {
        title,
        description,
        duration: Number(duration),
        sessionDate: new Date(),
        userId: Number(userId),
      },
    });

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating workout',
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, duration } = req.body;

    const updatedWorkout = await prisma.trainingSession.update({
      where: { id },
      data: {
        title,
        description,
        duration: Number(duration),
      },
    });

    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating workout',
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.trainingSession.delete({
      where: { id },
    });

    res.json({
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting workout',
    });
  }
});

export default router;