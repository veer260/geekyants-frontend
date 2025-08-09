
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, ArrowLeft } from "lucide-react";
import { getFetcher } from "../../lib/fetcher";

type Engineer = {
  _id: string;
  name: string;
  email: string;
  department: string;
  skills: string[];
  seniority: string;
  maxCapacity: number;
  currentAllocation: number;
  availableCapacity: number;
};

type Project = {
  _id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
};

type ApiResponse = {
  status: string;
  message: string;
  data: {
    project: Project;
    teamMembers: Engineer[];
  };
  error: string | null;
};

// const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProjectTeamCapacity() {
    const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { data, error, isLoading } = useSWR<ApiResponse>(
    projectId ? `http://localhost:3000/api/projects/${projectId}/team` : null,
    getFetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !data || data.status !== "success") {
    return (
      <div className="p-4 text-red-500">
        Failed to load project team: {error?.message || data?.error || "Unknown error"}
      </div>
    );
  }

  const { project, teamMembers } = data.data;
  console.log({teamMembers});

  const chartData = teamMembers.map(member => ({
    name: member.name,
    Allocated: member.currentAllocation,
    Available: member.availableCapacity,
  }));

  return (
    <div className="space-y-6">
      {/* Project Info */}

       <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{project.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Status: <span className="font-medium capitalize">{project.status}</span>
          </p>
          <p className="text-sm text-gray-500">
            Team Size: <span className="font-medium">{project.teamSize}</span>
          </p>
          <p className="text-sm text-gray-500">
            Required Skills: {project.requiredSkills.join(", ")}
          </p>
        </CardContent>
      </Card>

      {/* Capacity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Team Capacity</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Allocated" stackId="a" fill="#ef4444" />
              <Bar dataKey="Available" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


       <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {teamMembers.map(engineer => (
              <li
                key={engineer._id}
                onClick={() => navigate(`/engineers/${engineer._id}`)}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <p className="font-medium text-blue-600">{engineer.name}</p>
                <p className="text-sm text-gray-500">
                  {engineer.department} — {engineer.seniority}
                </p>
                <p className="text-xs text-gray-400">
                  Allocation: {engineer.currentAllocation}% | Available: {engineer.availableCapacity}%
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
