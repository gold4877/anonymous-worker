import "./App.css";
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
  return (
    <>
      <GlobalStyle />
      <UserStore>
        <Router>
          <Routes>
            {/* 메인 — 비로그인도 접근 가능 */}
            <Route path="/" element={<MainPage />} />

            {/* 로그인 이후 */}
            <Route element={<Layout />}>
              <Route path="/home" element={<MainPage />} />
              <Route path="/write" element={<WritePostPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Router>
      </UserStore>
    </>
  );
}

export default App;
