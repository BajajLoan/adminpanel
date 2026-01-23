import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../screen/home/Home";
import Login from "../pages/Login";
import UserDashboard from "../screen/userDashboard/UserDashboard";

const AppStack = () => {
  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppStack;
