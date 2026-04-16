import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserStore";

const Header = ({ openAuth, searchValue = "", onSearch }) => {
  const navigate = useNavigate();
  const { loginUser, handleLogout } = useContext(UserContext);

  const onClickLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <HeaderWrap>
      {/* 로고 */}
      <Logo onClick={() => navigate(loginUser ? "/home" : "/")}>
        <svg width="148" height="40" viewBox="0 0 148 40">
          <rect
            x="0"
            y="2"
            width="26"
            height="36"
            rx="8"
            fill="#FFFFFF"
            stroke="#E1E1E1"
            strokeWidth="1.2"
          />
          <rect x="0" y="2" width="26" height="12" rx="8" fill="#1D6BF3" />
          <rect x="0" y="8" width="26" height="6" fill="#1D6BF3" />
          <rect x="9" y="0" width="8" height="8" rx="4" fill="#1558D0" />
          <circle cx="13" cy="24" r="5" fill="#E0E0E0" />
          <rect x="3" y="31" width="20" height="2.5" rx="1.25" fill="#DDDDDD" />
          <rect x="3" y="35" width="13" height="2.5" rx="1.25" fill="#EEEEEE" />
          <text
            x="34"
            y="20"
            fill="#1A1A1A"
            fontSize="14"
            fontWeight="900"
            fontFamily="-apple-system,BlinkMacSystemFont,sans-serif"
            letterSpacing="-0.3"
          >
            team <tspan fill="#1D6BF3">404</tspan>
          </text>
          <text
            x="34"
            y="31"
            fill="#AAAAAA"
            fontSize="7"
            fontFamily="-apple-system,sans-serif"
            letterSpacing="2.5"
          >
            WORKERS ONLY
          </text>
        </svg>
      </Logo>

      {/* 검색바 — onSearch 있을 때만 입력 가능 */}
      <SearchWrap>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          placeholder="관심있는 내용을 검색해보세요!"
          value={searchValue}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          readOnly={!onSearch}
        />
      </SearchWrap>

      {/* 버튼 영역 */}
      <BtnGroup>
        {loginUser ? (
          <>
            <UserName>{loginUser.name}님</UserName>
            <OutlineBtn onClick={() => navigate("/write")}>글쓰기</OutlineBtn>
            <OutlineBtn onClick={onClickLogout}>로그아웃</OutlineBtn>
          </>
        ) : (
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

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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
  background: #ffffff;
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
