import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Project, Task, UserRole } from '../types';
import API from "../../api/axios";
import { ProjectList } from './ProjectList';
import { TaskList } from './TaskList';
import { ProjectModal } from './ProjectModal';
import { TaskModal } from './TaskModal';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<'dashboard' | 'projects' | 'tasks'>('dashboard');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        API.get("/projects"),
        API.get("/tasks")
      ]);

      setProjects(projectsRes.data || []);
      setAllTasks(tasksRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserRole = (project: Project): UserRole => {
    if (!user) return 'member';

    if (project.createdBy === user.id) return 'admin';

    const member = project.teamMembers?.find(m => m.userId === user.id);
    return member?.role || 'member';
  };

  const myTasks = allTasks.filter(t => t.assignedTo === user?.id);

  const overdueTasks = myTasks.filter(t =>
    t.status !== 'completed' &&
    t.dueDate &&
    new Date(t.dueDate) < new Date()
  );

  const tasksByStatus = {
    todo: myTasks.filter(t => t.status === 'todo').length,
    'in-progress': myTasks.filter(t => t.status === 'in-progress').length,
    review: myTasks.filter(t => t.status === 'review').length,
    completed: myTasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-gray-900">Team Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setView('dashboard')}
              className={`py-4 border-b-2 ${
                view === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('projects')}
              className={`py-4 border-b-2 ${
                view === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`py-4 border-b-2 ${
                view === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Tasks
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Projects</div>
                <div className="text-gray-900 mt-1">{projects.length}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">My Tasks</div>
                <div className="text-gray-900 mt-1">{myTasks.length}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-gray-900 mt-1">{tasksByStatus['in-progress']}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-sm text-gray-600">Overdue</div>
                <div className="text-red-600 mt-1">{overdueTasks.length}</div>
              </div>
            </div>

            {/* Task Status Overview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-gray-900 mb-4">Task Status Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div>{tasksByStatus.todo}</div>
                  <div className="text-sm text-gray-600 mt-1">To Do</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div>{tasksByStatus['in-progress']}</div>
                  <div className="text-sm text-blue-600 mt-1">In Progress</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <div>{tasksByStatus.review}</div>
                  <div className="text-sm text-yellow-600 mt-1">Review</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div>{tasksByStatus.completed}</div>
                  <div className="text-sm text-green-600 mt-1">Completed</div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-900">Recent Projects</h2>
                <button
                  onClick={() => setView('projects')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                    onClick={() => {
                      setSelectedProject(project);
                      setView('projects');
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3>{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                        {getUserRole(project)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'projects' && (
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onCreateProject={() => setShowProjectModal(true)}
            onRefresh={loadData}
            getUserRole={getUserRole}
          />
        )}

        {view === 'tasks' && (
          <TaskList
            tasks={myTasks}
            projects={projects}
            onCreateTask={() => setShowTaskModal(true)}
            onRefresh={loadData}
          />
        )}
      </main>

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal onClose={() => setShowProjectModal(false)} onSave={loadData} />
      )}

      {showTaskModal && (
        <TaskModal projects={projects} onClose={() => setShowTaskModal(false)} onSave={loadData} />
      )}
    </div>
  );
};