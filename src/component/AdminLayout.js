import React, { useState } from "react";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

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
  /* 헤더 높이에 상관없이 화면 중앙쯤에 위치하도록 설정 */
  top: 50%;
  left: 0;
  transform: translateY(-50%); // 수직 중앙 정렬

  width: 32px;
  height: 60px; // 세로로 긴 형태로 만들어 "당기는 핸들" 느낌 부여
  background-color: #1a1a1a;
  border: none;
  /* 오른쪽만 둥글게 깎아 벽에 붙은 느낌 강조 */
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

  /* 햄버거 선 대신 짧은 대시(-) 형태로 미니멀하게 디자인 */
  span {
    display: block;
    width: 14px;
    height: 2px;
    background-color: white;
    border-radius: 1px;
    transition: 0.3s;
  }

  &:hover {
    width: 40px; // 호버 시 살짝 튀어나오는 효과
    background-color: #1d6bf3;
  }
`;

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <LayoutContainer>
      {/* 햄버거 버튼: 사이드바가 닫혀있을 때만 보이거나 혹은 상시 표시 */}
      {!isSidebarOpen && (
        <FloatingMenuButton onClick={toggleSidebar}>
          <span />
          <span />
          <span />
        </FloatingMenuButton>
      )}

      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <MainContent>
        {/* 기존 페이지 콘텐츠 (DashBoard 등) */}
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
