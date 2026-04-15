import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoIcon from "../assets/404_number_four_icon.svg";

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

const NavbarWrapper = styled.nav`
  background: #ffffff;
  border-bottom: 3px solid #1a1a1a;
  padding: 12px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  padding: 0;
  min-width: fit-content;
  flex-shrink: 0;
  font-family: "Pretendard", sans-serif;
  cursor: pointer;
  transition: color 0.2s;
  background: none;
  border: none;

  &:hover {
    color: #1d6bf3;
  }

  img {
    width: 32px;
    height: 32px;
    display: block;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
  max-width: 500px;
  background: #eeeeee;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #1d6bf3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  min-width: 300px;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
  }
`;

const PrimaryButton = styled(NavButton)`
  color: #ffffff;
  background: #1d6bf3;
  border: 1px solid #1d6bf3;
  font-weight: 600;

  &:hover {
    background: #185fa5;
    border-color: #185fa5;
  }
`;

const AccentButton = styled(NavButton)`
  color: #ffffff;
  background: #1d6bf3;
  border: 1px solid #1d6bf3;
  font-weight: 600;

  &:hover {
    background: #185fa5;
    border-color: #185fa5;
  }
`;

function HeaderBar({ searchValue, onSearch }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <NavbarWrapper>
      <Container>
        <Logo onClick={handleLogoClick}>
          <img src={LogoIcon} alt="404 logo" />
          404
        </Logo>

        <SearchInput
          type="text"
          placeholder="검색어 입력"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />

        <ButtonGroup>
          <PrimaryButton>로그인</PrimaryButton>
          <NavButton>회원가입</NavButton>
          <AccentButton>글쓰기</AccentButton>
        </ButtonGroup>
      </Container>
    </NavbarWrapper>
  );
}

export default HeaderBar;
