import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Sidebar({ mode = "scroller", activeMenu, onMenuClick }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "인기 게시물" },
    { label: "자유 게시판" },
    { label: "정보 게시판" },
    { label: "질문 게시판" }, // "문의 게시판" → "질문 게시판"
  ];

  const handleLogoClick = () => navigate("/");

  const handleClick = (item) => {
    // 현재는 scroller 모드만 사용 (MainPage 스크롤 이동)
    onMenuClick?.(item.label);
  };

  return (
    <SidebarWrapper>
      <SidebarTitle onClick={handleLogoClick}>team 404</SidebarTitle>
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          active={activeMenu === item.label}
          onClick={() => handleClick(item)}
        >
          {item.label}
        </MenuItem>
      ))}
    </SidebarWrapper>
  );
}

export default Sidebar;

// ─── 스타일 ──────────────────────────────────────────────────
const SidebarWrapper = styled.aside`
  width: 180px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  height: fit-content;
  align-self: flex-start;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
`;

const SidebarTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 12px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #e1e1e1;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1d6bf3;
  }
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 11px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => (p.active ? "#ffffff" : "#1a1a1a")};
  background: ${(p) => (p.active ? "#1d6bf3" : "transparent")};
  border: 1px solid ${(p) => (p.active ? "#1d6bf3" : "transparent")};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(p) => (p.active ? "#1558d0" : "#f5f5f5")};
  }
`;
