import { useState, useEffect } from 'react';
import { Task, Project, TaskStatus, TaskPriority, User } from '../types';
import { TaskModal } from './TaskModal';
import API from "../../api/axios";

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  onCreateTask: () => void;
  onRefresh: () => void;
}

export const TaskList = ({ tasks, projects, onCreateTask, onRefresh }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // ✅ FETCH USERS FROM BACKEND
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = () => {
    onRefresh();
    handleCloseModal();
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    return users.find(u => u.id === userId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">My Tasks</h2>
        <button
          onClick={onCreateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow divide-y">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900">{task.title}</h3>

                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : task.status === 'review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{getProjectName(task.projectId)}</span>

                    <span>•</span>
                    <span>{getUserName(task.assignedTo)}</span>

                    {task.dueDate && (
                      <>
                        <span>•</span>
                        <span className={
                          new Date(task.dueDate) < new Date() && task.status !== 'completed'
                            ? 'text-red-600'
                            : ''
                        }>
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleEditTask(task)}
                  className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'No tasks match the filters'
              : 'No tasks assigned to you yet'}
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          projects={projects}
          editingTask={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};