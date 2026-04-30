import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TeamMember } from '../types';
import API from "../../api/axios";

interface ProjectModalProps {
  onClose: () => void;
  onSave: () => void;
}

export const ProjectModal = ({ onClose, onSave }: ProjectModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    try {
      setLoading(true);

      const teamMember: TeamMember = {
        userId: user.id,
        role: 'admin',
        addedAt: new Date().toISOString(),
      };

      // 🔥 BACKEND CALL (instead of saveProject)
      await API.post("/projects", {
        name: name.trim(),
        description: description.trim(),
        createdBy: user.id,
        teamMembers: [teamMember],
      });

      onSave();   // reload dashboard data
      onClose();  // close modal
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-gray-900 mb-4">Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="project-description" className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project description"
              />
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
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};