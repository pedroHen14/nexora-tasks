import { Task, TaskGroup } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function getTaskGroup(task: Task): TaskGroup {
  if (!task.dueDate) return 'no_date';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const dueDate = new Date(task.dueDate);
  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  if (dueDateOnly < today) return 'overdue';
  if (dueDateOnly.getTime() === today.getTime()) return 'today';
  if (dueDateOnly.getTime() === tomorrow.getTime()) return 'tomorrow';
  if (dueDateOnly < nextWeek) return 'this_week';
  return 'later';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function formatDateTime(dateString: string, timeString?: string): string {
  const formatted = formatDate(dateString);
  if (timeString) {
    return `${formatted} às ${timeString}`;
  }
  return formatted;
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  if (task.dueTime) {
    const [hours, minutes] = task.dueTime.split(':').map(Number);
    dueDate.setHours(hours, minutes, 0, 0);
  } else {
    dueDate.setHours(23, 59, 59, 999);
  }
  return dueDate < now;
}

export function getGroupLabel(group: TaskGroup): string {
  const labels: Record<TaskGroup, string> = {
    overdue: 'Atrasadas',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    this_week: 'Esta semana',
    later: 'Mais tarde',
    no_date: 'Sem data',
  };
  return labels[group];
}

export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function filterTasks(tasks: Task[], filter: string): Task[] {
  switch (filter) {
    case 'pending':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}
