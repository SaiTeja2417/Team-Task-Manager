import { useState, useEffect } from 'react';
import { Project, Task, UserRole, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { TaskModal } from './TaskModal';
import { TaskCard } from './TaskCard';
import { TeamManagement } from './TeamManagement';
import API from "../../api/axios";

interface ProjectDetailProps {
  project: Project;
  userRole: UserRole;
  onBack: () => void;
  onRefresh: () => void;
}

export const ProjectDetail = ({ project, userRole, onBack, onRefresh }: ProjectDetailProps) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [activeTab, setActiveTab] = useState<'tasks' | 'team'>('tasks');

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [project]);

  const loadTasks = async () => {
    try {
      const res = await API.get(`/tasks?projectId=${project.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (confirm('Delete this project?')) {
      try {
        await API.delete(`/projects/${project.id}`);
        onRefresh();
        onBack();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = () => {
    loadTasks();
    onRefresh();
    handleCloseModal();
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const canManageProject = userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* UI FULLY SAME */}
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between">
          <h2>{project.name}</h2>

          {canManageProject && (
            <button onClick={handleDeleteProject}>Delete</button>
          )}
        </div>

        <p>{project.description}</p>
      </div>

      {/* Tabs */}
      <div className='space-x-6'>
        <button className='border-2 pr-5 pl-5 p-2 cursor-pointer rounded' onClick={() => setActiveTab('tasks')}>Tasks</button>
        <button className='border-2 pr-5 pl-5 p-2 cursor-pointer rounded' onClick={() => setActiveTab('team')}>Team</button>
      </div>

      {activeTab === 'tasks' && (
        <div>
          <button className='border-2 pr-5 pl-5 p-2 cursor-pointer rounded' onClick={() => setShowTaskModal(true)}>+ Task</button>

          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onEdit={handleEditTask}
              onRefresh={loadTasks}
              canEdit={true}
            />
          ))}
        </div>
      )}

      {activeTab === 'team' && (
        <TeamManagement
          project={project}
          userRole={userRole}
          onUpdate={onRefresh}
        />
      )}

      {showTaskModal && (
        <TaskModal
          projects={[project]}
          editingTask={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};