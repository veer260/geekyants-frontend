// src/pages/Engineer/Assignments.tsx
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Loader2 } from "lucide-react";
import { getFetcher } from "../../lib/fetcher";
import { base_url } from "@/constants";

type Assignment = {
  _id: string;
  engineerId: {
    _id: string;
    name: string;
    email: string;
    department: string;
    skills: string[];
    seniority: string;
  };
  projectId: {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
};

type ApiResponse = {
  status: string;
  message: string;
  data: { assignments: Assignment[] };
  error: string | null;
};

export default function EngineerAssignments() {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `${base_url}/assignments`,
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
        Failed to load assignments: {error?.message || data?.error || "Unknown error"}
      </div>
    );
  }

  const assignments = data.data.assignments;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Assignments</h1>

      {assignments.length === 0 ? (
        <p className="text-gray-600">You have no current assignments.</p>
      ) : (
        assignments.map((assignment) => (
          <Card key={assignment._id} className="shadow-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{assignment.projectId.name}</CardTitle>
              <Badge
                variant={
                  assignment.projectId.status === "active"
                    ? "default"
                    : assignment.projectId.status === "planning"
                    ? "secondary"
                    : "outline"
                }
              >
                {assignment.projectId.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">{assignment.projectId.description}</p>
              <p className="text-sm text-gray-500 mb-1">
                Role: <span className="font-medium">{assignment.role}</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Allocation:{" "}
                <span className="font-medium">{assignment.allocationPercentage}%</span>
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Duration:{" "}
                {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                {new Date(assignment.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Skills: {assignment.engineerId.skills.join(", ")}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
