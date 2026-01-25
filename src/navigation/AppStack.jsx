import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../screen/home/Home";
import Login from "../pages/Login";
import UserDashboard from "../screen/userDashboard/UserDashboard";
import Contact from "../screen/contact/Contact";
import Payment from "../screen/paymen/Payment";
import ChangePassword from "../pages/changePassword/ChangePassword";
import UpdateContact from "../screen/contact/UpdateContact"
import UpdatePayment from "../screen/paymen/UpdatePayment"
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
            // <ProtectedRoute>
              <UserDashboard />
            // </ProtectedRoute>
          }
        />
         <Route
          path="/contact-details"
          element={
            // <ProtectedRoute>
              <Contact />
            // </ProtectedRoute>
          }
        />
        <Route path="/payment-details" element={<Payment/>}/>
        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/updateContact" element={<UpdateContact/>}/>
        <Route path="/updatePayment" element={<UpdatePayment/>}/>
        
      </Routes>
    </>
  );
};

export default AppStack;
