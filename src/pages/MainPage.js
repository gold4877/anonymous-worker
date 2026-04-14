import { useNavigate } from "react-router-dom";
import { ButtonContainer, TransBtn } from "../style/ButtonStyle";
import styled from "styled-components";

const Home = ({ openAuth }) => {
  const navigate = useNavigate();

  const onClickBtn = (path) => {
    navigate(path);
  };

  return (
    <div>
      <ButtonContainer>
        <TransBtn onClick={() => onClickBtn("/members")}>회원 리스트</TransBtn>
        <TransBtn onClick={() => onClickBtn("/boards")}>게시판</TransBtn>
        <TransBtn onClick={() => onClickBtn("/themeSetting")}>
          테마 설정
        </TransBtn>

        {/* 로그인 / 회원가입 버튼 분리 */}
        <BtnRow>
          <LoginBtn onClick={() => openAuth && openAuth("login")}>
            로그인
          </LoginBtn>
          <SignUpBtn onClick={() => openAuth && openAuth("signup")}>
            회원가입
          </SignUpBtn>
        </BtnRow>
      </ButtonContainer>
    </div>
  );
};

export default Home;

// ─── 스타일 ──────────────────────────────────────────────────
const BtnRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 40px;
`;

const LoginBtn = styled.button`
  padding: 10px 20px;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const SignUpBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #1d6bf3;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background: #1558d0;
  }
`;
