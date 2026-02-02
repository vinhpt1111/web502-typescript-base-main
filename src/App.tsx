import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import ListPage from "./pages/List";
import AddPage from "./pages/Add";
import AuthPage from "./pages/AuthPage";
import ProtectRoute from "./components/ProtectRoute";

type User = {
  username: string;
};

function App() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // 🔥 LOAD USERNAME
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Đăng xuất thành công");
    nav("/login");
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            WEB502 App
          </Link>

          <div className="flex gap-6 items-center">
          <Link to="/list">Trang chủ</Link>
            <Link to="/list">Danh sách</Link>
            <Link to="/add">Thêm mới</Link>

            {user ? (
              <>
                <span>Hello <b>{user.username}</b></span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          <Route path="/list" element={<ListPage />} />

          <Route element={<ProtectRoute />}>
            <Route path="/add" element={<AddPage />} />
            <Route path="/edit/:id" element={<AddPage />} />
          </Route>

          <Route path="/login" element={<AuthPage isLogin />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
