import { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import { UserContext } from "../context/UserStore";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 비로그인 or 일반 유저 → /home 으로 차단
  // useEffect(() => {
  //   if (!loginUser) {
  //     navigate("/");
  //     return;
  //   }
  //   if (!loginUser.isAdmin) {
  //     alert("관리자만 접근할 수 있습니다.");
  //     navigate("/home");
  //   }
  // }, [loginUser]);

  // 관리자 아니면 렌더링 자체를 막음
  // if (!loginUser || !loginUser.isAdmin) return null;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <LayoutContainer>
      {!isSidebarOpen && (
        <FloatingMenuButton onClick={toggleSidebar}>
          <span />
          <span />
          <span />
        </FloatingMenuButton>
      )}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;

// ─── 스타일 ──────────────────────────────────────────────────
const LayoutContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  width: 100%;
  min-width: 0;
`;

const FloatingMenuButton = styled.button`
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 32px;
  height: 60px;
  background-color: #1a1a1a;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  span {
    display: block;
    width: 14px;
    height: 2px;
    background-color: white;
    border-radius: 1px;
  }

  &:hover {
    width: 40px;
    background-color: #1d6bf3;
  }
`;
