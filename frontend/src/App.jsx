import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "@/pages/Login";
import AuthInitializer from "./components/AuthComponent/AuthInitializer";
import ProtectedRoute from "./components/AuthComponent/ProtectedRoute";
import PublicRoute from "./components/AuthComponent/PublicRoute";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { lazy, Suspense } from "react";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import LinksList from "./pages/LinksList";

function App() {
  return (
    <AuthInitializer>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<h1>Page Not Found</h1>} />
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
