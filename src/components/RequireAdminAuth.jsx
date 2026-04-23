import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAdminAuth = () => {
  const { user } = useSelector((state) => state.userSlice);
  const admin = user?.role === "admin";
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAdminAuth;