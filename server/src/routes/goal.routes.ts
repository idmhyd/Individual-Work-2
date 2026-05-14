import { Router } from 'express';
import { prisma } from '../prisma';

console.log('GOAL ROUTES LOADED');

const router = Router();


router.get('/seed', async (req, res) => {
  try {
    const goal = await prisma.goal.create({
      data: {
        title: 'Lose Weight',
        target: 10,
        progress: 3,
        userId: 1,
      },
    });

    console.log('SEED CREATED:', goal);

    res.json(goal);
  } catch (error) {
    console.error('SEED ERROR:', error);

    res.status(500).json({
      message: 'Seed failed',
      error,
    });
  }
});


router.get('/', async (req, res) => {
  console.log('GOALS ENDPOINT HIT');

  try {
    const goals = await prisma.goal.findMany({
      include: {
        user: true,
      },
    });

    console.log('GOALS FOUND:', goals);

    res.json(goals);
  } catch (error) {
    console.error('GET GOALS ERROR:', error);

    res.status(500).json({
      message: 'Error fetching goals',
      error,
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { title, target, progress, deadline, userId } = req.body;

    console.log('CREATE GOAL BODY:', req.body);

    if (!title || !target || !userId) {
      return res.status(400).json({
        message: 'Title, target and userId are required',
      });
    }

    const goal = await prisma.goal.create({
      data: {
        title: String(title),
        target: Number(target),
        progress: Number(progress) || 0,
        deadline: deadline ? new Date(deadline) : null,
        userId: Number(userId),
      },
    });

    console.log('GOAL CREATED:', goal);

    res.json(goal);
  } catch (error) {
    console.error('CREATE GOAL ERROR:', error);

    res.status(500).json({
      message: 'Error creating goal',
      error,
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, target, progress, deadline } = req.body;

    console.log('GOAL ID:', id);
    console.log('REQUEST BODY:', req.body);

    const existingGoal = await prisma.goal.findUnique({
      where: { id },
    });

    console.log('BEFORE UPDATE:', existingGoal);

    if (!existingGoal) {
      return res.status(404).json({
        message: 'Goal not found',
      });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title: String(title),
        target: Number(target),
        progress: Number(progress),
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    console.log('AFTER UPDATE:', updatedGoal);

    res.json(updatedGoal);
  } catch (error) {
    console.error('UPDATE ERROR:', error);

    res.status(500).json({
      message: 'Error updating goal',
      error,
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    console.log('DELETE GOAL ID:', id);

    await prisma.goal.delete({
      where: { id },
    });

    res.json({
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    console.error('DELETE GOAL ERROR:', error);

    res.status(500).json({
      message: 'Error deleting goal',
      error,
    });
  }
});

export default router;