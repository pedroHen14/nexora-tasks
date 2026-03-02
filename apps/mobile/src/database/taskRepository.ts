import { Task } from '@nexora/shared';
import { getDatabase } from './database';

interface DBTask {
  id: string;
  title: string;
  description: string | null;
  completed: number;
  due_date: string | null;
  due_time: string | null;
  category_id: string | null;
  tags: string;
  reminder: string | null;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
  user_id: string;
}

function dbTaskToTask(row: DBTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    completed: row.completed === 1,
    dueDate: row.due_date ?? undefined,
    dueTime: row.due_time ?? undefined,
    categoryId: row.category_id ?? undefined,
    tags: JSON.parse(row.tags || '[]'),
    reminder: (row.reminder as Task['reminder']) ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncedAt: row.synced_at ?? undefined,
    userId: row.user_id,
  };
}

export async function getAllTasks(userId: string): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DBTask>(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, created_at DESC',
    [userId]
  );
  return rows.map(dbTaskToTask);
}

export async function saveTask(task: Task): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO tasks (id, title, description, completed, due_date, due_time, category_id, tags, reminder, created_at, updated_at, synced_at, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.title,
      task.description ?? null,
      task.completed ? 1 : 0,
      task.dueDate ?? null,
      task.dueTime ?? null,
      task.categoryId ?? null,
      JSON.stringify(task.tags),
      task.reminder ?? null,
      task.createdAt,
      task.updatedAt,
      task.syncedAt ?? null,
      task.userId,
    ]
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

export async function deleteCompletedTasks(userId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE user_id = ? AND completed = 1', [userId]);
}

export async function clearUserTasks(userId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE user_id = ?', [userId]);
}
