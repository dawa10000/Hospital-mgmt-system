import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const IsLogin = () => {
  const { user } = useSelector((state) => state.userSlice);

  return user ? <Navigate to="/appointment" replace /> : <Outlet />;
};

export default IsLogin;