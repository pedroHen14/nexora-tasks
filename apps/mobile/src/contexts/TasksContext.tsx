import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Category } from '@nexora/shared';
import { generateId } from '@nexora/shared';
import { useAuth } from './AuthContext';
import * as taskRepo from '../database/taskRepository';
import * as categoryRepo from '../database/categoryRepository';
import { syncTasks } from '../services/syncService';

interface TasksContextType {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  sync: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType>({} as TasksContextType);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadLocalData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const [localTasks, localCategories] = await Promise.all([
      taskRepo.getAllTasks(user.id),
      categoryRepo.getAllCategories(user.id),
    ]);
    setTasks(localTasks);
    setCategories(localCategories);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  const sync = useCallback(async () => {
    if (!user || !token) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const result = await syncTasks(tasks, token);
      for (const task of result.tasks) {
        await taskRepo.saveTask(task);
      }
      setTasks(result.tasks);
      setLastSyncedAt(result.syncedAt);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Erro de sincronização');
    } finally {
      setIsSyncing(false);
    }
  }, [user, token, tasks]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return;
    const now = new Date().toISOString();
    const task: Task = {
      ...taskData,
      id: generateId(),
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      tags: taskData.tags || [],
      completed: taskData.completed || false,
    };
    await taskRepo.saveTask(task);
    setTasks((prev) => [task, ...prev]);
    sync();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const now = new Date().toISOString();
    const updatedTask = tasks.find((t) => t.id === id);
    if (!updatedTask) return;
    const task: Task = { ...updatedTask, ...updates, updatedAt: now };
    await taskRepo.saveTask(task);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    sync();
  };

  const deleteTask = async (id: string) => {
    await taskRepo.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed });
  };

  const deleteCompletedTasks = async () => {
    if (!user) return;
    await taskRepo.deleteCompletedTasks(user.id);
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'userId'>) => {
    if (!user) return;
    const category: Category = { ...categoryData, id: generateId(), userId: user.id };
    await categoryRepo.saveCategory(category);
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const existing = categories.find((c) => c.id === id);
    if (!existing) return;
    const category: Category = { ...existing, ...updates };
    await categoryRepo.saveCategory(category);
    setCategories((prev) => prev.map((c) => (c.id === id ? category : c)));
  };

  const deleteCategory = async (id: string) => {
    await categoryRepo.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        categories,
        isLoading,
        isSyncing,
        lastSyncedAt,
        syncError,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        deleteCompletedTasks,
        addCategory,
        updateCategory,
        deleteCategory,
        sync,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
