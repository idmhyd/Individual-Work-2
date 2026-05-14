import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const schedule = await prisma.schedule.findMany({
      where: { userId: 1 },
    });

    res.json(schedule);
  } catch {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { day, time, activity, trainer, userId } = req.body;

    const newSchedule = await prisma.schedule.create({
      data: {
        day,
        time,
        activity,
        trainer,
        userId,
      },
    });

    res.status(201).json(newSchedule);
  } catch {
    res.status(500).json({ error: 'Failed to add schedule' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.schedule.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;