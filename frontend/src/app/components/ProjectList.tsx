import { useState } from 'react';
import { Project, UserRole } from '../types';
import { ProjectDetail } from './ProjectDetail';

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  onCreateProject: () => void;
  onRefresh: () => void;
  getUserRole: (project: Project) => UserRole;
}

export const ProjectList = ({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  onRefresh,
  getUserRole,
}: ProjectListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        userRole={getUserRole(selectedProject)}
        onBack={() => onSelectProject(null)}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Projects</h2>
        <button
          onClick={onCreateProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-900">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                getUserRole(project) === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {getUserRole(project)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{project.teamMembers.length} members</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchQuery ? 'No projects found' : 'No projects yet. Create your first project!'}
          </p>
        </div>
      )}
    </div>
  );
};