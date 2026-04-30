export type UserRole = 'admin' | 'member';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  userId: string;
  role: UserRole;
  addedAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
  dueDate: string | null;
  updatedAt: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
}
