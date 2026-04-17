import "./App.css";
import { useEffect, useState } from "react";
import GlobalStyle from "./style/GlobalStyle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import UserStore, { UserContext } from "./context/UserStore";
import { useContext } from "react";
import Layout from "./pages/Layout";
import EasterEgg from "./component/EasterEgg";
import Header from "./component/Header";
import Footer from "./component/Footer";

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
  const [searchValue, setSearchValue] = useState(""); // ← 검색 상태 App으로 통합
  const [authExtraProps, setAuthExtraProps] = useState({});

  const openAuth = (tab = "login", data = {}) => {
    setAuthTab(tab);
    setAuthExtraProps(data);
    setIsAuthOpen(true);
  };
  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthExtraProps({});
  };

  return (
    <>
      <GlobalStyle />
      <UserStore>
        <Router>
          <EasterEgg />

          <Routes>
            {/* "/" — 비로그인, Header/Footer 직접 포함 + 검색 연결 */}
            <Route
              path="/"
              element={
                <>
                  <Header
                    openAuth={openAuth}
                    searchValue={searchValue}
                    onSearch={setSearchValue}
                  />
                  <MainPage openAuth={openAuth} searchValue={searchValue} />
                  <Footer />
                </>
              }
            />

            {/* 로그인 이후 — Layout 이 Header/Footer 포함 + 검색 연결 */}
            <Route
              element={
                <Layout
                  openAuth={openAuth}
                  searchValue={searchValue}
                  onSearch={setSearchValue}
                />
              }
            >
              <Route
                path="/home"
                element={
                  <MainPage openAuth={openAuth} searchValue={searchValue} />
                }
              />
              <Route path="/write" element={<WritePostPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />

              <Route path="/admin" element={<AdminLayout />}>
                {/* /admin 접속 시 바로 대시보드로 이동 */}
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<DashBoard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="posts" element={<PostManagement />} />
              </Route>
            </Route>
          </Routes>

          <AuthModal
            open={isAuthOpen}
            close={closeAuth}
            initialTab={authTab}
            extraProps={authExtraProps}
          />
        </Router>
      </UserStore>
    </>
  );
}

export default App;
