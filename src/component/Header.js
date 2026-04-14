import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserStore";

// openAuth: App.js 에서 내려받는 함수 (없으면 버튼 숨김)
const Header = ({ openAuth }) => {
  const navigate = useNavigate();
  const { loginUser, handleLogout } = useContext(UserContext);

  const onClickLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <HeaderWrap>
      {/* 로고 */}
      <Logo onClick={() => navigate("/")}>blind</Logo>

      {/* 검색바 */}
      <SearchWrap>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput placeholder="관심있는 내용을 검색해보세요!" />
      </SearchWrap>

      {/* 버튼 영역 */}
      <BtnGroup>
        {loginUser ? (
          // ── 로그인 상태 ──────────────────────────
          <>
            <UserName>{loginUser.name}님</UserName>
            <OutlineBtn1 onClick={() => navigate("/write")}>글쓰기</OutlineBtn1>
            <OutlineBtn onClick={onClickLogout}>로그아웃</OutlineBtn>
          </>
        ) : (
          // ── 비로그인 상태 ────────────────────────
          <>
            <OutlineBtn onClick={() => openAuth && openAuth("login")}>
              로그인
            </OutlineBtn>
            <PrimaryBtn onClick={() => openAuth && openAuth("signup")}>
              회원가입
            </PrimaryBtn>
          </>
        )}
      </BtnGroup>
    </HeaderWrap>
  );
};

export default Header;

// ─── 스타일 ──────────────────────────────────────────────────
const HeaderWrap = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e1e1e1;
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  font-size: 22px;
  font-weight: 900;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
  white-space: nowrap;
  cursor: pointer;
`;

const SearchWrap = styled.div`
  flex: 1;
  max-width: 480px;
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 9px 16px 9px 38px;
  border-radius: 999px;
  border: 1px solid #e1e1e1;
  background: #f8f8f8;
  font-size: 14px;
  color: #1a1a1a;
  outline: none;
  &::placeholder {
    color: #aaaaaa;
  }
  &:focus {
    border-color: #1d6bf3;
    background: #ffffff;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
`;

const OutlineBtn = styled.button`
  padding: 7px 16px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #f5f5f5;
  }
`;

const OutlineBtn1 = styled.button`
  padding: 7px 16px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #1d6bf3;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #f5f5f5;
  }
`;

const PrimaryBtn = styled.button`
  padding: 7px 16px;
  border: none;
  border-radius: 8px;
  background: #1d6bf3;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #1558d0;
  }
`;
