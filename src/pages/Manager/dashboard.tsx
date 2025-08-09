// import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // ✅ ShadCN button

interface Project {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectsApiResponse {
  status: string;
  message: string;
  data: {
    projects: Project[];
  };
  error: string | null;
}

function Dashboard() {
  const navigate = useNavigate();

  const { data, error, isLoading } = useSWR<ProjectsApiResponse>('/projects', fetcher);
  const projects = data?.data?.projects;

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/create'); // ✅ navigate to create form page
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Failed to load projects</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
          <p className="text-gray-600">Manage and view all your projects</p>
        </div>

        {/* ✅ Create Project Button */}
        <Button onClick={handleCreateProject} className='text-pink-600'>+ Create Project</Button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleProjectClick(project._id)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                {project.status && (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'planning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status}
                  </span>
                )}
              </div>

              {project.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>ID: {project._id}</span>
                {project.createdAt && (
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Get started by creating your first project</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
