import { Task, User } from '../types';
import API from "../../api/axios";

interface TaskCardProps {
  task: Task;
  users: User[];
  onEdit: (task: Task) => void;
  onRefresh: () => void;
  canEdit: boolean;
}

export const TaskCard = ({ task, users, onEdit, onRefresh, canEdit }: TaskCardProps) => {
  const assignedUser = users.find(u => u._id === task.assignedTo);
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  //DELETE TASK (Backend)
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${task._id}`);
        onRefresh();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  //QUICK STATUS UPDATE (Backend)
  const handleQuickStatusChange = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const statuses: Array<typeof task.status> = [
      'todo',
      'in-progress',
      'review',
      'completed',
    ];

    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await API.put(`/tasks/${task._id}`, { status: nextStatus });
      onRefresh();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div>
          <h4 className="text-gray-900 mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {task.priority}
          </span>

          {isOverdue && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
              Overdue
            </span>
          )}
        </div>

        {assignedUser && (
          <div className="text-sm text-gray-600">
            👤 {assignedUser.name}
          </div>
        )}

        {task.dueDate && (
          <div
            className={`text-sm ${
              isOverdue ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        {canEdit && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleQuickStatusChange}
              className="flex-1 text-s px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 p-6"
            >
              Next Status
            </button>

            <button
              onClick={() => onEdit(task)}
              className="flex-1 text-s px-2 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="text-s px-2 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};