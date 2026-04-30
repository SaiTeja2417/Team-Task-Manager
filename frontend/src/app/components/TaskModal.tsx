import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Project, Task, TaskStatus, TaskPriority, User } from '../types';
import API from "../../api/axios";

interface TaskModalProps {
  projects: Project[];
  defaultProjectId?: string;
  editingTask?: Task;
  onClose: () => void;
  onSave: () => void;
}

export const TaskModal = ({ projects, defaultProjectId, editingTask, onClose, onSave }: TaskModalProps) => {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setProjectId(editingTask.projectId);
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setAssignedTo(editingTask.assignedTo || '');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
    }
  }, [editingTask]);

  // 🔥 Fetch users from backend instead of localStorage
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        const allUsers = res.data;

        if (projectId) {
          const project = projects.find(p => p.id === projectId);
          if (project) {
            const teamUserIds = project.teamMembers.map(m => m.userId);
            const teamUsers = allUsers.filter((u: User) =>
              teamUserIds.includes(u.id)
            );
            setAvailableUsers(teamUsers);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [projectId, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!projectId) {
      setError('Please select a project');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    try {
      setLoading(true);

      if (editingTask) {
        // 🔥 UPDATE TASK
        await API.put(`/tasks/${editingTask.id}`, {
          projectId,
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignedTo: assignedTo || null,
          dueDate: dueDate || null,
        });
      } else {
        // 🔥 CREATE TASK
        await API.post("/tasks", {
          projectId,
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assignedTo: assignedTo || null,
          createdBy: user.id,
          dueDate: dueDate || null,
        });
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-gray-900 mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-project" className="block text-sm text-gray-700 mb-1">
                Project *
              </label>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!defaultProjectId}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-title" className="block text-sm text-gray-700 mb-1">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                autoFocus={!editingTask}
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-status" className="block text-sm text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-priority" className="block text-sm text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-assignee" className="block text-sm text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  id="task-assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="task-duedate" className="block text-sm text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingTask
                  ? 'Save Changes'
                  : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};