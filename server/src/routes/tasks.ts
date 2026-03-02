import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

export const tasksRouter = Router();
tasksRouter.use(authMiddleware);

tasksRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      include: { category: true },
    });
    res.json({ data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

tasksRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, dueTime, categoryId, tags, reminder } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Título é obrigatório' });
      return;
    }
    const task = await prisma.task.create({
      data: {
        id: uuidv4(),
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        dueTime,
        categoryId,
        tags: tags || [],
        reminder,
        userId: req.userId!,
        syncedAt: new Date(),
      },
      include: { category: true },
    });
    res.status(201).json({ data: task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

tasksRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }
    const { title, description, completed, dueDate, dueTime, categoryId, tags, reminder } =
      req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        dueTime,
        categoryId,
        tags,
        reminder,
        syncedAt: new Date(),
      },
      include: { category: true },
    });
    res.json({ data: task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

tasksRouter.delete('/completed/all', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.task.deleteMany({ where: { userId: req.userId, completed: true } });
    res.json({ data: { message: 'Tarefas concluídas excluídas' } });
  } catch (error) {
    console.error('Delete completed tasks error:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefas concluídas' });
  }
});

tasksRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, userId: req.userId } });
    if (!existing) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }
    await prisma.task.delete({ where: { id } });
    res.json({ data: { id } });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
});

// Sync endpoint - client sends local tasks, server returns merged result
tasksRouter.post('/sync', async (req: AuthRequest, res: Response) => {
  try {
    const { tasks: localTasks } = req.body as { tasks: Array<{
      id: string;
      title: string;
      description?: string;
      completed: boolean;
      dueDate?: string;
      dueTime?: string;
      categoryId?: string;
      tags: string[];
      reminder?: string;
      createdAt: string;
      updatedAt: string;
      syncedAt?: string;
    }> };
    const now = new Date();

    for (const localTask of localTasks) {
      const existing = await prisma.task.findFirst({ where: { id: localTask.id, userId: req.userId } });
      if (existing) {
        // Last write wins based on updatedAt
        const localUpdatedAt = new Date(localTask.updatedAt);
        if (localUpdatedAt > existing.updatedAt) {
          await prisma.task.update({
            where: { id: localTask.id },
            data: {
              title: localTask.title,
              description: localTask.description,
              completed: localTask.completed,
              dueDate: localTask.dueDate ? new Date(localTask.dueDate) : null,
              dueTime: localTask.dueTime,
              categoryId: localTask.categoryId,
              tags: localTask.tags,
              reminder: localTask.reminder,
              syncedAt: now,
            },
          });
        }
      } else {
        await prisma.task.create({
          data: {
            id: localTask.id,
            title: localTask.title,
            description: localTask.description,
            completed: localTask.completed,
            dueDate: localTask.dueDate ? new Date(localTask.dueDate) : undefined,
            dueTime: localTask.dueTime,
            categoryId: localTask.categoryId,
            tags: localTask.tags,
            reminder: localTask.reminder,
            userId: req.userId!,
            createdAt: new Date(localTask.createdAt),
            syncedAt: now,
          },
        });
      }
    }

    const serverTasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ data: serverTasks, syncedAt: now.toISOString() });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Erro na sincronização' });
  }
});
