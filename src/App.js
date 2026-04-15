import "./App.css";
import { useContext, useState } from "react";
import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import UserStore, { UserContext } from "./context/UserStore";
import Layout from "./pages/Layout";

import MainPage from "./pages/MainPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import AuthModal from "./pages/auth/AuthModal";
import AdminLayout from "./component/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import UserManagement from "./pages/admin/UserManagement";
import PostManagement from "./pages/admin/PostManagement";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  // // 임시 관리자 권한 (테스트 시 true로 설정)
  // const isAdmin = true;

  // tab: "login" | "signup"
  const openAuth = (tab = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <>
      <GlobalStyle />
      <UserStore>
        <Router>
          <Routes>
            {/* 메인 — 비로그인도 접근 가능 */}
            <Route path="/" element={<MainPage openAuth={openAuth} />} />

            {/* 로그인 이후 */}
            <Route element={<Layout openAuth={openAuth} />}>
              <Route path="/home" element={<MainPage openAuth={openAuth} />} />
              <Route path="/write" element={<WritePostPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />

              {/* 권한 없는 경우 루트페이지("/")로 이동.
                (임시로 상단에 isAdmin = true 로 박아놨음,
                로그인 유저 정보를 받아와서 권한 확인하는 걸로 바꿔야 할 듯)
                추후 권한 없을 시 아예 보이지 않도록 하는것도 괜찮을듯 합니다. */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* /admin 접속 시 바로 대시보드로 이동 */}
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<DashBoard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="posts" element={<PostManagement />} />
              </Route>
            </Route>
          </Routes>

          {/* Router 안에 있어야 useNavigate 사용 가능 */}
          <AuthModal open={isAuthOpen} close={closeAuth} initialTab={authTab} />
        </Router>
      </UserStore>
    </>
  );
}

export default App;
