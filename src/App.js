import "./App.css";
import { useState } from "react";
import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserStore from "./context/UserStore";
import Layout from "./pages/Layout";

import MainPage from "./pages/MainPage";
import PostDetailPage from "./pages/PostDetailPage";
import WritePostPage from "./pages/WritePostPage";
import AdminPage from "./pages/AdminPage";
import AuthModal from "./pages/auth/AuthModal";

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

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
              <Route path="/admin" element={<AdminPage />} />
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
