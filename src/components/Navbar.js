import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 모든 컴포넌트/페이지에서 사용할 통일된 Global CSS Reset
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  
  /* 1단계: 기본 리셋 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  *::before, *::after {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  /* 2단계: HTML 기본값 */
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-font-feature-settings: "kern" 1;
    -moz-font-feature-settings: "kern" 1;
    font-feature-settings: "kern" 1;
    font-kerning: auto;
  }
  
  /* 3단계: BODY 기본값 */
  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.3px;
    color: #1a1a1a;
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
    -webkit-text-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
  }
  
  /* 4단계: 텍스트 요소 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-weight: inherit;
    font-size: inherit;
    line-height: 1.2;
    letter-spacing: inherit;
  }
  
  p, span, div, article, section, main {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    letter-spacing: -0.3px;
  }
  
  /* 5단계: BUTTON 전체 리셋 */
  button {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    font-weight: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  button:focus {
    outline: none;
  }
  
  /* 6단계: INPUT 전체 리셋 */
  input, textarea, select {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    font-weight: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
  }
  
  input::placeholder {
    color: inherit;
    opacity: 0.7;
  }
  
  /* 7단계: 링크 */
  a {
    color: inherit;
    text-decoration: none;
    background-color: transparent;
  }
  
  /* 8단계: 이미지 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    border: none;
  }
  
  /* 9단계: 리스트 */
  ul, ol, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  /* 10단계: 테이블 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  td, th {
    padding: 0;
    margin: 0;
  }
`;

const NavbarWrapper = styled.aside`
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
  position: sticky;
  top: 96px; /* 56px (헤더높이) + 40px (간격) = 96px */
  height: fit-content;
  align-self: flex-start;
  border: 2px solid #1a1a1a;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
`;

const NavbarTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 12px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #e1e1e1;
  text-align: center;
  font-family: "Pretendard", sans-serif;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1d6bf3;
  }
`;

const MenuItem = styled.button`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
  }

  ${(props) =>
    props.active &&
    `
    background: #1D6BF3;
    color: #FFFFFF;
    border: 2px solid #1D6BF3;
    font-weight: 600;
  `}
`;

function Navbar({ mode = "scroller", activeMenu, onMenuClick }) {
  const navigate = useNavigate();
  const menuItems = [
    { label: "인기 게시물", path: "/popular" },
    { label: "자유 게시판", path: "/freeboard" },
    { label: "정보 게시판", path: "/info" },
    { label: "문의 게시판", path: "/qna" },
  ];

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleClick = (item) => {
    if (mode === "scroller") {
      // MainPage: 스크롤 이동
      onMenuClick?.(item.label);
    } else if (mode === "navigator") {
      // 다른 페이지: 페이지 이동
      navigate(item.path);
    }
  };

  return (
    <NavbarWrapper>
      <NavbarTitle onClick={handleLogoClick}>404</NavbarTitle>
      {menuItems.map((item) => (
        <MenuItem
          key={item.label}
          active={activeMenu === item.label}
          onClick={() => handleClick(item)}
        >
          {item.label}
        </MenuItem>
      ))}
    </NavbarWrapper>
  );
}

export default Navbar;
