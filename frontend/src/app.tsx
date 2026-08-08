import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home";
import { InterviewPage } from "./pages/interview";

import {
  CandidateDashboard,
  CandidateDetail,
  InterviewerDashboard,
  LoginPage,
  ResultPage,
} from "./components/auth-platform";

function Placeholder({
  title,
}: {
  title: string;
}) {
  return (
    <main className="center-page">
      <h1>{title}</h1>

      <p>
        This workspace module is ready to connect
        to your API.
      </p>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/interview"
        element={<InterviewPage />}
      />

      <Route
        path="/candidate/dashboard"
        element={<CandidateDashboard />}
      />

      <Route
        path="/interviewer/dashboard"
        element={<InterviewerDashboard />}
      />

      <Route
        path="/interviewer/candidates/:id"
        element={<CandidateDetail />}
      />

      <Route
        path="/result/:id"
        element={<ResultPage />}
      />

      <Route
        path="/analytics"
        element={
          <Placeholder title="Analytics" />
        }
      />

      <Route
        path="/settings"
        element={
          <Placeholder title="Workspace settings" />
        }
      />

      <Route
        path="/support"
        element={
          <Placeholder title="Support" />
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}