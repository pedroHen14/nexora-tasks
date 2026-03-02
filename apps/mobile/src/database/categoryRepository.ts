import { Category } from '@nexora/shared';
import { getDatabase } from './database';

interface DBCategory {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  user_id: string;
}

function dbCategoryToCategory(row: DBCategory): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon ?? undefined,
    userId: row.user_id,
  };
}

export async function getAllCategories(userId: string): Promise<Category[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DBCategory>(
    'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC',
    [userId]
  );
  return rows.map(dbCategoryToCategory);
}

export async function saveCategory(category: Category): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO categories (id, name, color, icon, user_id) VALUES (?, ?, ?, ?, ?)',
    [category.id, category.name, category.color, category.icon ?? null, category.userId]
  );
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
}

export async function clearUserCategories(userId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM categories WHERE user_id = ?', [userId]);
}
