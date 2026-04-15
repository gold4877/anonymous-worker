import { Outlet, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { FiSettings } from "react-icons/fi";
import { FaHome, FaClipboardList } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

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

import {
  Container,
  StyledSideMenu,
  UserContainer,
  UserImage,
  UserIdAndName,
  StyledMenuList,
  StyledMenuItem,
  MenuIcon,
  StyledLink,
  Dummy,
} from "../style/LayoutStyle";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { color, loginUser, handleLogout } = useContext(UserContext);

  const [member, setMember] = useState(null);

  // 로그인 유저 정보로 회원 상세 조회
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
      return;
    }
    const getMember = async () => {
      try {
        const rsp = await AxiosApi.getUser(loginUser.userId);
        // mini_project_base 응답: { success, message, data: { userId, email, name, ... } }
        if (rsp.data.success) {
          setMember(rsp.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getMember();
  }, [loginUser]);

  const onClickLeft = () => setIsMenuOpen(!isMenuOpen);

  const onClickSetting = () => {
    navigate("/themeSetting");
    setIsMenuOpen(false);
  };

  // 로그아웃
  const onClickLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <Container color={color}>
      <header className="mainhead">
        <div className="hambeger">
          {isMenuOpen ? (
            <GiCancel size={32} color="white" onClick={onClickLeft} />
          ) : (
            <GiHamburgerMenu size={32} color="white" onClick={onClickLeft} />
          )}
        </div>
        <div className="setting">
          <FiSettings size={32} color="white" onClick={onClickSetting} />
        </div>

        <StyledSideMenu
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(false)}
        >
          <StyledMenuList>
            {/* 회원 정보 영역 */}
            <UserContainer>
              <UserImage
                src={"http://via.placeholder.com/50"}
                alt="User"
              />
              <UserIdAndName>
                <span>{member?.name || loginUser?.name}</span>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {member?.email || loginUser?.email}
                </span>
              </UserIdAndName>
            </UserContainer>

            {/* 메뉴 항목 */}
            <StyledMenuItem>
              <MenuIcon><FaHome /></MenuIcon>
              <StyledLink to="/home">Home</StyledLink>
            </StyledMenuItem>

            <StyledMenuItem>
              <MenuIcon><FaClipboardList /></MenuIcon>
              <StyledLink to="/boards">Boards</StyledLink>
            </StyledMenuItem>

            <StyledMenuItem>
              <MenuIcon><CgProfile /></MenuIcon>
              <StyledLink to="/members">Members</StyledLink>
            </StyledMenuItem>

            {/* 로그아웃 */}
            <StyledMenuItem
              style={{ cursor: "pointer", color: "#e74c3c" }}
              onClick={onClickLogout}
            >
              <MenuIcon>🚪</MenuIcon>
              <span>Logout</span>
            </StyledMenuItem>
          </StyledMenuList>
        </StyledSideMenu>
      </header>

      <main>
        <Dummy />
        <Outlet />
      </main>
    </Container>
  );
};

export default Layout;
