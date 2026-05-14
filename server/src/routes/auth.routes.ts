import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    console.log(
      'REGISTER BODY:',
      req.body
    );

    
    if (
      !name?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        error:
          'Name, email and password are required',
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: email.trim(),
        },
      });

    if (existingUser) {
      return res.status(400).json({
        error:
          'User with this email already exists',
      });
    }

    const newUser =
      await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        },
      });

    return res.status(201).json({
      message:
        'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(
      'REGISTER ERROR:',
      error
    );

    return res.status(500).json({
      error: 'Registration failed',
      details:
        error instanceof Error
          ? error.message
          : 'Unknown server error',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    console.log(
      'LOGIN BODY:',
      req.body
    );

    if (
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        error:
          'Email and password are required',
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email: email.trim(),
        },
      });

    if (!user) {
      return res.status(401).json({
        error:
          'User not found',
      });
    }

    if (
      user.password !==
      password.trim()
    ) {
      return res.status(401).json({
        error:
          'Invalid password',
      });
    }

    return res.status(200).json({
      message:
        'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      'LOGIN ERROR:',
      error
    );

    return res.status(500).json({
      error: 'Login failed',
      details:
        error instanceof Error
          ? error.message
          : 'Unknown server error',
    });
  }
});

export default router;