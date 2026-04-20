import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const Colors = {
  Primary: "#1A1A1A",
  Accent: "#1D6BF3",
  White: "#FFFFFF",
  Hover: "#2D2D2D",
  TextMuted: "#999999",
};

// 사이드바 배경 (오버레이)
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const SidebarContainer = styled.aside`
  width: 260px;
  height: 100vh;
  background-color: ${Colors.Primary};
  color: ${Colors.White};
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-260px")}; // 닫혔을 때 왼쪽으로 숨김
  transition: left 0.3s ease-in-out; // 부드러운 슬라이드
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3);
`;

const LogoSection = styled.div`
  padding: 2.5rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 800;
  border-bottom: 1px solid #333;
  span {
    color: ${Colors.Accent};
  }
`;

const NavList = styled.nav`
  flex: 1;
  padding: 1.5rem 0.75rem;
`;

const NavItem = styled.div`
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? Colors.Accent : "transparent"};
  color: ${(props) => (props.active ? Colors.White : Colors.TextMuted)};
  transition: 0.2s;
  &:hover {
    background-color: ${Colors.Hover};
    color: ${Colors.White};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1d6bf3;
  }
`;

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path) => {
    navigate(path);
    toggleSidebar(); // 이동 후 사이드바 닫기
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={toggleSidebar}>&times;</CloseButton>
        <LogoSection>
          ADMIN <span>PAGE</span>
        </LogoSection>
        <NavList>
          {[
            { name: "대시보드", path: "/admin/dashboard" },
            { name: "사용자 관리", path: "/admin/users" },
            { name: "게시글 관리", path: "/admin/posts" },
          ].map((item) => (
            <NavItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
            >
              {item.name}
            </NavItem>
          ))}
        </NavList>
      </SidebarContainer>
    </>
  );
};

export default AdminSidebar;
