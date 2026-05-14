
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch users',
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch user',
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to create user',
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to update user',
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete user',
    });
  }
});

export default router;