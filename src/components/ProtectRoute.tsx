import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectRoute() {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  if (!isLoggedIn) {
    toast.error("Bạn cần đăng nhập để truy cập");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectRoute;
