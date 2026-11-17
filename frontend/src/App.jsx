import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "@/pages/Login";
import AuthInitializer from "./components/AuthComponent/AuthInitializer";
import ProtectedRoute from "./components/AuthComponent/ProtectedRoute";
import PublicRoute from "./components/AuthComponent/PublicRoute";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import LinksList from "./pages/LinksList";
import VerifyEmail from "./components/AuthComponent/VerifyEmail";

function App() {
  return (
    <AuthInitializer>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
        <Route
          path="*"
          element={
            <main className="not-found-page">
              <div>
                <span className="page-eyebrow">404 · PAGE NOT FOUND</span>
                <h1>This link seems to be lost.</h1>
                <p>The page you’re looking for doesn’t exist or has moved.</p>
                <Link className="mt-5 inline-flex font-medium text-primary" to="/home">
                  Go to your workspace
                </Link>
              </div>
            </main>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/links" element={<LinksList/>} />
        </Route>
        </Route>
      </Routes>
    </AuthInitializer>
  );
}

export default App;
