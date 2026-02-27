import { Task } from '@nexora/shared';
import { apiRequest } from './api';

interface SyncResult {
  tasks: Task[];
  syncedAt: string;
}

export async function syncTasks(localTasks: Task[], token: string): Promise<SyncResult> {
  const res = await apiRequest<{ data: Task[]; syncedAt: string }>('/tasks/sync', {
    method: 'POST',
    token,
    body: JSON.stringify({ tasks: localTasks }),
  });
  return { tasks: res.data, syncedAt: res.syncedAt };
}
