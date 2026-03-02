import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

export const categoriesRouter = Router();
categoriesRouter.use(authMiddleware);

categoriesRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      orderBy: { name: 'asc' },
    });
    res.json({ data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

categoriesRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, color, icon } = req.body;
    if (!name || !color) {
      res.status(400).json({ error: 'Nome e cor são obrigatórios' });
      return;
    }
    const category = await prisma.category.create({
      data: {
        id: uuidv4(),
        name,
        color,
        icon,
        userId: req.userId!,
      },
    });
    res.status(201).json({ data: category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

categoriesRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ error: 'Categoria não encontrada' });
      return;
    }
    const { name, color, icon } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, color, icon },
    });
    res.json({ data: category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

categoriesRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ error: 'Categoria não encontrada' });
      return;
    }
    await prisma.category.delete({ where: { id } });
    res.json({ data: { id } });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Erro ao excluir categoria' });
  }
});
