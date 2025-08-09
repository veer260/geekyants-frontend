import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import UserProvider, { UserContext } from "./providers/userProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Manager/dashboard";
import ProjectTeamCapacity from "./pages/Manager/project";
// import EngineerDashboard from "./pages/Engineer/engineerAssignments";
// import EngineerProfile from "./pages/Engineer/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { base_url } from "./constants";
import { postFetcher } from "./lib/fetcher";
import EngineerAssignments from "./pages/Engineer/engineerAssignments";
import ProfilePage from "./pages/Engineer/profile";
import CreateProjectPage from "./pages/Manager/createProject";

// ---- Types ----
// Types provided by provider
// ---- Navbar ----
function Navbar() {
  const { user, handleNewUser } = React.useContext(UserContext) as any;
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await postFetcher(`${base_url}/auth/logout`, undefined);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleNewUser(null);
    navigate("/login");
  };

  if (!user) return null;

  // Map role to display label
  const roleLabel =
    user.role === "engineer"
      ? "Engineer"
      : user.role === "manager"
      ? "Manager"
      : "User";

  const titleLabel =
    user.role === "engineer"
      ? "Engineer Dashboard"
      : user.role === "manager"
      ? "Manager Dashboard"
      : "Project Manager";

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      {/* App Name */}
      <div
        className="text-xl font-semibold text-gray-800 cursor-pointer"
        onClick={() => navigate("/")}
      >
        {titleLabel}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Name + Role */}
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate("/profile/me")}
        >
          <span className="font-medium text-gray-800">{user.name || "User"}</span>
          <span className="text-xs text-gray-500">{roleLabel}</span>
        </div>

        {/* Avatar */}
        <Avatar
          onClick={() => navigate("/profile/me")}
          className="cursor-pointer"
        >
          <AvatarImage src="/placeholder-avatar.png" alt="Profile" />
          <AvatarFallback>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>

        {/* Logout Button */}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}

// ---- App ----
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen min-w-[400px] ml-auto mr-auto">
          <Navbar />
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute role="manager">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProtectedRoute role="manager">
                  <ProjectTeamCapacity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute role="manager">
                  <CreateProjectPage />
                </ProtectedRoute>
              }
            />

            {/* Engineer Routes */}
            <Route
              path="/engineer/dashboard"
              element={
                <ProtectedRoute role="engineer">
                  <EngineerAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/me"
              element={
                  <ProfilePage />
              }
            />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
