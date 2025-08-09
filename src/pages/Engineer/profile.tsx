"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { Separator } from "../../components/ui/separator";
import { base_url } from "../../constants"; // your constants file

// Fetcher for SWR
const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((res) => res.json());

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR(`${base_url}/auth/profile`, fetcher);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Failed to load profile</div>;
  }

  const profile = data;

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto shadow-md border border-gray-200">
        <CardHeader className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-avatar.png" alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
            <CardDescription className="text-gray-500">{profile.email}</CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {profile.role}
          </Badge>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 mt-4">
          {/* Department & Seniority */}
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{profile.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Seniority</p>
              <p className="font-medium capitalize">{profile.seniority}</p>
            </div>
          </div>

          {/* Max Capacity */}
          <div>
            <p className="text-sm text-gray-500">Max Capacity</p>
            <p className="font-medium">{profile.maxCapacity}%</p>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Created & Updated */}
          <div className="text-sm text-gray-500">
            <p>Account Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
