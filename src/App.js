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

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <>
      <GlobalStyle />
      <UserStore>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage openAuth={openAuth} />} />

            {/* 로그인 이후 */}
            <Route element={<Layout openAuth={openAuth} />}>
              <Route path="/home" element={<MainPage />} />
              <Route path="/write" element={<WritePostPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>

          {/* 로그인 / 회원가입 모달 */}
          <AuthModal open={isAuthOpen} close={closeAuth} />
        </Router>
      </UserStore>
    </>
  );
}

export default App;
