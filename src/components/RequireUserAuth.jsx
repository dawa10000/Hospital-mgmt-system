import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireUserAuth = () => {
  const { user } = useSelector((state) => state.userSlice);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireUserAuth;